export function sieveOfEratosthenes(max: number): Uint8Array {
  const isPrime = new Uint8Array(max + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  if (max >= 1) isPrime[1] = 0;
  const limit = Math.floor(Math.sqrt(max));
  for (let i = 2; i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= max; j += i) {
        isPrime[j] = 0;
      }
    }
  }
  return isPrime;
}

export function countPrimes(isPrime: Uint8Array): number {
  let count = 0;
  for (let i = 0; i < isPrime.length; i++) if (isPrime[i]) count++;
  return count;
}
