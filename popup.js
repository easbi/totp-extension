let decryptedTokens = null; 
let masterKey = null;       
let lockTimeoutMins = 0;
let timerInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  checkPinStatus();
  
  document.getElementById('btn-unlock').addEventListener('click', handleUnlock);
  document.getElementById('btn-lock-now').addEventListener('click', lockNow);
  document.getElementById('select-timeout').addEventListener('change', updateTimeoutSetting);
  
  document.getElementById('btn-add').addEventListener('click', addTokenManual);
  document.getElementById('btn-import').addEventListener('click', importData);
  document.getElementById('btn-export').addEventListener('click', exportToJson);
});

// --- HELPER KRIPTOGRAFI (PBKDF2 & AES-GCM) ---
async function deriveKey(pin, salt) {
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
    true, // Extractable untuk disimpan di chrome.storage.session
    ["encrypt", "decrypt"]
  );
}

// Simpan & Ambil Key Sementara di Memory Session Browser (chrome.storage.session)
async function exportKeyToSession(key) {
  try {
    const exported = await crypto.subtle.exportKey("raw", key);
    const keyArray = Array.from(new Uint8Array(exported));
    if (chrome.storage && chrome.storage.session) {
      await chrome.storage.session.set({ temp_master_key: keyArray });
    } else {
      sessionStorage.setItem('temp_master_key', JSON.stringify(keyArray));
    }
  } catch (e) {
    console.error("Gagal menyimpan key ke session:", e);
  }
}

async function getSessionKey() {
  try {
    let rawArray = null;
    if (chrome.storage && chrome.storage.session) {
      const res = await chrome.storage.session.get(['temp_master_key']);
      rawArray = res.temp_master_key;
    } else {
      const stored = sessionStorage.getItem('temp_master_key');
      if (stored) rawArray = JSON.parse(stored);
    }

    if (!rawArray) return null;
    const rawKey = new Uint8Array(rawArray);
    return await crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );
  } catch (e) {
    return null;
  }
}

async function clearSessionKey() {
  if (chrome.storage && chrome.storage.session) {
    await chrome.storage.session.remove(['temp_master_key']);
  }
  sessionStorage.removeItem('temp_master_key');
}

// Enkripsi Data Vault
async function encryptVault(dataArray, key) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(JSON.stringify(dataArray))
  );
  return {
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(encrypted))
  };
}

// Dekripsi Data Vault
async function decryptVault(encryptedVault, key) {
  const dec = new TextDecoder();
  const iv = new Uint8Array(encryptedVault.iv);
  const ciphertext = new Uint8Array(encryptedVault.ciphertext);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );
  return JSON.parse(dec.decode(decrypted));
}

// --- LOGIKA UTAMA EKSTENSI ---

function checkPinStatus() {
  chrome.storage.local.get(['app_pin', 'vault_salt', 'pin_verifier', 'last_unlock_time', 'lock_timeout_mins', 'encrypted_vault', 'totp_tokens'], async (result) => {
    const isPinCreated = !!result.pin_verifier || !!result.app_pin;
    lockTimeoutMins = result.lock_timeout_mins !== undefined ? result.lock_timeout_mins : 0;
    
    const selectElem = document.getElementById('select-timeout');
    if (selectElem) selectElem.value = lockTimeoutMins;

    if (!isPinCreated) {
      document.getElementById('pin-instruction').innerText = "Buat PIN Baru (4-8 digit):";
      document.getElementById('btn-unlock').innerText = "Simpan PIN";
      showPinScreen();
      return;
    } 

    const now = Date.now();
    const lastUnlock = result.last_unlock_time || 0;
    const elapsedMinutes = (now - lastUnlock) / (1000 * 60);

    // CEK TIMEOUT: Jika timeout > 0 DAN durasi belum melebihi batas
    if (lockTimeoutMins > 0 && elapsedMinutes < lockTimeoutMins) {
      const savedKey = await getSessionKey();
      if (savedKey && result.encrypted_vault) {
        try {
          masterKey = savedKey;
          decryptedTokens = await decryptVault(result.encrypted_vault, masterKey);
          showMainScreen();
          return;
        } catch (e) {
          console.log("Session key kadaluarsa atau vault butuh reset.");
        }
      }
    } else {
      // Jika waktu habis, hapus session key
      await clearSessionKey();
    }

    document.getElementById('pin-instruction').innerText = "Masukkan PIN untuk membuka:";
    document.getElementById('btn-unlock').innerText = "Buka Akses";
    showPinScreen();
  });
}

// Verifikasi PIN & Buka Vault
async function handleUnlock() {
  const inputPin = document.getElementById('pin-input').value;
  if (!inputPin) return alert("Masukkan PIN!");

  chrome.storage.local.get(['app_pin', 'vault_salt', 'pin_verifier', 'encrypted_vault', 'totp_tokens'], async (result) => {
    try {
      if (!result.pin_verifier && !result.app_pin) {
        if (inputPin.length < 4) return alert("PIN minimal 4 digit!");
        
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await deriveKey(inputPin, salt);
        
        const verifierIv = crypto.getRandomValues(new Uint8Array(12));
        const verifierEnc = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv: verifierIv },
          key,
          new TextEncoder().encode("VERIFIED_PIN")
        );

        const emptyVault = await encryptVault([], key);

        chrome.storage.local.set({
          vault_salt: Array.from(salt),
          pin_verifier: {
            iv: Array.from(verifierIv),
            data: Array.from(new Uint8Array(verifierEnc))
          },
          encrypted_vault: emptyVault,
          last_unlock_time: Date.now()
        }, async () => {
          masterKey = key;
          decryptedTokens = [];
          await exportKeyToSession(key);
          alert("PIN & Vault Berhasil dibuat!");
          showMainScreen();
        });

      } else {
        let salt = result.vault_salt ? new Uint8Array(result.vault_salt) : crypto.getRandomValues(new Uint8Array(16));
        const key = await deriveKey(inputPin, salt);

        if (result.pin_verifier) {
          try {
            const verifierIv = new Uint8Array(result.pin_verifier.iv);
            const verifierData = new Uint8Array(result.pin_verifier.data);
            const decVerifier = await crypto.subtle.decrypt(
              { name: "AES-GCM", iv: verifierIv },
              key,
              verifierData
            );
            
            if (new TextDecoder().decode(decVerifier) !== "VERIFIED_PIN") {
              throw new Error("Invalid PIN");
            }
          } catch (e) {
            alert("PIN Salah!");
            document.getElementById('pin-input').value = '';
            return;
          }
        } else if (result.app_pin && inputPin !== result.app_pin) {
          alert("PIN Salah!");
          document.getElementById('pin-input').value = '';
          return;
        }

        masterKey = key;
        await exportKeyToSession(key);

        if (result.encrypted_vault) {
          decryptedTokens = await decryptVault(result.encrypted_vault, masterKey);
        } else if (result.totp_tokens) {
          decryptedTokens = result.totp_tokens;
          const newVault = await encryptVault(decryptedTokens, masterKey);
          
          const verifierIv = crypto.getRandomValues(new Uint8Array(12));
          const verifierEnc = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: verifierIv },
            masterKey,
            new TextEncoder().encode("VERIFIED_PIN")
          );

          chrome.storage.local.set({
            vault_salt: Array.from(salt),
            pin_verifier: {
              iv: Array.from(verifierIv),
              data: Array.from(new Uint8Array(verifierEnc))
            },
            encrypted_vault: newVault
          });
          chrome.storage.local.remove(['app_pin', 'totp_tokens']);
        } else {
          decryptedTokens = [];
        }

        chrome.storage.local.set({ last_unlock_time: Date.now() }, () => {
          showMainScreen();
        });
      }
    } catch (err) {
      console.error("Gagal melakukan unlock:", err);
      alert("Terjadi kesalahan sistem dekripsi. Silakan periksa kembali PIN Anda.");
    }
  });
}

async function saveVault() {
  if (!masterKey || !decryptedTokens) return;
  const newEncryptedVault = await encryptVault(decryptedTokens, masterKey);
  chrome.storage.local.set({ encrypted_vault: newEncryptedVault });
}

async function lockNow() {
  await clearSessionKey();
  chrome.storage.local.set({ last_unlock_time: 0 }, () => {
    masterKey = null;
    decryptedTokens = null;
    document.getElementById('pin-input').value = '';
    showPinScreen();
  });
}

function updateTimeoutSetting(e) {
  const newTimeout = parseInt(e.target.value, 10);
  lockTimeoutMins = newTimeout;
  chrome.storage.local.set({ lock_timeout_mins: newTimeout }, () => {
    console.log(`Auto-lock timeout diubah ke: ${newTimeout} menit`);
  });
}

function showMainScreen() {
  document.getElementById('pin-screen').classList.add('hidden');
  document.getElementById('main-screen').classList.remove('hidden');
  renderTokens(decryptedTokens || []);
  
  if (timerInterval) clearInterval(timerInterval);
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

async function deleteTokenWithPin(index) {
  if (!decryptedTokens) return;
  const removedAccount = decryptedTokens[index]?.name || 'Akun';
  decryptedTokens.splice(index, 1);
  
  await saveVault();
  alert(`${removedAccount} berhasil dihapus.`);
  renderTokens(decryptedTokens);
}

async function updateCodes() {
  if (!decryptedTokens) return;
  
  const epoch = Math.floor(Date.now() / 1000);
  const secondsRemaining = 30 - (epoch % 30);
  const maxDash = 43.98;
  const strokeOffset = maxDash * (1 - secondsRemaining / 30);

  for (let index = 0; index < decryptedTokens.length; index++) {
    const t = decryptedTokens[index];
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
}

async function addTokenManual() {
  const name = prompt("Masukkan Nama Akun (misal: user@gmail.com):");
  if (!name) return;
  let secret = prompt("Masukkan Secret Key (Base32):");
  if (!secret) return;
  const issuer = prompt("Masukkan Provider/Issuer (misal: Google, GitHub):") || "Manual";

  secret = secret.toUpperCase().replace(/[^A-Z2-7]/g, '');
  const newToken = { name, secret, issuer };

  decryptedTokens.push(newToken);
  await saveVault();
  renderTokens(decryptedTokens);
}

async function exportToJson() {
  if (!decryptedTokens || decryptedTokens.length === 0) {
    alert("Tidak ada data untuk diexport!");
    return;
  }

  try {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const exportPin = prompt("Masukkan PIN untuk mengenkripsi file backup:");
    if (!exportPin) return;

    const exportKey = await deriveKey(exportPin, salt);
    const encryptedContent = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      exportKey,
      enc.encode(JSON.stringify(decryptedTokens))
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
}

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
                const key = await deriveKey(inputPin, salt);

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
              decryptedTokens = [...(decryptedTokens || []), ...importedTokens];
              await saveVault();
              alert(`Import berhasil! Memuat ${importedTokens.length} akun.`);
              renderTokens(decryptedTokens);
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

function parseGoogleAuthMigration(urlStr) {
  try {
    const importedTokens = window.GoogleAuthParser.parseUrl(urlStr);

    if (!importedTokens || importedTokens.length === 0) {
      alert('Tidak ada akun yang berhasil dibaca.');
      return;
    }

    decryptedTokens = [...(decryptedTokens || []), ...importedTokens];
    saveVault().then(() => {
      alert(`Berhasil mengimpor ${importedTokens.length} akun dari Google Authenticator!`);
      renderTokens(decryptedTokens);
    });

  } catch (e) {
    alert('Terjadi kesalahan saat mendecode Google Authenticator data.');
    console.error(e);
  }
}