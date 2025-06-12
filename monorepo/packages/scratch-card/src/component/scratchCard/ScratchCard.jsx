import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ScratchCard = ({ srcimg, onScratchComplete, cpn }) => {
  const canvasRef = useRef(null);
  const scratchPercentage = useRef(0);

  const checkScratchCompletion = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const totalPixels = imageData.data.length / 4;
    let clearPixels = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) {
        clearPixels += 1;
      }
    }

    scratchPercentage.current = (clearPixels / totalPixels) * 100;

    if (scratchPercentage.current > 40) {
      ctx.clearRect(0, 0, width, height);
      onScratchComplete();
    }
  };

  const initScratchCard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width } = canvas;
    const { height } = canvas;
    const img = new Image();
    img.src = srcimg;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      ctx.globalCompositeOperation = 'destination-out';

      const handlePointerMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();
        checkScratchCompletion(ctx, width, height);
      };

      canvas.addEventListener('mousemove', handlePointerMove);
      canvas.addEventListener('touchmove', handlePointerMove);
    };
  };

  useEffect(() => {
    initScratchCard();
  }, []);

  return (

    <canvas ref={canvasRef} className="sc-img" style={{ backgroundImage: `url(${cpn})` }} />
  );
};

ScratchCard.propTypes = {
  srcimg: PropTypes.string,
  onScratchComplete: PropTypes.func,
  cpn: PropTypes.string,
};

export default ScratchCard;
