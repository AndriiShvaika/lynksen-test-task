interface ResolveBreedImageUrlParams {
  referenceImageId?: string;
  randomImageUrl?: string;
}

const CAT_API_CDN_BASE_URL = 'https://cdn2.thecatapi.com/images';

export const resolveBreedImageUrl = ({
  referenceImageId,
  randomImageUrl,
}: ResolveBreedImageUrlParams) => {
  if (randomImageUrl) {
    return randomImageUrl;
  }

  if (!referenceImageId) {
    return undefined;
  }

  return `${CAT_API_CDN_BASE_URL}/${referenceImageId}.jpg`;
};
