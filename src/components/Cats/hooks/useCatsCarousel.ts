import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { getBreeds, getRandomImage } from '../../../redux/cats';
import { RootState, useStoreDispatch } from '../../../redux/store';
import { IBreedObject } from '../../../types';
import { resolveBreedImageUrl } from '../utils/image';

type BreedId = string;
type BreedLoadingMap = Record<BreedId, boolean>;

export const useCatsCarousel = () => {
  const dispatch = useStoreDispatch();

  const startRandomImageRequest = useCallback(
    (breedId: BreedId) => dispatch(getRandomImage(breedId)),
    [dispatch]
  );
  type RandomImageRequest = ReturnType<typeof startRandomImageRequest>;

  const randomImageRequestByBreedIdRef = useRef<
    Record<BreedId, RandomImageRequest | undefined>
  >({});
  const [loadingRandomImageByBreedId, setLoadingRandomImageByBreedId] =
    useState<BreedLoadingMap>({});

  const { breeds, breedsError, randomImageByBreedId } = useSelector(
    (state: RootState) => state.cats
  );

  useEffect(() => {
    dispatch(getBreeds());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      const activeRequests = Object.values(randomImageRequestByBreedIdRef.current);

      activeRequests.forEach((request) => {
        request?.abort();
      });

      randomImageRequestByBreedIdRef.current = {};
    };
  }, []);

  const changeImage = useCallback(
    (breedId: BreedId) => {
      randomImageRequestByBreedIdRef.current[breedId]?.abort();
      setLoadingRandomImageByBreedId((prev) => ({
        ...prev,
        [breedId]: true,
      }));

      const request = startRandomImageRequest(breedId);
      randomImageRequestByBreedIdRef.current[breedId] = request;

      request.finally(() => {
        if (randomImageRequestByBreedIdRef.current[breedId] === request) {
          delete randomImageRequestByBreedIdRef.current[breedId];
          setLoadingRandomImageByBreedId((prev) => ({
            ...prev,
            [breedId]: false,
          }));
        }
      });
    },
    [startRandomImageRequest]
  );

  const getBreedImageUrl = (breed: IBreedObject) =>
    resolveBreedImageUrl({
      referenceImageId: breed.reference_image_id,
      randomImageUrl: randomImageByBreedId[breed.id]?.url,
    });

  const isBreedImageLoading = (breedId: BreedId) =>
    loadingRandomImageByBreedId[breedId] === true;

  return {
    breeds,
    breedsError,
    isInitialLoading: breeds.length === 0 && !breedsError,
    changeImage,
    getBreedImageUrl,
    isBreedImageLoading,
  };
};
