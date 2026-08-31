# 🔑 TOTP Authenticator Browser Extension (Chrome & Edge)

[🇮🇩 Bahasa Indonesia](#-bahasa-indonesia) | [🇬🇧 English](#-english)

---

## 🇮🇩 Bahasa Indonesia

Ekstensi browser berbasis **Manifest V3** yang kompatibel penuh dengan **Google Chrome** dan **Microsoft Edge** untuk menghasilkan kode otentikasi dua faktor (2FA / TOTP) secara *real-time*. Dilengkapi dengan proteksi PIN keamanan, fitur salin otomatis, animasi timer lingkaran, durasi kunci otomatis, serta enkripsi backup AES-256.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)
![Chrome & Edge Supported](https://img.shields.io/badge/Browser-Chrome%20%7C%20Edge-brightgreen.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

### 🚀 Fitur Utama

- 🌐 **Kompatibilitas Lintas Browser:** Berjalan lancar di **Google Chrome**, **Microsoft Edge**, Brave, Opera, dan browser berbasis Chromium lainnya.
- 🔐 **Proteksi PIN Akses:** Mengunci daftar kode TOTP serta mengamankan tindakan sensitif (penghapusan akun & ekspor data).
- ⏱️ **Kunci Otomatis Kustom (Auto-Lock Timeout):** Pengaturan batas waktu mengunci kembali ekstensi (Setiap dibuka, 1m, 5m, 10m, 1h) serta tombol **"🔒 Kunci"** instan.
- ⏳ **Visual Circular Countdown Timer:** Animasi timer SVG melingkar ala Google Authenticator yang berkurang secara *real-time* dan berubah merah saat sisa 5 detik.
- ⚡ **Generator Kode Real-Time:** Menghasilkan 6 digit kode TOTP setiap 30 detik menggunakan Web Crypto API lokal.
- 📋 **Salin Satu Klik:** Tombol salin instan untuk menempelkan kode langsung ke *clipboard*.
- 🔄 **Impor Google Authenticator:** Mendukung parsing data migrasi `otpauth-migration://` dari Google Authenticator.
- 💾 **Encrypted Backup JSON:** Ekspor file `.json` terenkripsi **AES-GCM 256-bit** berbasis PIN untuk migrasi aman antar komputer/browser.

---

### 🛡️ Keamanan & Privasi Data

Ekstensi ini dirancang dengan prinsip **Privacy by Design** untuk memastikan data sensitif 2FA Anda aman:

1. **100% Pemrosesan Lokal (Offline Only):**
   * Ekstensi ini **tidak pernah** mengirimkan data *Secret Key*, PIN, atau informasi akun Anda ke server mana pun di internet.
   * Seluruh kalkulasi algoritma HMAC-SHA1/TOTP dijalankan sepenuhnya di dalam mesin browser lokal Anda.

2. **Enkripsi Backup AES-256-GCM:**
   * File `.json` hasil *Export* dienkripsi ketat menggunakan PIN Anda via algoritma **AES-GCM 256-bit** dan PBKDF2. Kunci rahasia Anda tidak dapat dibaca dalam bentuk teks biasa (*plain text*).

3. **Penyimpanan Terisolasi (Isolated Storage):**
   * Data disimpan menggunakan API `chrome.storage.local` yang terisolasi ketat di dalam ruang penyimpanan internal browser Anda.
   * Aplikasi web external atau ekstensi lain **tidak memiliki akses** untuk membaca data ini.

4. **Tanpa Pelacakan & Analytics (Zero Telemetry):**
   * Tidak ada skrip analitik, pelacak perilaku pengguna, atau cookie pihak ketiga yang dipasang pada ekstensi ini.

---

### 📖 Panduan Penggunaan 3 Tombol Utama

#### 1. ➕ Tambah Manual
Gunakan tombol ini jika Anda ingin menambahkan akun 2FA secara satu per satu menggunakan teks kunci rahasia (*Base32 Secret Key*).
- **Kapan digunakan:** Saat mengaktifkan 2FA di layanan web (seperti GitHub, Google, atau Facebook) dan Anda memilih opsi *"Can't scan QR code"* untuk mendapatkan teks rahasia.
- **Cara pakai:**
  1. Klik **Tambah Manual**.
  2. Masukkan nama akun (contoh: `user@gmail.com`).
  3. Masukkan *Secret Key* Base32 (kombinasi huruf A-Z dan angka 2-7).
  4. Masukkan nama penyedia service (contoh: `Google` atau `GitHub`).

#### 2. 📥 Import Data
Gunakan tombol ini untuk memindahkan/mengimpor banyak akun sekaligus tanpa perlu mengetiknya satu per satu.
- **Modus 1 (URL Migration Google Authenticator):**
  1. Buka aplikasi Google Authenticator di HP > pilih **Transfer accounts** / **Export accounts**.
  2. Pindai QR Code hasil ekspor menggunakan QR Code Scanner di HP lain/web untuk mendapatkan string URL yang berawalan `otpauth-migration://offline?data=...`.
  3. Klik **Import Data** di ekstensi > pilih angka `1` > tempelkan URL migrasi tersebut.
- **Modus 2 (File Backup JSON Terenkripsi):**
  1. Klik **Import Data** > pilih angka `2`.
  2. Pilih file `.json` hasil ekspor terenkripsi dari ekstensi ini di perangkat lain.
  3. Masukkan PIN yang digunakan saat meng-ekspor file tersebut untuk mendekripsi data.

#### 3. 📤 Export JSON
Gunakan tombol ini untuk membuat cadangan (*backup*) seluruh akun 2FA yang tersimpan ke dalam file `.json` terenkripsi.
- **Kapan digunakan:** Saat Anda ingin mencadangkan data, berpindah komputer, atau menginstal ulang browser.
- **Cara pakai:**
  1. Klik **Export JSON**.
  2. Masukkan PIN keamanan Anda untuk mengkonfirmasi dan meng-enkripsi file backup.
  3. File `totp_encrypted_backup_xxx.json` akan otomatis terunduh. Simpan file ini di tempat yang aman.

---

### 🛠️ Cara Instalasi

#### 🔴 Di Google Chrome:
1. Unduh atau *clone* repositori ini ke komputer Anda.
2. Buka Google Chrome, lalu akses alamat `chrome://extensions/`.
3. Aktifkan **Developer mode** (Mode Pengembang) di pojok kanan atas.
4. Klik tombol **Load unpacked** (Muat yang belum dikemas) di pojok kiri atas.
5. Pilih folder proyek `totp-extension` ini.

#### 🔵 Di Microsoft Edge:
1. Unduh atau *clone* repositori ini ke komputer Anda.
2. Buka Microsoft Edge, lalu akses alamat `edge://extensions/`.
3. Aktifkan **Developer mode** di panel sebelah kiri bawah.
4. Klik tombol **Load unpacked** di bagian atas.
5. Pilih folder proyek `totp-extension` ini.

---

## 🇬🇧 English

A lightweight **Manifest V3** browser extension fully compatible with **Google Chrome** and **Microsoft Edge** for generating real-time two-factor authentication (2FA / TOTP) codes directly in your browser. Features PIN security protection, circular countdown timers, configurable auto-lock duration, 1-click copy, AES-256 backup encryption, and Google Authenticator import support.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)
![Chrome & Edge Supported](https://img.shields.io/badge/Browser-Chrome%20%7C%20Edge-brightgreen.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

### 🚀 Key Features

- 🌐 **Cross-Browser Support:** Works seamlessly on **Google Chrome**, **Microsoft Edge**, Brave, Opera, and other Chromium-based browsers.
- 🔐 **PIN Access Protection:** Locks TOTP code access and secures sensitive actions (account deletion & data export).
- ⏱️ **Custom Auto-Lock Timeout:** Configurable inactivity timeout (Every open, 1m, 5m, 10m, 1h) plus an instant **"🔒 Lock Now"** button.
- ⏳ **Visual Circular Countdown Timer:** Google Authenticator-style SVG ring animation that diminishes in real-time and turns red in the last 5 seconds.
- ⚡ **Real-Time Code Generator:** Generates 6-digit TOTP codes every 30 seconds using native Web Crypto API.
- 📋 **One-Click Copy:** Instant copy button to send codes directly to your clipboard.
- 🔄 **Google Authenticator Import:** Parses `otpauth-migration://` migration payload directly from Google Authenticator.
- 💾 **AES-256 Encrypted JSON Backup:** Export and import PIN-encrypted `.json` backup files for secure migration across computers/browsers.

---

### 🛡️ Security & Data Privacy

This extension is engineered with **Privacy by Design** principles to ensure your sensitive 2FA credentials remain safe:

1. **100% Local Processing (Offline Only):**
   * This extension **never** transmits your Secret Keys, PIN, or account info to any external server.
   * All HMAC-SHA1/TOTP calculations are executed natively within your browser environment.

2. **AES-256-GCM Encrypted Backups:**
   * Exported `.json` files are encrypted using your PIN via **AES-GCM 256-bit** and PBKDF2 key derivation. Your secret keys are never stored as plain text in backups.

3. **Isolated Local Storage:**
   * Credentials are saved using `chrome.storage.local`, which is strictly sandboxed inside your browser.
   * External websites or other browser extensions **cannot** access or read your stored keys.

4. **Zero Telemetry & Tracking:**
   * No analytics scripts, user behavior trackers, or third-party cookies are included in this project.

---

### 📖 3 Main Buttons Usage Guide

#### 1. ➕ Manual Add (Tambah Manual)
Use this button to manually add a 2FA account using its Base32 secret key text.
- **When to use:** When setting up 2FA on websites (like GitHub, Google, or Facebook) and selecting the *"Can't scan QR code"* option to reveal the secret text key.
- **How to use:**
  1. Click **Tambah Manual**.
  2. Enter account name (e.g., `user@gmail.com`).
  3. Enter Base32 Secret Key (letters A-Z and numbers 2-7).
  4. Enter Issuer name (e.g., `Google` or `GitHub`).

#### 2. 📥 Import Data
Use this button to bulk import accounts from Google Authenticator or an encrypted JSON backup file.
- **Mode 1 (Google Authenticator Migration URL):**
  1. Open Google Authenticator on your mobile phone > select **Transfer accounts** / **Export accounts**.
  2. Scan the generated QR code using another device/scanner to obtain the string starting with `otpauth-migration://offline?data=...`.
  3. Click **Import Data** in the extension > type `1` > paste the migration URL.
- **Mode 2 (Encrypted JSON Backup File):**
  1. Click **Import Data** > type `2`.
  2. Select the exported `.json` file from another browser/computer.
  3. Enter the PIN used during export to decrypt and restore the backup data.

#### 3. 📤 Export JSON
Use this button to generate a PIN-encrypted backup file containing all your stored 2FA accounts in `.json` format.
- **When to use:** When backing up data, switching computers, or reinstalling your browser.
- **How to use:**
  1. Click **Export JSON**.
  2. Enter your security PIN for confirmation and encryption.
  3. The `totp_encrypted_backup_xxx.json` file will automatically download. Store this file in a safe location.

---

### 🛠️ Installation Guide

#### 🔴 On Google Chrome:
1. Download or clone this repository to your computer.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select this `totp-extension` project folder.

#### 🔵 On Microsoft Edge:
1. Download or clone this repository to your computer.
2. Open Microsoft Edge and navigate to `edge://extensions/`.
3. Enable **Developer mode** in the bottom-left panel.
4. Click **Load unpacked** at the top.
5. Select this `totp-extension` project folder.

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