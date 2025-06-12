import React, { useState } from 'react';
import PropTypes from 'prop-types';
/**
 *
 * @description Show More Component
 *
 * @example
 * <ShowMoreHtml text="Text to Show More" length={2} />
 *
 * @type {React.FC<{text: string, length?: number, readMoreLabel?: string, readLessLabel?: string}>}
 * @returns {React.FunctionComponentElement}
 */
const ShowMoreHtml = ({
  text,
  length = 10,
  readMoreLabel = 'Read More',
  readLessLabel = 'Read Less',
}) => {
  const [more, setMore] = useState(false);
  const div1 = document.createElement('div1');
  div1.innerHTML = more ? text : text.slice(0, length);

  const onClickHandler = (e) => {
    if (e.target.tagName.toLowerCase() === 'span') {
      setMore((prev) => !prev);
    }
  };

  const span = document.createElement('span');

  span.innerHTML = more ? readLessLabel : `...${readMoreLabel}`;

  if (div1.children.length > 0) {
    div1.children[0].append(span);
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: div1.innerHTML }}
      onClick={onClickHandler}
    />
  );
};

ShowMoreHtml.defaultProps = {
  length: 10,
};
ShowMoreHtml.propTypes = {
  length: PropTypes.number,
  readLessLabel: PropTypes.string,
  readMoreLabel: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default ShowMoreHtml;
