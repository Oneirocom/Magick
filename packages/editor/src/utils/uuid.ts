// GENERATED 
/**
 * Generate a random UUID version 4.
 * @returns {string} A string representing the UUID.
 */
export const uuidv4 = (): string => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (char: string) => {
    const digit = parseInt(char);
    const randomness = crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (digit / 4));
    return (digit ^ randomness).toString(16);
  });
};