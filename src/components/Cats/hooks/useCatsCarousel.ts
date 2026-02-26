import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { getBreeds, getRandomImage } from '../../../redux/reducers/cats';
import { RootState, useStoreDispatch } from '../../../redux/store';
import { IBreedObject } from '../../../types';
import { resolveBreedImageUrl } from '../utils/image';

type BreedId = string;
type BreedLoadingState = Record<BreedId, boolean>;

export const useCatsCarousel = () => {
  const dispatch = useStoreDispatch();

  const startImageRequest = useCallback(
    (breedId: BreedId) => dispatch(getRandomImage(breedId)),
    [dispatch],
  );

  type RandomImageRequest = ReturnType<typeof startImageRequest>;

  const activeImageRequestsRef = useRef<Map<BreedId, RandomImageRequest>>(
    new Map(),
  );

  const [loadingRandomImageByBreedId, setLoadingRandomImageByBreedId] =
    useState<BreedLoadingState>({});

  const { breeds, breedsError, randomImageByBreedId } = useSelector(
    (state: RootState) => state.cats,
  );

  useEffect(() => {
    dispatch(getBreeds());
  }, [dispatch]);

  useEffect(() => {
    const activeImageRequests = activeImageRequestsRef.current;

    return () => {
      activeImageRequests.forEach((request) => {
        request?.abort();
      });

      activeImageRequests.clear();
    };
  }, []);

  const setBreedImageLoading = useCallback(
    (breedId: BreedId, isLoading: boolean) => {
      setLoadingRandomImageByBreedId((prev) => ({
        ...prev,
        [breedId]: isLoading,
      }));
    },
    [],
  );

  const abortImageRequest = useCallback((breedId: BreedId) => {
    const request = activeImageRequestsRef.current.get(breedId);
    request?.abort();
    activeImageRequestsRef.current.delete(breedId);
  }, []);

  const trackImageRequest = useCallback(
    (breedId: BreedId, request: RandomImageRequest) => {
      activeImageRequestsRef.current.set(breedId, request);

      request.finally(() => {
        if (activeImageRequestsRef.current.get(breedId) === request) {
          activeImageRequestsRef.current.delete(breedId);
          setBreedImageLoading(breedId, false);
        }
      });
    },
    [setBreedImageLoading],
  );

  const getImage = useCallback(
    (breedId: BreedId) => {
      abortImageRequest(breedId);
      setBreedImageLoading(breedId, true);

      const request = startImageRequest(breedId);
      trackImageRequest(breedId, request);
    },
    [
      abortImageRequest,
      setBreedImageLoading,
      startImageRequest,
      trackImageRequest,
    ],
  );

  const getBreedImageUrl = useCallback(
    (breed: IBreedObject) =>
      resolveBreedImageUrl({
        referenceImageId: breed.reference_image_id,
        randomImageUrl: randomImageByBreedId[breed.id]?.url,
      }),
    [randomImageByBreedId],
  );

  const isBreedImageLoading = useCallback(
    (breedId: BreedId) => loadingRandomImageByBreedId[breedId] === true,
    [loadingRandomImageByBreedId],
  );

  return {
    breeds,
    breedsError,
    isInitialLoading: breeds.length === 0 && !breedsError,
    changeImage: getImage,
    getBreedImageUrl,
    isBreedImageLoading,
  };
};
