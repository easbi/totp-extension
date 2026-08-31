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

### 📖 4. Panduan Detail Penggunaan 3 Tombol Utama

#### 1. ➕ Tambah Manual
Gunakan tombol ini untuk menambahkan akun 2FA secara satu per satu menggunakan teks kunci rahasia (*Base32 Secret Key*).

* **Cara Mendapatkan Secret Key dari Website:**
  1. Buka halaman pengaturan keamanan di website yang ingin diamankan (misal: *Google Account > Security > 2-Step Verification* atau *GitHub > Password & Authentication*).
  2. Pilih opsi **Set up Authenticator app**.
  3. Saat gambar **QR Code** muncul di layar, cari dan klik tautan bertuliskan **"Can't scan it?"**, **"Can't scan QR code?"**, atau **"Show Secret Key"**.
  4. Salin (*copy*) deretan teks rahasia Base32 yang tampil (contoh kombinasi huruf dan angka: `JBSWY3DPEHPK3PXP`).

* **Cara Memasukkan ke Ekstensi:**
  1. Klik tombol **➕ Tambah Manual** di ekstensi.
  2. Masukkan nama akun (contoh: `user@gmail.com`).
  3. Tempelkan (*paste*) **Secret Key Base32** yang telah disalin dari website.
  4. Masukkan nama penyedia service (contoh: `Google` atau `GitHub`).
  5. Klik **OK**.

---

#### 2. 📥 Import Data
Gunakan tombol ini untuk memindahkan banyak akun sekaligus tanpa mengetik satu per satu.

* **Modus 1 (Impor dari Google Authenticator HP via Transfer Accounts):**
  1. Buka aplikasi **Google Authenticator** di HP Anda.
  2. Ketuk ikon menu (garis/titik tiga di pojok atas) > pilih **Transfer accounts** > pilih **Export accounts**.
  3. Verifikasi keamanan HP (PIN/Biometrik), lalu **centang akun mana saja** yang ingin dipindahkan ke ekstensi. Klik **Next**.
  4. Aplikasi HP akan menampilkan sebuah **QR Code**. Pindai QR Code tersebut menggunakan perangkat lain atau alat pemindai QR (*QR Code Scanner*) untuk mendapatkan string teks URL.
  5. Salin teks string URL yang didapat (selalu berawalan `otpauth-migration://offline?data=...`).
  6. Buka ekstensi di browser > klik **📥 Import Data** > pilih angka **`1`** > tempelkan (*paste*) URL migrasi tersebut.

* **Modus 2 (File Backup JSON Terenkripsi):**
  1. Klik **📥 Import Data** di ekstensi > pilih angka **`2`**.
  2. Pilih file `.json` hasil ekspor terenkripsi dari ekstensi ini di komputer/browser lain.
  3. Masukkan PIN yang digunakan saat meng-ekspor file tersebut untuk mendekripsi data.

---

#### 3. 📤 Export JSON
Gunakan tombol ini untuk membuat cadangan (*backup*) seluruh akun 2FA yang tersimpan ke dalam file `.json` terenkripsi **AES-GCM 256-bit**.

* **Kapan digunakan:** Saat ingin mencadangkan data, berpindah komputer, atau menginstal ulang browser.
* **Cara pakai:**
  1. Klik tombol **📤 Export JSON**.
  2. Masukkan PIN keamanan Anda untuk konfirmasi dan pengenkripsian data.
  3. File `totp_encrypted_backup_xxx.json` akan otomatis terunduh ke komputer Anda. Simpan file ini di tempat yang aman.

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

### 📖 Usage & 3 Main Buttons Guide

- ➕ **Manual Add:** Copy the Base32 secret key text from the website's 2FA setup screen (via *"Can't scan QR code"*) and paste it into the extension.
- 📥 **Import Data:** 
  - **Mode 1:** Use Google Authenticator's **Transfer accounts > Export accounts** feature on your phone, scan the QR code to get the `otpauth-migration://` URL, and paste it into the extension.
  - **Mode 2:** Upload an encrypted `.json` backup file and decrypt it using your PIN.
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