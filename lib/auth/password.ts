import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

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

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = (await scryptAsync(
    password,
    salt,
    SCRYPT_KEYLEN,
    scryptOptions()
  )) as Buffer;

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

  const actualHash = (await scryptAsync(password, salt, SCRYPT_KEYLEN, {
    N: cost,
    r: blockSize,
    p: parallelization,
    maxmem: SCRYPT_MAXMEM,
  })) as Buffer;

  return (
    actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash)
  );
}
