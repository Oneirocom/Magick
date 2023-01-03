export const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(
    /[018]/g,
    (c: string) => {
      const d = parseInt(c);
      return (
        d ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (d / 4)))
      ).toString(16);
    }
  );
};
