import axios from 'axios';

import { filterBreeds } from '../utils/filterBreeds';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBreedsApi, getRandomImageApi } from '../../api/cats';
import { IBreedObject, IImage } from '../../types';

type RequestStatus = 'idle' | 'pending' | 'succeeded' | 'failed';
const BREEDS_CACHE_TTL_MS = 5 * 60 * 1000;

interface ICatsState {
  breeds: Array<IBreedObject>;
  breedsStatus: RequestStatus;
  breedsError: string | null;
  breedsLastFetchedAt: number | null;
  randomImageByBreedId: Record<string, IImage>;
}

const initialState: ICatsState = {
  breeds: [],
  breedsStatus: 'idle',
  breedsError: null,
  breedsLastFetchedAt: null,
  randomImageByBreedId: {},
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};

export const getBreeds = createAsyncThunk<
  Array<IBreedObject>,
  { force?: boolean } | void,
  { state: { cats: ICatsState }; rejectValue: string }
>(
  'getBreeds',
  async (_, { rejectWithValue }) => {
    try {
      const breeds = await getBreedsApi();

      return filterBreeds(breeds);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (arg, { getState }) => {
      const { cats } = getState();
      const isForceRefresh = arg?.force ?? false;
      const hasFreshCache =
        cats.breedsLastFetchedAt !== null &&
        Date.now() - cats.breedsLastFetchedAt < BREEDS_CACHE_TTL_MS;

      if (isForceRefresh) {
        return true;
      }

      if (cats.breedsStatus === 'pending') {
        return false;
      }

      return !hasFreshCache;
    },
  },
);

export const getRandomImage = createAsyncThunk<
  { breedId: string; image: IImage },
  string,
  { rejectValue: string }
>('getRandomImage', async (breedId, { rejectWithValue, signal }) => {
  try {
    const breedImages = await getRandomImageApi(breedId, signal);

    return {
      breedId,
      image: breedImages[0],
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') {
      throw error;
    }

    return rejectWithValue(getErrorMessage(error));
  }
});

const catsSlice = createSlice({
  name: 'cats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBreeds.pending, (state) => {
      state.breedsStatus = 'pending';
      state.breedsError = null;
    });
    builder.addCase(getBreeds.fulfilled, (state, action) => {
      state.breeds = action.payload;
      state.breedsStatus = 'succeeded';
      state.breedsLastFetchedAt = Date.now();
    });
    builder.addCase(getBreeds.rejected, (state, action) => {
      state.breedsStatus = 'failed';
      state.breedsError = action.payload ?? 'Failed to fetch cat breeds';
    });

    builder.addCase(getRandomImage.fulfilled, (state, action) => {
      const { breedId, image } = action.payload;

      if (image) {
        state.randomImageByBreedId[breedId] = image;
      }
    });
  },
});

export default catsSlice.reducer;
