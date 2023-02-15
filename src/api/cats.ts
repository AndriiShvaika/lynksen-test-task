import axios from "axios";
import { IBreedObject, IImage } from "../types";

export const getBreedsApi = async () => {
  axios.defaults.headers.common["x-api-key"] = process.env.REACT_APP_API_KEY;

  return await axios.get<IBreedObject[]>(`https://api.thecatapi.com/v1/breeds`);
};

export const getRandomImageApi = async (breedId: string) => {
  let query_params = {
    breed_ids: breedId,
  };

  return await axios.get<IImage[]>(
    "https://api.thecatapi.com/v1/images/search",
    {
      params: query_params,
    }
  );
};
