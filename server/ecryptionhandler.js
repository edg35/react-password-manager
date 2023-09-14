const crypto = require('crypto');
const secret = 'pppppppppppppppppppppppppppppppp';

const encrypt = (password) => {
    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv(
        'aes-256-ctr',
        Buffer.from(secret),
        iv
    );
    
    const encrypted = Buffer.concat([
        cipher.update(password),
        cipher.final()
    ]);

    return {iv: iv.toString("hex"), password: encrypted.toString("hex")};
}

const decrypt = (encryption) => {
    const decipher = crypto.createDecipheriv(
        'aes-256-ctr',
        Buffer.from(secret),
        Buffer.from(encryption.iv, "hex")
    );

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryption.password, "hex")),
        decipher.final()
    ]);

    return decrypted.toString();
}

module.exports = { encrypt, decrypt };