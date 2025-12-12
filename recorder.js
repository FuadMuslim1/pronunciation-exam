import { saveVideo } from './idb.js';

let mediaRecorder;
let recordedChunks = [];
let stream;
let timerInterval;

/**
 * Menginisialisasi kamera dan mikrofon.
 * @param {HTMLVideoElement} videoElement - Elemen <video> untuk menampilkan pratinjau.
 * @returns {Promise<boolean>} True jika inisialisasi berhasil, False jika gagal.
 */
export async function initCamera(videoElement) {
    try {
        // Mengakses media dengan preferensi: Video (User-facing, 640x480) dan Audio
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
            audio: true
        });
        
        videoElement.srcObject = stream;
        return true;
    } catch (err) {
        console.error("Error accessing media devices:", err);
        alert("Camera and Microphone access is required. Please check your permissions.");
        return false;
    }
}

/**
 * Memulai perekaman media.
 */
export function startRecording() {
    if (!stream) {
        console.error("No stream available");
        return;
    }

    recordedChunks = [];
    
    // Mencari MIME type yang didukung untuk MediaRecorder
    const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4' // Fallback untuk Safari
    ];
    
    let options = {};
    for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
            options = { mimeType: mime };
            console.log("Using mimeType:", mime);
            break;
        }
    }
    
    try {
        mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
        console.warn("MediaRecorder init failed with options, trying default", e);
        mediaRecorder = new MediaRecorder(stream);
    }

    // Mengumpulkan data yang tersedia
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.start(1000); // Kumpulkan chunk setiap detik
    console.log("Recording started");
}

/**
 * Menghentikan perekaman, menyimpan video ke IndexedDB, dan menghentikan trek media.
 * @param {string} key - Kunci untuk menyimpan video di IndexedDB.
 * @returns {Promise<void>} Promise yang me-resolve setelah penyimpanan selesai.
 */
export async function stopRecordingAndSave(key) {
    return new Promise((resolve) => {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            resolve();
            return;
        }

        mediaRecorder.onstop = async () => {
            // Menggabungkan chunk menjadi satu Blob video
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            
            // Menyimpan Blob ke IndexedDB menggunakan fungsi dari idb.js
            await saveVideo(key, blob);

            // Menghentikan semua trek (kamera dan mikrofon)
            stream.getTracks().forEach(track => track.stop());
            
            // Menghentikan interval timer
            clearInterval(timerInterval);
            
            console.log(`Saved ${key}, size: ${blob.size}`);
            resolve();
        };

        mediaRecorder.stop();
    });
}

/**
 * Memulai fungsi hitung mundur (timer).
 * @param {number} duration - Durasi timer dalam detik.
 * @param {HTMLElement} displayElement - Elemen untuk menampilkan waktu.
 * @param {Function} onFinish - Fungsi yang dipanggil saat waktu habis.
 */
export function startTimer(duration, displayElement, onFinish) {
    let timer = duration;

    function updateDisplay() {
        const minutes = parseInt(timer / 60, 10);
        const seconds = parseInt(timer % 60, 10);
        displayElement.textContent = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }

    updateDisplay(); // Tampilkan waktu awal

    timerInterval = setInterval(() => {
        timer--;
        updateDisplay();

        if (timer < 0) {
            clearInterval(timerInterval);
            if (onFinish) onFinish();
        }
    }, 1000);
}