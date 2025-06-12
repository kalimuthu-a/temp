import { useState } from 'react';
import PropTypes from 'prop-types';
import './SwipeHandle.scss';

const SwipeHandle = ({ setOpen }) => {
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    document.body.style.overflowY = 'hidden';
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    if (deltaY < -30) {
      setOpen(true); // Swipe up to open drawer
    } else if (deltaY > 30) {
      setOpen(false); // Swipe down to close drawer
    }
  };

  const handleTouchEnd = () => {
    document.body.style.overflowY = 'auto';
  };

  return (
    <button
      type="button"
      aria-label="Swipe Up"
      className="swipe-up-handle"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
};

SwipeHandle.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default SwipeHandle;
