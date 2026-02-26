import { Fragment, memo } from 'react';

import { MAX_DESCRIPTION_LENGTH } from '../../../const';
import { IBreedObject } from '../../../types';
import { truncateText } from '../utils/text';
import CatImage from './CatImage';

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
    <Fragment>
      <CatImage
        breed={breed}
        imageUrl={imageUrl}
        isLoading={isLoading}
        onImageError={onChangeImage}
      />
      <div className="cat-wrapper">
        <div className="cat-content">
          <span className="cat-name">{breed.name}</span>
          <p className="cat-description">
            {truncateText(breed.description, MAX_DESCRIPTION_LENGTH)}
          </p>
        </div>
        <button onClick={() => onChangeImage(breed.id)}>Change image</button>
      </div>
    </Fragment>
  );
};

export default memo(CatCard);
