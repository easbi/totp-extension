// Decoder Base32 Sederhana untuk TOTP Secret Key
const Base32 = {
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
  
  decode: function(input) {
    // Bersihkan karakter selain A-Z dan 2-7 (buang strip '-', spasi, dll)
    let cleaned = input.toUpperCase().replace(/[^A-Z2-7]/g, '');
    
    let value = 0;
    let valuelen = 0;
    let output = [];

    for (let i = 0; i < cleaned.length; i++) {
      let val = this.alphabet.indexOf(cleaned.charAt(i));
      if (val === -1) continue;
      
      valuelen += 5;
      value = (value << 5) | val;
      if (valuelen >= 8) {
        output.push((value >> (valuelen - 8)) & 0xFF);
        valuelen -= 8;
      }
    }
    return new Uint8Array(output);
  }
};