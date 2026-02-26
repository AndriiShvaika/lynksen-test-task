import { memo } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import { MAX_DESCRIPTION_LENGTH } from '../../../const';
import { IBreedObject } from '../../../types';
import { truncateText } from '../utils/text';

interface CatCardProps {
  breed: IBreedObject;
  imageUrl?: string;
  isLoading: boolean;
  onChangeImage: (breedId: string) => void;
}

const CatCard = ({
  breed,
  imageUrl,
  isLoading,
  onChangeImage,
}: CatCardProps) => {
  return (
    <>
      <div className="cat-img-wrapper">
        {isLoading ? (
          <ClipLoader
            size={200}
            aria-label="Loading Spinner"
            data-testid="loader"
            color={'#7e5ae1'}
          />
        ) : (
          <img src={imageUrl} alt={`${breed.name} cat`} />
        )}
      </div>
      <div className="cat-wrapper">
        <div className="cat-content">
          <span className="cat-name">{breed.name}</span>
          <p className="cat-description">
            {truncateText(breed.description, MAX_DESCRIPTION_LENGTH)}
          </p>
        </div>
        <button onClick={() => onChangeImage(breed.id)}>Change image</button>
      </div>
    </>
  );
};

export default memo(CatCard);
