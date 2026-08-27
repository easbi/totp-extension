// Parser Protobuf sederhana untuk Google Authenticator Migration Payload
const GoogleAuthParser = {
  // Konversi Uint8Array ke string Base32
  bytesToBase32: function (buffer) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i];
      bits += 8;
      while (bits >= 5) {
        output += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    if (bits > 0) {
      output += alphabet[(value << (5 - bits)) & 31];
    }
    return output;
  },

  // Parse payload binary Protobuf dari Google Auth
  parsePayload: function (buffer) {
    let pos = 0;
    const accounts = [];

    while (pos < buffer.length) {
      const tag = buffer[pos++];
      const fieldNumber = tag >> 3;
      const wireType = tag & 0x07;

      if (wireType === 2) { // Length-delimited (string / bytes / embedded message)
        let len = 0;
        let shift = 0;
        while (true) {
          const b = buffer[pos++];
          len |= (b & 0x7f) << shift;
          if ((b & 0x80) === 0) break;
          shift += 7;
        }

        const data = buffer.subarray(pos, pos + len);
        pos += len;

        // Field 1 pada MigrationPayload adalah array of OtpParameters
        if (fieldNumber === 1) {
          const otpParam = this.parseOtpParameters(data);
          if (otpParam && otpParam.secret) {
            accounts.push(otpParam);
          }
        }
      } else if (wireType === 0) { // Varint
        while (buffer[pos++] & 0x80) {}
      }
    }

    return accounts;
  },

  // Parse pesan internal OtpParameters (Secret, Name, Issuer)
  parseOtpParameters: function (buffer) {
    let pos = 0;
    const param = { secret: '', name: '', issuer: '' };

    while (pos < buffer.length) {
      const tag = buffer[pos++];
      const fieldNumber = tag >> 3;
      const wireType = tag & 0x07;

      if (wireType === 2) {
        let len = 0;
        let shift = 0;
        while (true) {
          const b = buffer[pos++];
          len |= (b & 0x7f) << shift;
          if ((b & 0x80) === 0) break;
          shift += 7;
        }

        const data = buffer.subarray(pos, pos + len);
        pos += len;

        if (fieldNumber === 1) {
          // Field 1: Secret Key (Raw Bytes -> Convert to Base32)
          param.secret = this.bytesToBase32(data);
        } else if (fieldNumber === 2) {
          // Field 2: Account Name
          param.name = new TextDecoder().decode(data);
        } else if (fieldNumber === 3) {
          // Field 3: Issuer
          param.issuer = new TextDecoder().decode(data);
        }
      } else if (wireType === 0) {
        while (buffer[pos++] & 0x80) {}
      }
    }

    if (!param.issuer && param.name.includes(':')) {
      param.issuer = param.name.split(':')[0].trim();
    }

    return param;
  },

  // Entry point utama untuk menerima URL otpauth-migration://
  parseUrl: function (urlStr) {
    const url = new URL(urlStr);
    if (url.protocol !== 'otpauth-migration:' || url.host !== 'offline') {
      throw new Error('Format URL tidak valid!');
    }
    const dataParam = url.searchParams.get('data');
    if (!dataParam) throw new Error('Parameter data tidak ditemukan!');

    // Base64 URL Safe Decode
    const base64 = dataParam.replace(/-/g, '+').replace(/_/g, '/');
    const binaryStr = atob(base64);
    const buffer = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      buffer[i] = binaryStr.charCodeAt(i);
    }

    return this.parsePayload(buffer);
  }
};

window.GoogleAuthParser = GoogleAuthParser;