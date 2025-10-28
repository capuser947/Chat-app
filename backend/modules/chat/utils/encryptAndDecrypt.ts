import CryptoJS from "crypto-js";

const decryptMessage = (message: string) => {
  try {
    const key = process.env.CRYPTO_KEY;
    const iv = process.env.CRYPTO_IV;
    if (!key || !iv) {
      throw new Error("Missing CRYPTO_KEY or CRYPTO_IV in environment");
    }

    const keyWA = CryptoJS.enc.Utf8.parse(key);
    const ivWA = CryptoJS.enc.Utf8.parse(iv);
    return CryptoJS.AES.decrypt(message, keyWA, { iv: ivWA });
  } catch (e: any) {
    throw new Error(e);
  }
};

export { decryptMessage };
