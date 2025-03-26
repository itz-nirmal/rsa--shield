/**
 * * RSA implementation in JavaScript
 * Note: This is a simplified RSA implementation for educational purposes
 * In production environments, use established cryptography libraries
 */

export interface KeyPair {
  publicKey: {
    e: bigint;
    n: bigint;
  };
  privateKey: {
    d: bigint;
    n: bigint;
  };
}

// Check if a number is prime using Miller-Rabin primality test
function isPrime(n: bigint, k: number = 40): boolean {
  if (n <= BigInt(1)) return false;
  if (n <= BigInt(3)) return true;
  if (n % BigInt(2) === BigInt(0)) return false;

  // Express n as 2^r * d + 1
  let r = BigInt(0);
  let d = n - BigInt(1);
  while (d % BigInt(2) === BigInt(0)) {
    d /= BigInt(2);
    r += BigInt(1);
  }

  // Witness loop
  const witness = (a: bigint, n: bigint, d: bigint, r: bigint): boolean => {
    let x = modPow(a, d, n);
    if (x === BigInt(1) || x === n - BigInt(1)) return true;

    for (let i = BigInt(1); i < r; i++) {
      x = (x * x) % n;
      if (x === n - BigInt(1)) return true;
      if (x === BigInt(1)) return false;
    }
    return false;
  };

  // Test with k random bases
  for (let i = 0; i < k; i++) {
    const a = BigInt(2 + Math.floor(Math.random() * (Number(n) - 4)));
    if (!witness(a, n, d, r)) return false;
  }

  return true;
}

// Modular exponentiation: calculates (base^exponent) % modulus efficiently
export function modPow(
  base: bigint,
  exponent: bigint,
  modulus: bigint
): bigint {
  if (modulus === BigInt(1)) return BigInt(0);

  let result = BigInt(1);
  base = base % modulus;

  while (exponent > BigInt(0)) {
    if (exponent % BigInt(2) === BigInt(1)) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> BigInt(1);
    base = (base * base) % modulus;
  }

  return result;
}

// Extended Euclidean Algorithm to find GCD and Bézout coefficients
function extendedGCD(
  a: bigint,
  b: bigint
): { gcd: bigint; x: bigint; y: bigint } {
  if (a === BigInt(0)) {
    return { gcd: b, x: BigInt(0), y: BigInt(1) };
  }

  const { gcd, x, y } = extendedGCD(b % a, a);
  return {
    gcd,
    x: y - (b / a) * x,
    y: x,
  };
}

// Calculate modular multiplicative inverse
function modInverse(a: bigint, m: bigint): bigint {
  const { gcd, x } = extendedGCD(a, m);

  if (gcd !== BigInt(1)) {
    throw new Error("Modular inverse does not exist");
  }

  return ((x % m) + m) % m;
}

// Generate a random prime number of specified bit length with improved handling for large bit sizes
function generateRandomPrime(bits: number): bigint {
  // Improved approach for large bit sizes that won't overflow
  const min = BigInt(2) ** BigInt(bits - 1);
  const max = BigInt(2) ** BigInt(bits) - BigInt(1);

  // Efficient random number generation
  function getRandom(): bigint {
    // For very large numbers, generate bytes and construct BigInt
    const byteLength = Math.ceil(bits / 8);
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);

    // Ensure high bit is set for correct bit length
    bytes[0] |= 0x80;
    // Ensure the number is odd (for faster prime search)
    bytes[byteLength - 1] |= 0x01;

    // Convert bytes to bigint
    let result = BigInt(0);
    for (let i = 0; i < byteLength; i++) {
      result = (result << BigInt(8)) | BigInt(bytes[i]);
    }

    // Ensure it's within our range
    return result;
  }

  let candidate = getRandom();
  let iterations = 0;
  const MAX_ITERATIONS = 100;

  // Search for a prime number
  while (!isPrime(candidate) && iterations < MAX_ITERATIONS) {
    candidate = getRandom();
    iterations++;
  }

  if (iterations < MAX_ITERATIONS) {
    return candidate;
  }

  // Fallback to incremental approach if random approach fails
  console.warn(
    "Random prime generation approach exceeded max iterations, falling back to incremental search"
  );
  let n = getRandom();

  // Ensure the number is odd
  if (n % BigInt(2) === BigInt(0)) {
    n += BigInt(1);
  }

  // Find the next prime by incrementing by 2
  while (!isPrime(n)) {
    n += BigInt(2);
    if (n > max) {
      n = min | BigInt(1); // Reset and ensure it's odd
    }
  }

  return n;
}

// Select a random public exponent e with improved randomness
function selectRandomE(phi: bigint): bigint {
  // Generate a truly random odd number for e
  // It must be coprime with phi and 1 < e < phi

  // For better security, we'll use a larger random range
  const getRandomBigIntInRange = (min: bigint, max: bigint): bigint => {
    const range = max - min;
    const bitsNeeded = range.toString(2).length;
    const bytesNeeded = Math.ceil(bitsNeeded / 8);

    const randomBytes = new Uint8Array(bytesNeeded);
    crypto.getRandomValues(randomBytes);

    let randomValue = BigInt(0);
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = (randomValue << BigInt(8)) | BigInt(randomBytes[i]);
    }

    // Make sure it's in range
    return min + (randomValue % range);
  };

  // Common value to try first (for optimization)
  const e65537 = BigInt(65537);
  if (e65537 < phi && extendedGCD(e65537, phi).gcd === BigInt(1)) {
    return e65537;
  }

  // Generate a random odd number between 3 and phi-1
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  while (attempts < MAX_ATTEMPTS) {
    // Generate random number between 3 and phi-1
    let e = getRandomBigIntInRange(BigInt(3), phi - BigInt(1));

    // Ensure it's odd (all even numbers except 2 share factors with phi)
    if (e % BigInt(2) === BigInt(0)) {
      e += BigInt(1);
    }

    // Check if it's coprime with phi
    if (e < phi && extendedGCD(e, phi).gcd === BigInt(1)) {
      return e;
    }

    attempts++;
  }

  // If we fail to find a random value, use common primes that often work
  const commonEs = [BigInt(17), BigInt(257), BigInt(65537)];

  for (const e of commonEs) {
    if (e < phi && extendedGCD(e, phi).gcd === BigInt(1)) {
      return e;
    }
  }

  // Last resort - incremental search
  console.warn("Failed to find random e quickly, using incremental search");
  let e = BigInt(65537);
  while (e < phi) {
    if (extendedGCD(e, phi).gcd === BigInt(1)) {
      return e;
    }
    e += BigInt(2);
  }

  throw new Error("Could not find suitable public exponent");
}

// Generate RSA key pair with improved handling for large bit sizes
export function generateKeyPair(bits: number = 1024): KeyPair {
  console.log(`Starting key generation with ${bits} bits`);

  // Adjust bit distribution based on key size
  const p_bits = Math.floor(bits / 2);
  const q_bits = bits - p_bits;

  console.log(`Generating ${p_bits}-bit prime p...`);
  const p = generateRandomPrime(p_bits);

  console.log(`Generating ${q_bits}-bit prime q...`);
  let q = generateRandomPrime(q_bits);

  // Ensure p and q are different
  while (p === q) {
    q = generateRandomPrime(q_bits);
  }

  // Calculate n = p * q
  const n = p * q;

  // Calculate Euler's totient function φ(n) = (p-1)(q-1)
  const phi = (p - BigInt(1)) * (q - BigInt(1));

  // Choose e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1
  console.log("Selecting public exponent e...");
  const e = selectRandomE(phi);

  // Calculate d such that (d * e) ≡ 1 (mod φ(n))
  console.log("Computing private exponent d...");
  const d = modInverse(e, phi);

  console.log("Key generation complete");

  return {
    publicKey: { e, n },
    privateKey: { d, n },
  };
}

// Encrypt a message using RSA public key
export function encrypt(
  message: string,
  publicKey: { e: bigint; n: bigint }
): string {
  const messageBytes = new TextEncoder().encode(message);
  const encrypted: bigint[] = [];

  // Convert each character to a number and encrypt it
  for (let i = 0; i < messageBytes.length; i++) {
    const m = BigInt(messageBytes[i]);
    const c = modPow(m, publicKey.e, publicKey.n);
    encrypted.push(c);
  }

  // Return as a base64 string
  return btoa(encrypted.map((n) => n.toString()).join(","));
}

// Decrypt a message using RSA private key
export function decrypt(
  ciphertext: string,
  privateKey: { d: bigint; n: bigint }
): string {
  try {
    // Parse the base64 string back to an array of bigints
    const encrypted = atob(ciphertext)
      .split(",")
      .map((n) => BigInt(n));
    const decrypted = new Uint8Array(encrypted.length);

    // Decrypt each number
    for (let i = 0; i < encrypted.length; i++) {
      const c = encrypted[i];
      const m = modPow(c, privateKey.d, privateKey.n);
      decrypted[i] = Number(m);
    }

    // Convert the decrypted numbers back to a string
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt message. Invalid ciphertext or key.");
  }
}

// Format keys to clearly show e, n and d, n values
export function formatPublicKey(key: { e: bigint; n: bigint }): string {
  return `-----BEGIN RSA PUBLIC KEY-----
e: ${key.e.toString()}
n: ${key.n.toString()}
-----END RSA PUBLIC KEY-----`;
}

export function formatPrivateKey(key: { d: bigint; n: bigint }): string {
  return `-----BEGIN RSA PRIVATE KEY-----
d: ${key.d.toString()}
n: ${key.n.toString()}
-----END RSA PRIVATE KEY-----`;
}

// Parse a key from PEM format
export function parsePublicKey(pem: string): { e: bigint; n: bigint } {
  try {
    const keyContent = pem
      .replace("-----BEGIN RSA PUBLIC KEY-----", "")
      .replace("-----END RSA PUBLIC KEY-----", "")
      .trim();

    const eMatch = keyContent.match(/e: ([\d]+)/);
    const nMatch = keyContent.match(/n: ([\d]+)/);

    if (!eMatch || !nMatch) {
      throw new Error("Invalid public key format");
    }

    return {
      e: BigInt(eMatch[1]),
      n: BigInt(nMatch[1]),
    };
  } catch (error) {
    console.error("Error parsing public key:", error);
    throw new Error("Invalid public key format");
  }
}

export function parsePrivateKey(pem: string): { d: bigint; n: bigint } {
  try {
    const keyContent = pem
      .replace("-----BEGIN RSA PRIVATE KEY-----", "")
      .replace("-----END RSA PRIVATE KEY-----", "")
      .trim();

    const dMatch = keyContent.match(/d: ([\d]+)/);
    const nMatch = keyContent.match(/n: ([\d]+)/);

    if (!dMatch || !nMatch) {
      throw new Error("Invalid private key format");
    }

    return {
      d: BigInt(dMatch[1]),
      n: BigInt(nMatch[1]),
    };
  } catch (error) {
    console.error("Error parsing private key:", error);
    throw new Error("Invalid private key format");
  }
}

// Generate a key pair from user-provided prime numbers
export function generateKeyPairFromPrimes(p: bigint, q: bigint): KeyPair {
  if (!isPrime(p) || !isPrime(q)) {
    throw new Error("Both inputs must be prime numbers");
  }

  // Calculate n = p * q
  const n = p * q;

  // Calculate Euler's totient function φ(n) = (p-1)(q-1)
  const phi = (p - BigInt(1)) * (q - BigInt(1));

  // Choose a random e
  const e = selectRandomE(phi);

  // Calculate d such that (d * e) ≡ 1 (mod φ(n))
  const d = modInverse(e, phi);

  return {
    publicKey: { e, n },
    privateKey: { d, n },
  };
}
