import { EXCLUDED_BREED_IDS } from '../../const';
import { IBreedObject } from '../../types';

export const filterBreeds = (breeds: IBreedObject[]): IBreedObject[] => {
  return breeds.filter((breed) => !EXCLUDED_BREED_IDS.includes(breed.id));
};
