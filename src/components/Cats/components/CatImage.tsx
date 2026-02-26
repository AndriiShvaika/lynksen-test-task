import { memo } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import { IBreedObject } from '../../../types';

interface CatImageProps {
  breed: IBreedObject;
  imageUrl?: string;
  isLoading: boolean;
  onImageError: (breedId: string) => void;
}

const CatImage = ({
  breed,
  imageUrl,
  isLoading,
  onImageError,
}: CatImageProps) => {
  const altText = `${breed.name} cat`;

  if (isLoading) {
    return (
      <div className="cat-img-wrapper">
        <ClipLoader
          size={200}
          aria-label="Loading Spinner"
          data-testid="loader"
          color="#7e5ae1"
        />
      </div>
    );
  }

  return (
    <div className="cat-img-wrapper">
      <img
        src={imageUrl}
        alt={altText}
        onError={() => onImageError(breed.id)}
      />
    </div>
  );
};

export default memo(CatImage);
