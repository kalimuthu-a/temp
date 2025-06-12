import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './DragSlider.scss';

function DragSlider({ children, containerClass }) {
  const [isDown, setIsDown] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const rootRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDown(true);
    startXRef.current = e.pageX - rootRef.current.offsetLeft;
    scrollLeftRef.current = rootRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    const x = e.pageX - rootRef.current.offsetLeft;
    const walk = x - startXRef.current;
    rootRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTouchStart = (e) => {
    setIsDown(true);
    startXRef.current = e.touches[0].pageX - rootRef.current.offsetLeft;
    scrollLeftRef.current = rootRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - rootRef.current.offsetLeft;
    const walk = x - startXRef.current;
    rootRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <ul
      ref={rootRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseLeave={() => setIsDown(false)}
      onMouseUp={() => setIsDown(false)}
      onTouchEnd={() => setIsDown(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`drag-slider__list w-100 overflow-hidden ${containerClass}`}
      aria-hidden="true"
    >
      {children}
    </ul>
  );
}

DragSlider.propTypes = {
  children: PropTypes.any,
  containerClass: PropTypes.string,
};

export default DragSlider;
