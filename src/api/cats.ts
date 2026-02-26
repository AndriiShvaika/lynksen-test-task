import axios from "axios";
import { IBreedObject, IImage } from "../types";

const CAT_API_BASE_URL = "https://api.thecatapi.com/v1";

const getRequestConfig = () => {
  if (!process.env.REACT_APP_API_KEY) {
    return {};
  }

  return {
    headers: {
      "x-api-key": process.env.REACT_APP_API_KEY,
    },
  };
};

export const getBreedsApi = async (): Promise<IBreedObject[]> => {
  const response = await axios.get<IBreedObject[]>(
    `${CAT_API_BASE_URL}/breeds`,
    getRequestConfig()
  );

  return response.data;
};

export const getRandomImageApi = async (
  breedId: string,
  signal?: AbortSignal
): Promise<IImage[]> => {
  const response = await axios.get<IImage[]>(`${CAT_API_BASE_URL}/images/search`, {
    ...getRequestConfig(),
    signal,
    params: {
      breed_ids: breedId,
    },
  });

  return response.data;
};
