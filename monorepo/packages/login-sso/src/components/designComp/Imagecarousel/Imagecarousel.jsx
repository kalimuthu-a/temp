import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Imagecarousel.scss';

function Imagecarousel({ mfLabels, autoPlay = true, speed = 3000, className }) {
  const carouselData = mfLabels?.loyaltyInformation?.bannerData || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (autoPlay && carouselData.length) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
      }, speed);
    }
    return () => clearInterval(timerRef.current);
  }, [autoPlay, speed, carouselData.length]);

  const goToSlide = (index) => {
    clearInterval(timerRef.current);
    setCurrentIndex(index);
    if (autoPlay) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
      }, speed);
    }
  };
  const dotWidth = carouselData.length > 0 ? 80 / carouselData.length : 0;
  return (
    <div className={`${className} carousel`}>
      <div
        className="carousel__slides"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselData?.map((slide, idx) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`${slide.image._publishUrl}${idx}`}
            className={`carousel__slide ${
              idx === currentIndex ? 'carousel__slide--active' : ''
            }`}
            style={{ width: '100%' }}
          >
            <img src={slide?.image?._publishUrl} alt={slide?.heading} />
            <div className="carousel__slide__text">
              <h3 className="h3 text-white">{slide?.heading}</h3>
              <div
                className="body-small-regular text-white"
                dangerouslySetInnerHTML={{ __html: slide?.description?.html }}
              />
            </div>
          </div>
        ))}
      </div>
      {carouselData.length > 1 && (
      <div className="carousel__dots">
        {carouselData?.map((slide, idx) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={`${slide.image._publishUrl}${idx}`}
            className={`carousel__dot ${
              idx === currentIndex ? 'carousel__dot--active' : ''
            }`}
            style={{ width: `${dotWidth}%` }}
            tabIndex="0"
            role="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => goToSlide(idx)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                goToSlide(idx);
              }
            }}
          />
        ))}
      </div>
      )}
    </div>
  );
}

Imagecarousel.propTypes = {
  mfLabels: PropTypes.object.isRequired,
  autoPlay: PropTypes.bool,
  speed: PropTypes.number,
  className: PropTypes.string,
};

export default Imagecarousel;
