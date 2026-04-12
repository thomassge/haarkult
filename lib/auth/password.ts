import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const SCRYPT_N = 131072;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SCRYPT_MAXMEM = 256 * 1024 * 1024;
const SCRYPT_HASH_PREFIX = "scrypt$";

function scryptOptions() {
  return {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: SCRYPT_MAXMEM,
  };
}

function deriveScryptKey(password: string, salt: Buffer, keylen: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keylen, scryptOptions(), (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = await deriveScryptKey(password, salt, SCRYPT_KEYLEN);

  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64"),
    derivedKey.toString("base64"),
  ].join("$");
}

export async function verifyPassword(password: string, storedHash: string) {
  if (!storedHash.startsWith(SCRYPT_HASH_PREFIX)) {
    return false;
  }

  const [algorithm, n, r, p, saltBase64, hashBase64] = storedHash.split("$");

  if (algorithm !== "scrypt" || !n || !r || !p || !saltBase64 || !hashBase64) {
    return false;
  }

  const cost = Number(n);
  const blockSize = Number(r);
  const parallelization = Number(p);

  if (
    cost !== SCRYPT_N ||
    blockSize !== SCRYPT_R ||
    parallelization !== SCRYPT_P
  ) {
    return false;
  }

  const salt = Buffer.from(saltBase64, "base64");
  const expectedHash = Buffer.from(hashBase64, "base64");

  if (expectedHash.length !== SCRYPT_KEYLEN) {
    return false;
  }

  const actualHash = await deriveScryptKey(password, salt, SCRYPT_KEYLEN);

  return (
    actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash)
  );
}
