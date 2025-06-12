import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const ReadMoreLess = ({ moreText, lessText }) => {
  const [isReadMore, setIsReadMore] = useState(false);

  const handleSpanClick = (event) => {
    if (event.target.classList.contains('read-more')) {
      setIsReadMore(true); // Show the moreText
    } else if (event.target.classList.contains('read-less')) {
      setIsReadMore(false); // Show the lessText
    }
  };

  useEffect(() => {
    const content = document.querySelector('.note-text');
    if (content) {
      content.addEventListener('click', handleSpanClick);
    }
    return () => {
      if (content) {
        content.removeEventListener('click', handleSpanClick);
      }
    };
  }, []);

  return (
    <div className="note-text">
      <HtmlBlock html={isReadMore ? moreText : lessText} />
    </div>
  );
};
ReadMoreLess.propTypes = {
  moreText: PropTypes.string,
  lessText: PropTypes.string,
};
export default ReadMoreLess;
