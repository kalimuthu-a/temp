import React, { useState, useEffect, useRef } from 'react';
import useAppContext from '../../hooks/useAppContext';

import FlightDateCarousel from './FlightDateCarousel';

const FlightDateContainer = () => {
  const {
    state: { segments, selectedTripIndex },
  } = useAppContext();

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollYRef.current) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return segments.map((segment, index) => {
    return (
      <FlightDateCarousel
        segment={segment}
        key={segment.id}
        selectedTripIndex={selectedTripIndex}
        swiperSelectorClass={`flight-date-carousel-id-${index}`}
        containerClass={`flight-date-slider ${
          selectedTripIndex === index ? '' : 'd-none'
        } ${isVisible ? '' : 'hide-on-scroll'}`}
        index={index}
      />
    );
  });
};

export default FlightDateContainer;
