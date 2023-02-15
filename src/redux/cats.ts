import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBreedsApi, getRandomImageApi } from "../api/cats";
import { IBreedObject, IImage } from "../types";

interface ICatsState {
  breeds: Array<IBreedObject>;
  randomImage: Array<IImage>;
}

const initialState: ICatsState = {
  breeds: [],
  randomImage: [],
};

export const getBreeds = createAsyncThunk("getBreeds", async () => {
  const response = await getBreedsApi();

  return response.data;
});

export const getRandomImage = createAsyncThunk(
  "getRandomImage",
  async (breedId: string) => {
    const response = await getRandomImageApi(breedId);

    return response.data;
  }
);

const counterSlice = createSlice({
  name: "cats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBreeds.fulfilled, (state, action) => {
      state.breeds = action.payload;
    });
    builder.addCase(getRandomImage.fulfilled, (state, action) => {
      state.randomImage = action.payload;
    });
  },
});

export default counterSlice.reducer;
