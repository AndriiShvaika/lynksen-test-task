import ClipLoader from 'react-spinners/ClipLoader';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import CatCard from './components/CatCard';
import { useCatsCarousel } from './hooks/useCatsCarousel';

import './styles/Cats.scss';

const Cats = () => {
  const {
    breeds,
    breedsError,
    isInitialLoading,
    changeImage,
    getBreedImageUrl,
    isBreedImageLoading,
  } = useCatsCarousel();

  if (isInitialLoading) {
    return (
      <div className="cats-initial-loader">
        <ClipLoader
          size={180}
          aria-label="Initial loading spinner"
          data-testid="initial-loader"
          color={'#7e5ae1'}
        />
      </div>
    );
  }

  if (breedsError && breeds.length === 0) {
    return <div className="cats-fetch-error">{breedsError}</div>;
  }

  return (
    <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
      {breeds.map((breed) => (
        <SwiperSlide key={breed.id}>
          <CatCard
            breed={breed}
            imageUrl={getBreedImageUrl(breed)}
            isLoading={isBreedImageLoading(breed.id)}
            onChangeImage={changeImage}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Cats;
