import PropTypes from 'prop-types';
import React, {
  forwardRef,
  useLayoutEffect,
  useImperativeHandle,
  useRef,
} from 'react';

const SwiperComponent = forwardRef(
  (
    {
      children,
      containerClass = '',
      swiperConfig,
      swiperSelectorClass = 'swiper-des',
    },
    ref,
  ) => {
    const swiper = useRef(null);

    useImperativeHandle(ref, () => {
      return {
        swiper,
      };
    });

    const containerRef = useRef(null);

    useLayoutEffect(() => {
      try {
        // eslint-disable-next-line no-undef
        swiper.current = new Swiper(`.${swiperSelectorClass}`, swiperConfig);
      } catch (error) {
        // @todo error handling
      }
    }, [swiperConfig]);

    return (
      <div className={`skyplus-slider ${containerClass}`} ref={containerRef}>
        <div className={swiperSelectorClass}>
          <div className="swiper-wrapper">{children}</div>
          <div className="swiper-button-prev" />
          <div className="swiper-button-next" />
          <div className="swiper-pagination" />
        </div>
      </div>
    );
  },
);

SwiperComponent.propTypes = {
  children: PropTypes.any,
  containerClass: PropTypes.string,
  swiperConfig: PropTypes.any,
  swiperSelectorClass: PropTypes.string,
};

SwiperComponent.Slide = ({ children, className }) => {
  return <div className={`swiper-slide ${className}`}>{children}</div>;
};

SwiperComponent.Slide.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default SwiperComponent;
