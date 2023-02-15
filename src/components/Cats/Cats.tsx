import { useEffect, useState } from "react";
import { RootState, useStoreDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { getBreeds, getRandomImage } from "../../redux/cats";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";

import ClipLoader from "react-spinners/ClipLoader";

import "./Cats.scss";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Cats = () => {
  const [isRandomImg, setIsRandomImg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useStoreDispatch();
  const breeds = useSelector((state: RootState) => state.cats.breeds);
  const randomImage = useSelector((state: RootState) => state.cats.randomImage);

  const changeImage = (breedId: string) => {
    setIsLoading(true);

    dispatch(getRandomImage(breedId)).then(() => {
      setIsRandomImg(true);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    dispatch(getBreeds());
  }, [dispatch]);

  return (
    <Swiper
      pagination={{
        type: "progressbar",
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="mySwiper"
      onSlideChange={() => {
        setIsRandomImg(false);
        setIsLoading(true);

        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }}
    >
      {breeds.map((breed) => (
        <SwiperSlide key={breed.id}>
          <div className="cat-img-wrapper">
            {isLoading ? (
              <ClipLoader
                size={200}
                aria-label="Loading Spinner"
                data-testid="loader"
                color={"#7e5ae1"}
              />
            ) : (
              <img
                src={isRandomImg ? randomImage[0].url : `${breed.image?.url}`}
                alt="cat"
              />
            )}
          </div>
          <div className="cat-wrapper">
            <div className="cat-content">
              <span className="cat-name">{breed.name}</span>
              <p className="cat-description">
                {breed.description.substring(0, 200)} ...
              </p>
            </div>
            <button onClick={() => changeImage(breed.id)}>Change image</button>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Cats;
