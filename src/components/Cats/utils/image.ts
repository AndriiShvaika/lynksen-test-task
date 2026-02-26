import { CAT_API_CDN_BASE_URL } from '../../../const';

interface ResolveBreedImageUrlParams {
  referenceImageId?: string;
  randomImageUrl?: string;
}

export const resolveBreedImageUrl = ({
  referenceImageId,
  randomImageUrl,
}: ResolveBreedImageUrlParams) => {
  if (randomImageUrl) return randomImageUrl;

  return `${CAT_API_CDN_BASE_URL}/${referenceImageId}.jpg`;
};
