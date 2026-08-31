# 🔑 TOTP Authenticator Browser Extension (Chrome & Edge)

[🇮🇩 Bahasa Indonesia](#-bahasa-indonesia) | [🇬🇧 English](#-english)

---

## 🇮🇩 Bahasa Indonesia

Ekstensi browser berbasis **Manifest V3** yang kompatibel penuh dengan **Google Chrome** dan **Microsoft Edge** untuk menghasilkan kode otentikasi dua faktor (2FA / TOTP) secara *real-time*. Dilengkapi dengan proteksi PIN keamanan, fitur salin otomatis, animasi timer lingkaran, durasi kunci otomatis, serta enkripsi backup AES-256.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)
![Chrome & Edge Supported](https://img.shields.io/badge/Browser-Chrome%20%7C%20Edge-brightgreen.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

### 📥 1. Panduan Mengunduh & Ekstrak Repositori

1. **Buka Halaman GitHub:** Akses halaman utama repositori proyek ini di browser Anda.
2. **Unduh File ZIP:** Klik tombol hijau **`<> Code`** di pojok kanan atas, lalu pilih **`Download ZIP`**.
3. **Ekstrak Folder:**
   * Buka folder `Downloads` di komputer Anda, klik kanan pada file `totp-extension-main.zip`, lalu pilih **Extract All...** (atau *Extract Here* jika menggunakan WinRAR/7-Zip).
   * Pindahkan folder hasil ekstraksi ke lokasi yang aman di PC Anda agar tidak sengaja terhapus (contoh: `C:\xampp\htdocs\totp-extension` atau `D:\Project\totp-extension`).

---

### 🛠️ 2. Cara Instalasi di Browser

#### 🔴 Di Google Chrome:
1. Buka browser **Google Chrome**.
2. Ketik `chrome://extensions/` pada baris alamat (address bar) lalu tekan **Enter**.
3. Aktifkan *toggle* **Developer mode** (Mode Pengembang) di pojok kanan atas layar.
4. Klik tombol **Load unpacked** (Muat yang belum dikemas) di pojok kiri atas.
5. Pilih folder proyek `totp-extension` yang telah diekstrak tadi.
6. Klik ikon **Ekstensi (Puzzle)** di toolbar Chrome, lalu klik ikon **Pin** agar ekstensi tetap terlihat.

#### 🔵 Di Microsoft Edge:
1. Buka browser **Microsoft Edge**.
2. Ketik `edge://extensions/` pada baris alamat (address bar) lalu tekan **Enter**.
3. Aktifkan *toggle* **Developer mode** di panel sebelah kiri bawah.
4. Klik tombol **Load unpacked** di bagian atas layar.
5. Pilih folder proyek `totp-extension` yang telah diekstrak tadi.
6. Klik ikon **Ekstensi (Puzzle)** di toolbar Edge, lalu klik ikon **Mata (Show in toolbar)**.

---

### 🚀 3. Fitur Utama & Penggunaan

Saat pertama kali mengeklik ekstensi, Anda akan diminta untuk **Membuat PIN Baru (4-8 Digit)**.

- 🔐 **Proteksi PIN Akses:** Mengunci daftar kode TOTP serta mengamankan tindakan sensitif (penghapusan akun & ekspor data).
- ⏱️ **Kunci Otomatis Kustom (Auto-Lock Timeout):** Pengaturan durasi mengunci kembali ekstensi (Setiap dibuka, 1m, 5m, 10m, 1h) serta tombol **"🔒 Kunci"** instan di header.
- ⏳ **Visual Circular Countdown Timer:** Animasi timer SVG melingkar ala Google Authenticator di sebelah kode 6-digit yang menyusut secara *real-time* dan berubah merah saat sisa 5 detik.
- ⚡ **Generator Kode Real-Time:** Menghasilkan 6 digit kode TOTP setiap 30 detik menggunakan Web Crypto API lokal.
- 📋 **Salin Satu Klik:** Tombol salin instan untuk menempelkan kode langsung ke *clipboard*.

---

### 📖 4. Panduan 3 Tombol Utama

#### 1. ➕ Tambah Manual
Gunakan tombol ini untuk menambahkan akun 2FA secara satu per satu menggunakan teks kunci rahasia (*Base32 Secret Key*).
- **Kapan digunakan:** Saat mengaktifkan 2FA di situs (seperti GitHub, Google, atau Facebook) dan memilih opsi *"Can't scan QR code"* untuk mendapatkan teks rahasia.
- **Cara pakai:** Klik **Tambah Manual** $\rightarrow$ Masukkan nama akun (contoh: `user@gmail.com`) $\rightarrow$ Masukkan *Secret Key* Base32 $\rightarrow$ Masukkan nama penyedia service (contoh: `Google`).

#### 2. 📥 Import Data
Gunakan tombol ini untuk memindahkan/mengimpor banyak akun sekaligus.
- **Modus 1 (URL Migration Google Authenticator):** Pilih `1` $\rightarrow$ Tempelkan string URL migrasi hasil scan QR Code ekspor Google Authenticator (`otpauth-migration://...`).
- **Modus 2 (File Backup JSON Terenkripsi):** Pilih `2` $\rightarrow$ Unggah file `.json` hasil ekspor terenkripsi $\rightarrow$ Masukkan PIN yang digunakan saat meng-ekspor file.

#### 3. 📤 Export JSON
Gunakan tombol ini untuk membuat cadangan (*backup*) seluruh akun 2FA yang tersimpan ke dalam file `.json` terenkripsi **AES-GCM 256-bit**.
- **Kapan digunakan:** Saat ingin mencadangkan data, berpindah komputer, atau menginstal ulang browser.
- **Cara pakai:** Klik **Export JSON** $\rightarrow$ Masukkan PIN keamanan Anda $\rightarrow$ File `totp_encrypted_backup_xxx.json` akan otomatis terunduh.

---

### 🛡️ 5. Keamanan & Privasi Data

1. **100% Pemrosesan Lokal (Offline Only):** Tidak pernah mengirimkan data *Secret Key*, PIN, atau akun ke server mana pun di internet.
2. **Enkripsi Backup AES-256-GCM:** File `.json` dienkripsi menggunakan PIN via algoritma **AES-GCM 256-bit** dan PBKDF2.
3. **Penyimpanan Terisolasi:** Data disimpan menggunakan API `chrome.storage.local` yang terisolasi di internal browser.
4. **Tanpa Pelacakan (Zero Telemetry):** Bebas dari skrip analitik, pelacak perilaku, atau cookie pihak ketiga.

---

## 🇬🇧 English

A lightweight **Manifest V3** browser extension fully compatible with **Google Chrome** and **Microsoft Edge** for generating real-time two-factor authentication (2FA / TOTP) codes.

---

### 📥 1. Download & Extraction Guide

1. **Open GitHub Repository:** Navigate to the main repository page in your browser.
2. **Download ZIP:** Click the green **`<> Code`** button in the top right, then select **`Download ZIP`**.
3. **Extract Folder:**
   * Go to your `Downloads` folder, right-click `totp-extension-main.zip`, and choose **Extract All...**.
   * Move the extracted folder to a safe location on your computer (e.g., `C:\xampp\htdocs\totp-extension`).

---

### 🛠️ 2. Browser Installation Guide

#### 🔴 On Google Chrome:
1. Open **Google Chrome** and go to `chrome://extensions/`.
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the extracted `totp-extension` project folder.
5. Click the **Extensions (Puzzle)** icon on the toolbar and pin the extension.

#### 🔵 On Microsoft Edge:
1. Open **Microsoft Edge** and go to `edge://extensions/`.
2. Enable **Developer mode** in the bottom-left panel.
3. Click **Load unpacked** at the top.
4. Select the extracted `totp-extension` project folder.
5. Click the **Extensions (Puzzle)** icon on the toolbar and set it to **Show in toolbar**.

---

### 📖 3. Usage & 3 Main Buttons

- ➕ **Manual Add:** Add 2FA accounts using a Base32 secret text key.
- 📥 **Import Data:** Import from Google Authenticator migration URLs (`otpauth-migration://`) or encrypted `.json` backup files.
- 📤 **Export JSON:** Export a PIN-encrypted **AES-256-GCM** `.json` backup file.

---

## 📂 Project Structure / Struktur Proyek

```text
totp-extension/
├── manifest.json            # Manifest V3 extension configuration
├── popup.html               # Popup UI layout
├── popup.js                 # Event listeners, animation, logic, and storage operations
├── popup.css                # Styling for popup interface, SVG timer, and layout
├── icon.png                 # Extension logo
├── .gitignore               # Ignored files for Git
└── lib/
    ├── base32.js            # Base32 string decoder
    ├── jsotp.min.js         # HMAC-SHA1 TOTP calculation engine
    └── google-auth-parser.js # Google Auth Protobuf migration URL parser