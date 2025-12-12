import { db, doc, getDoc } from './firebase_config.js';

const SESSION_KEY = 'exam_user_session';

/**
 * Menyimpan data pengguna ke sessionStorage.
 * @param {Object} user - Objek pengguna yang akan disimpan.
 */
export function saveSession(user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/**
 * Mengambil data pengguna dari sessionStorage.
 * @returns {Object|null} Objek pengguna atau null jika sesi tidak ditemukan.
 */
export function getSession() {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Memastikan pengguna sudah login. Jika tidak, redirect ke index.html.
 * Juga menonaktifkan tombol kembali (Back Button).
 * @returns {Object|null} Objek pengguna yang sudah login atau null.
 */
export function requireAuth() {
    const user = getSession();

    if (!user) {
        window.location.replace('index.html');
        return null;
    }

    // Menonaktifkan Tombol Kembali (Disable Back Button)
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function (event) {
        history.pushState(null, document.title, location.href);
    });
    
    return user;
}

/**
 * Menghapus sesi pengguna dari sessionStorage.
 */
export function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Menghasilkan ID dokumen Firestore dari nama pengguna.
 * @param {string} username - Nama pengguna.
 * @returns {string} ID yang diformat.
 */
export function generateId(username) {
    // Mengubah ke huruf kecil, mengganti spasi dengan underscore, dan menghapus karakter non-alphanumeric.
    return username.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

/**
 * Mencoba melakukan login pengguna.
 * @param {string} username - Nama pengguna.
 * @param {string} password - Kata sandi.
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>} Hasil login.
 */
export async function login(username, password) {
    const id = generateId(username);
    const docRef = doc(db, 'users', id);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.password === password) {
                return { success: true, user: data };
            }
        }
        
        return { success: false, error: "Invalid username or password" };
        
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Connection failed" };
    }
}