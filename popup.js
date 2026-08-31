let appPin = null;
let lockTimeoutMins = 0;
let timerInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  checkPinStatus();
  
  // Event listener Layar Kunci & Pengaturan Timeout
  document.getElementById('btn-unlock').addEventListener('click', handleUnlock);
  document.getElementById('btn-lock-now').addEventListener('click', lockNow);
  document.getElementById('select-timeout').addEventListener('change', updateTimeoutSetting);
  
  // Event listener Tombol Aksi Utama
  document.getElementById('btn-add').addEventListener('click', addTokenManual);
  document.getElementById('btn-import').addEventListener('click', importData);
  document.getElementById('btn-export').addEventListener('click', exportToJson);
});

// 1. Cek Status PIN & Waktu Terakhir Unlock
function checkPinStatus() {
  chrome.storage.local.get(['app_pin', 'last_unlock_time', 'lock_timeout_mins'], (result) => {
    appPin = result.app_pin || null;
    lockTimeoutMins = result.lock_timeout_mins !== undefined ? result.lock_timeout_mins : 0;
    
    const selectElem = document.getElementById('select-timeout');
    if (selectElem) selectElem.value = lockTimeoutMins;

    if (!appPin) {
      document.getElementById('pin-instruction').innerText = "Buat PIN Baru (4-8 digit):";
      document.getElementById('btn-unlock').innerText = "Simpan PIN";
    } else {
      document.getElementById('pin-instruction').innerText = "Masukkan PIN untuk membuka:";
      document.getElementById('btn-unlock').innerText = "Buka Akses";

      const now = Date.now();
      const lastUnlock = result.last_unlock_time || 0;
      const elapsedMinutes = (now - lastUnlock) / (1000 * 60);

      // JIKA timeout > 0 DAN durasi belum melebihi batas -> LANGSUNG UNLOCK
      if (lockTimeoutMins > 0 && elapsedMinutes < lockTimeoutMins) {
        showMainScreen();
        return;
      }
    }
    
    showPinScreen();
  });
}

// 2. Logika Buka Kunci (Unlock)
function handleUnlock() {
  const inputPin = document.getElementById('pin-input').value;
  if (!inputPin) return alert("Masukkan PIN!");

  if (!appPin) {
    if (inputPin.length < 4) {
      alert("PIN minimal 4 digit!");
      return;
    }
    chrome.storage.local.set({ 
      app_pin: inputPin,
      last_unlock_time: Date.now()
    }, () => {
      appPin = inputPin;
      alert("PIN Berhasil dibuat!");
      showMainScreen();
    });
  } else if (inputPin === appPin) {
    chrome.storage.local.set({ last_unlock_time: Date.now() }, () => {
      showMainScreen();
    });
  } else {
    alert("PIN Salah!");
    document.getElementById('pin-input').value = '';
  }
}

// 3. Logika Kunci Sekarang (Manual Lock)
function lockNow() {
  chrome.storage.local.set({ last_unlock_time: 0 }, () => {
    document.getElementById('pin-input').value = '';
    showPinScreen();
  });
}

// 4. Logika Mengubah Pengaturan Durasi Timeout
function updateTimeoutSetting(e) {
  const newTimeout = parseInt(e.target.value, 10);
  lockTimeoutMins = newTimeout;
  chrome.storage.local.set({ lock_timeout_mins: newTimeout }, () => {
    console.log(`Auto-lock timeout diubah ke: ${newTimeout} menit`);
  });
}

// Helper Tampilan Screen & Timer Generator
function showMainScreen() {
  document.getElementById('pin-screen').classList.add('hidden');
  document.getElementById('main-screen').classList.remove('hidden');
  loadTokens();
  
  if (timerInterval) clearInterval(timerInterval);
  
  // Eksekusi langsung agar animasi & angka jalan tanpa tundaan 1 detik
  updateCodes();
  timerInterval = setInterval(() => {
    updateCodes();
  }, 1000);
}

function showPinScreen() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  document.getElementById('main-screen').classList.add('hidden');
  document.getElementById('pin-screen').classList.remove('hidden');
}

// 5. Ambil dan Render Data Akun
function loadTokens() {
  chrome.storage.local.get(['totp_tokens'], (result) => {
    const tokens = result.totp_tokens || [];
    renderTokens(tokens);
  });
}

function renderTokens(tokens) {
  const listEl = document.getElementById('token-list');
  if (!listEl) return;
  listEl.innerHTML = '';
  
  if (tokens.length === 0) {
    listEl.innerHTML = '<p style="text-align:center; color:#888; font-size:12px;">Belum ada akun tersimpan.</p>';
    return;
  }

  tokens.forEach((t, index) => {
    const card = document.createElement('div');
    card.className = 'token-card';
    card.innerHTML = `
      <div class="account-info">
        <div class="issuer">${t.issuer || 'Unknown'}</div>
        <div class="account-name">${t.name}</div>
      </div>
      <div class="code-wrapper">
        <svg class="timer-container" width="18" height="18" viewBox="0 0 18 18">
          <circle class="timer-circle-bg" cx="9" cy="9" r="7"></circle>
          <circle class="timer-circle" id="timer-${index}" cx="9" cy="9" r="7"></circle>
        </svg>
        <div class="code" id="code-${index}">------</div>
        <button class="btn-copy" data-index="${index}">Salin</button>
        <button class="btn-delete" data-index="${index}">Hapus</button>
      </div>
    `;
    listEl.appendChild(card);
  });

  document.querySelectorAll('.btn-copy').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      copyToClipboard(index, e.target);
    });
  });

  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      deleteTokenWithPin(index);
    });
  });

  updateCodes();
}

// 6. Copy ke Clipboard
function copyToClipboard(index, btnElement) {
  const codeEl = document.getElementById(`code-${index}`);
  if (!codeEl) return;

  const codeText = codeEl.innerText.replace(/\s+/g, '');
  if (codeText === '------') {
    alert("Kode belum siap, silakan tunggu sebentar.");
    return;
  }

  navigator.clipboard.writeText(codeText).then(() => {
    const originalText = btnElement.innerText;
    btnElement.innerText = 'Tersalin!';
    btnElement.style.background = '#28a745';

    setTimeout(() => {
      btnElement.innerText = originalText;
      btnElement.style.background = '';
    }, 1500);
  }).catch(err => {
    console.error('Gagal menyalin kode:', err);
  });
}

// 7. Hapus Akun Menggunakan PIN
function deleteTokenWithPin(index) {
  const confirmPin = prompt("Masukkan PIN Anda untuk mengonfirmasi penghapusan:");
  
  if (confirmPin === appPin) {
    chrome.storage.local.get(['totp_tokens'], (result) => {
      const tokens = result.totp_tokens || [];
      const removedAccount = tokens[index]?.name || 'Akun';
      tokens.splice(index, 1);
      
      chrome.storage.local.set({ totp_tokens: tokens }, () => {
        alert(`${removedAccount} berhasil dihapus.`);
        loadTokens();
      });
    });
  } else if (confirmPin !== null) {
    alert("PIN Salah! Penghapusan dibatalkan.");
  }
}

// 8. Generate Kode TOTP Real-time & Animasi Ring Timer
async function updateCodes() {
  const epoch = Math.floor(Date.now() / 1000);
  const secondsRemaining = 30 - (epoch % 30);
  const maxDash = 43.98; // Keliling 2 * PI * r (r=7)
  const strokeOffset = maxDash * (1 - secondsRemaining / 30);

  chrome.storage.local.get(['totp_tokens'], async (result) => {
    const tokens = result.totp_tokens || [];

    for (let index = 0; index < tokens.length; index++) {
      const t = tokens[index];
      
      // Update Kode OTP
      try {
        if (window.jsotp && window.jsotp.TOTP) {
          const totp = new window.jsotp.TOTP(t.secret);
          const code = await totp.generateCode();
          const codeEl = document.getElementById(`code-${index}`);
          if (codeEl && codeEl.innerText !== code) {
            codeEl.innerText = code;
          }
        }
      } catch (e) {
        console.error("Gagal generate TOTP:", e);
      }

      // Update Animasi Lingkaran Timer
      const timerCircle = document.getElementById(`timer-${index}`);
      if (timerCircle) {
        if (secondsRemaining === 30) {
          timerCircle.style.transition = 'none';
        } else {
          timerCircle.style.transition = 'stroke-dashoffset 1s linear, stroke 0.3s ease';
        }

        timerCircle.style.strokeDashoffset = strokeOffset;

        if (secondsRemaining <= 5) {
          timerCircle.style.stroke = '#dc3545';
        } else {
          timerCircle.style.stroke = '#007bff';
        }
      }
    }
  });
}

// 9. Tambah Akun Manual
function addTokenManual() {
  const name = prompt("Masukkan Nama Akun (misal: user@gmail.com):");
  if (!name) return;
  let secret = prompt("Masukkan Secret Key (Base32):");
  if (!secret) return;
  const issuer = prompt("Masukkan Provider/Issuer (misal: Google, GitHub):") || "Manual";

  secret = secret.toUpperCase().replace(/[^A-Z2-7]/g, '');
  const newToken = { name, secret, issuer };

  chrome.storage.local.get(['totp_tokens'], (result) => {
    const tokens = result.totp_tokens || [];
    tokens.push(newToken);
    chrome.storage.local.set({ totp_tokens: tokens }, () => {
      loadTokens();
    });
  });
}

// --- FUNGSI HELPER ENKRIPSI AES WEB CRYPTO ---
async function getKeyFromPin(pin, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(pin),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// 10. Export JSON Terenkripsi AES
async function exportToJson() {
  const confirmPin = prompt("Masukkan PIN Anda untuk meng-enkripsi file backup:");
  if (confirmPin !== appPin) {
    if (confirmPin !== null) alert("PIN Salah! Export dibatalkan.");
    return;
  }

  chrome.storage.local.get(['totp_tokens'], async (result) => {
    const tokens = result.totp_tokens || [];
    if (tokens.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    try {
      const enc = new TextEncoder();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await getKeyFromPin(confirmPin, salt);

      const encryptedContent = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        enc.encode(JSON.stringify(tokens))
      );

      const backupData = {
        encrypted: true,
        salt: Array.from(salt),
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedContent))
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `totp_encrypted_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      alert("Backup terenkripsi berhasil diunduh!");
    } catch (e) {
      alert("Gagal meng-enkripsi data backup.");
      console.error(e);
    }
  });
}

// 11. Import Data (Mendukung JSON Terenkripsi & Migration URL)
function importData() {
  const choice = prompt("Pilih mode Import:\n1. Input URL Migration Google Auth\n2. Upload File Backup JSON\n\nKetik '1' atau '2':");
  
  if (choice === '1') {
    let migrationUrl = prompt("Masukkan URL Migration Google Authenticator (otpauth-migration://...):");
    if (migrationUrl) parseGoogleAuthMigration(migrationUrl);
  } else if (choice === '2') {
    const fileInput = document.getElementById('import-file');
    if (fileInput) {
      fileInput.click();
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const parsedFile = JSON.parse(event.target.result);
            let importedTokens = [];

            if (parsedFile.encrypted) {
              const inputPin = prompt("File ini terenkripsi. Masukkan PIN yang digunakan saat export:");
              if (!inputPin) return;

              try {
                const salt = new Uint8Array(parsedFile.salt);
                const iv = new Uint8Array(parsedFile.iv);
                const data = new Uint8Array(parsedFile.data);
                const key = await getKeyFromPin(inputPin, salt);

                const decryptedContent = await crypto.subtle.decrypt(
                  { name: "AES-GCM", iv: iv },
                  key,
                  data
                );

                const dec = new TextDecoder();
                importedTokens = JSON.parse(dec.decode(decryptedContent));
              } catch (decryptErr) {
                alert("PIN Salah atau file terenkripsi korup!");
                return;
              }
            } else if (Array.isArray(parsedFile)) {
              importedTokens = parsedFile;
            } else {
              alert("Format file JSON tidak dikenali.");
              return;
            }

            if (Array.isArray(importedTokens) && importedTokens.length > 0) {
              chrome.storage.local.get(['totp_tokens'], (result) => {
                const current = result.totp_tokens || [];
                const merged = [...current, ...importedTokens];
                chrome.storage.local.set({ totp_tokens: merged }, () => {
                  alert(`Import berhasil! Memuat ${importedTokens.length} akun.`);
                  loadTokens();
                });
              });
            }
          } catch (err) {
            alert("Gagal membaca file JSON.");
            console.error(err);
          }
        };
        reader.readAsText(file);
      };
    }
  }
}

// 12. Parser Google Authenticator Migration URL
function parseGoogleAuthMigration(urlStr) {
  try {
    const importedTokens = window.GoogleAuthParser.parseUrl(urlStr);

    if (!importedTokens || importedTokens.length === 0) {
      alert('Tidak ada akun yang berhasil dibaca.');
      return;
    }

    chrome.storage.local.get(['totp_tokens'], (result) => {
      const current = result.totp_tokens || [];
      const merged = [...current, ...importedTokens];

      chrome.storage.local.set({ totp_tokens: merged }, () => {
        alert(`Berhasil mengimpor ${importedTokens.length} akun dari Google Authenticator!`);
        loadTokens();
      });
    });

  } catch (e) {
    alert('Terjadi kesalahan saat mendecode Google Authenticator data.');
    console.error(e);
  }
}