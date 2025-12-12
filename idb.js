const DB_NAME = 'ExamDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

/**
 * Membuka koneksi ke IndexedDB, membuat object store jika belum ada.
 * @returns {Promise<IDBDatabase>} Promise yang me-resolve dengan instance database.
 */
export const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        // Dipanggil saat versi database diubah (misalnya saat pertama kali dibuat)
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Membuat object store 'videos' jika belum ada
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        // Dipanggil saat koneksi berhasil
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        // Dipanggil jika terjadi kesalahan
        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
            reject(event.target.error);
        };
    });
};

/**
 * Menyimpan Blob video ke IndexedDB.
 * @param {string} key - Kunci unik untuk Blob (misalnya ID pengguna + nama stage).
 * @param {Blob} blob - Blob video yang akan disimpan.
 * @returns {Promise<void>} Promise yang me-resolve saat penyimpanan berhasil.
 */
export const saveVideo = async (key, blob) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        // Menyimpan Blob dengan kunci yang diberikan
        const request = store.put(blob, key);

        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
};

/**
 * Mengambil Blob video dari IndexedDB berdasarkan kuncinya.
 * @param {string} key - Kunci Blob yang akan diambil.
 * @returns {Promise<Blob|undefined>} Promise yang me-resolve dengan Blob, atau undefined jika tidak ditemukan.
 */
export const getVideo = async (key) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        
        // Mengambil Blob dengan kunci yang diberikan
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

/**
 * Menghapus semua Blob video dari IndexedDB.
 * @returns {Promise<void>} Promise yang me-resolve saat penghapusan berhasil.
 */
export const clearVideos = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        // Menghapus semua item di object store
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
};