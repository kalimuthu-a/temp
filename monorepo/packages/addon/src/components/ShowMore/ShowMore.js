import React, { useState } from 'react';
import PropTypes from 'prop-types';
/**
 *
 * @description Show More Component
 *
 * @example
 * <ShowMore text="Text to Show More" length={2} />
 *
 * @type {React.FC<{text: string, length?: number, readMoreLabel?: string, readLessLabel?: string}>}
 * @returns {React.FunctionComponentElement}
 */
const ShowMore = ({
  text,
  length = 10,
  readMoreLabel = 'Read More',
  readLessLabel = 'Read Less',
}) => {
  const [more, setMore] = useState(false);
  const div1 = document.createElement('div1');
  div1.innerHTML = more ? text : text.slice(0, length);
  return (
    <>
      {div1.innerText}
      {more ? null : '...'}
      <span onClick={() => setMore((prev) => !prev)}>
        {more ? readLessLabel : readMoreLabel}
      </span>
    </>
  );
};

ShowMore.defaultProps = {
  length: 10,
};
ShowMore.propTypes = {
  text: PropTypes.string.isRequired,
  readLessLabel: PropTypes.string,
  readMoreLabel: PropTypes.string,
  length: PropTypes.number,
};

export default ShowMore;
