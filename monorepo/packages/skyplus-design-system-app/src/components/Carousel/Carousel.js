import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

const Carousel = ({
  title,
  carouselData,
  customClass,
  children,
  isAddonCarousel = false,
  isNextCarousel = false,
  isLoyaltyCarousel = false,
  ariaLabelPrev = 'Previous',
  ariaLabelNext = 'Next',
  navArrowPos = '',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlidePosition, setCurrentSlidePosition] = useState('translateX(0%)');
  const [isMobile, setIsMobile] = useState(false);
  const sliderWrapperRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const calculateCurrentSlidePosition = () => {
    let traslateTo = '';
    if (isMobile && isAddonCarousel) {
      traslateTo = `translateX(-${currentSlide * 100}%)`;
    } else if (isAddonCarousel) {
      traslateTo = `translateX(calc(-${currentSlide * 48}% - ${
        currentSlide * 8
      }px))`;
    } else if (isMobile && isNextCarousel) {
      traslateTo = `translateX(calc(-${currentSlide * 54}% - ${
        currentSlide * 12
      }px))`;
    } else if (isNextCarousel) {
      traslateTo = `translateX(calc(-${currentSlide * 22}% - ${
        currentSlide * 16
      }px))`;
    } else {
      traslateTo = `translateX(-${currentSlide * 80}%)`;
    }
    setCurrentSlidePosition(traslateTo);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === carouselData?.length - 1 ? 0 : prevSlide + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? carouselData?.length - 1 : prevSlide - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    calculateCurrentSlidePosition();
  }, [currentSlide, isMobile]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [carouselData]);

  useEffect(() => {
    const handleResize = () => {
      const isMob = window?.innerWidth < 768;
      if (isMob) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      goToNextSlide();
    }

    if (touchStartX - touchEndX < -50) {
      goToPrevSlide();
    }
  };

  let isNavigationDisabled = false;

  if (isMobile) {
    if (carouselData.length < 2) isNavigationDisabled = true;
  } else {
    if (isAddonCarousel && carouselData.length < 3) isNavigationDisabled = true;
    if (isNextCarousel && carouselData.length < 5) isNavigationDisabled = true;
  }

  const onKeyDown = (event, type) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (type === 'next') {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }
  };

  return (
    <div className="skyplus-carousel">
      <div className="skyplus-carousel__header">
        <h4 className="skyplus-carousel__header-title h4">{title}</h4>
        {!isNavigationDisabled && isMobile && (
          <div className="skyplus-carousel__dots-container">
            {carouselData?.map((item, index) => (
              <span
                key={index}
                className={
                  index === currentSlide
                    ? 'skyplus-carousel__dot skyplus-carousel__dot--active'
                    : 'skyplus-carousel__dot'
                }
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
        {!isNavigationDisabled && !isMobile && (
          <div className={`skyplus-carousel__header-icon ${isAddonCarousel ? navArrowPos : ''}`}>
            <div
              className="skyplus-carousel__header-icon--left"
              onClick={goToPrevSlide}
              onKeyDown={(event) => onKeyDown(event, 'prev')}
              role="button"
              tabIndex={0}
              aria-label={ariaLabelPrev}
            >
              <span className="icon-accordion-left-circle" />
            </div>
            <div
              className="skyplus-carousel__header-icon--right"
              onClick={goToNextSlide}
              onKeyDown={(event) => onKeyDown(event, 'next')}
              role="button"
              tabIndex={0}
              aria-label={ariaLabelNext}
            >
              <span className="icon-accordion-left-ouline-24" />
            </div>
          </div>
        )}
      </div>

      <div
        className="skyplus-carousel__slider-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={sliderWrapperRef}
          className={` ${isLoyaltyCarousel ? 'skyplus-carousel__slider-wrapper--loyalty' : 'skyplus-carousel__slider-wrapper'}`}
          style={{
            transform: currentSlidePosition,
          }}
        >
          {children.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  customClass
                    ? `${customClass} skyplus-carousel__slide`
                    : 'skyplus-carousel__slide'
                }
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Carousel.propTypes = {
  title: PropTypes.string,
  carouselData: PropTypes.arrayOf(),
  customClass: PropTypes.string,
  children: PropTypes.any,
  isAddonCarousel: PropTypes.bool,
  isNextCarousel: PropTypes.bool,
  ariaLabelPrev: PropTypes.string,
  ariaLabelNext: PropTypes.string,
  isLoyaltyCarousel: PropTypes.bool,
  navArrowPos: PropTypes.string,
};

export default Carousel;
