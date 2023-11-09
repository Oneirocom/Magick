import { useEffect, useState } from 'react';

export function useMergeMap<T, TMap extends Record<string, T>>(
  mapA: TMap,
  mapB: TMap
): TMap {
  const [result, setResult] = useState<TMap>(() => ({ ...mapA, ...mapB }));

  useEffect(() => {
    setResult({ ...mapA, ...mapB });
  }, [mapA, mapB]);

  return result;
}
