import { IQueryableRegistry } from '@magickml/behave-graph';
import { useMemo } from 'react';

export const toQueryableDefinitions = <T>(definitionsMap: {
  [id: string]: T;
}): IQueryableRegistry<T> => ({
  get: (id: string) => definitionsMap[id],
  getAll: () => Object.values(definitionsMap),
  getAllNames: () => Object.keys(definitionsMap),
  contains: (id: string) => definitionsMap[id] !== undefined
});

export const useQueryableDefinitions = <T>(definitionsMap: {
  [id: string]: T;
}): IQueryableRegistry<T> => {
  const queriableDefinitions = useMemo(
    () => toQueryableDefinitions(definitionsMap),
    [definitionsMap]
  );

  return queriableDefinitions;
};
