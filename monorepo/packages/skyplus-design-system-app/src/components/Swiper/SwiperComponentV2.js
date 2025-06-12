import PropTypes from 'prop-types';
import React, {
  forwardRef,
  useLayoutEffect,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react';

const SwiperComponentV2 = forwardRef(
  (
    {
      children,
      containerClass = '',
      swiperConfig,
      swiperSelectorClass = 'swiper-des',
      index=1,
    },
    ref,
  ) => {
    const containerRef = useRef(null);
    const swiper = useRef(null);
    const [init, setInit] = useState(false);
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
          setInit(true);
          }, index*100);
          observer.disconnect();
        }
      });
  
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
  
      return () => observer.disconnect();
    }, []);
    useImperativeHandle(ref, () => {
      return {
        swiper,
      };
    });


    useLayoutEffect(() => {
      try {
        if (init && containerRef.current) {
        swiper.current = new Swiper(containerRef.current.querySelector(`.${swiperSelectorClass}`), swiperConfig);
        // eslint-disable-next-line no-undef
        }
      } catch (error) {
        // @todo error handling
      }
    }, [swiperConfig,init]);

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

SwiperComponentV2.propTypes = {
  children: PropTypes.any,
  containerClass: PropTypes.string,
  swiperConfig: PropTypes.any,
  swiperSelectorClass: PropTypes.string,
};

SwiperComponentV2.Slide = ({ children, className }) => {
  return <div className={`swiper-slide ${className}`}>{children}</div>;
};

SwiperComponentV2.Slide.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default SwiperComponentV2;