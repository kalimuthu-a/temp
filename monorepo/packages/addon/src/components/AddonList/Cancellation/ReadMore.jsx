import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
/**
 *
 * @type {React.FC<{html: string, length?: number, readLessLabel: string, readMoreLabel: string}>}
 * @returns {React.FunctionComponentElement}
 */
const ReadMore = ({ html, length = 200, readLessLabel, readMoreLabel }) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  const [flag, setFlag] = useState(false);
  const [fullText] = useState(div.innerText);
  const [latestText, setLatestText] = useState(fullText);

  const changeText = () => {
    const isTrue = !flag;
    setFlag(isTrue);
    if (isTrue) {
      const txt = fullText.slice(0, length);
      setLatestText(txt);
    } else {
      setLatestText(fullText);
    }
  };
  useEffect(() => {
    changeText();
  }, []);

  return (
    <div className="skyplus-cancellation__benefit-disclaimer">
      <b>{latestText.slice(0, 10)}</b>
      {latestText.slice(10)}
      <span className="skyplus-cancellation__benefit-more" onClick={changeText} aria-hidden="true">
        {flag ? ` ...${readMoreLabel}` : ` ${readLessLabel}`}
      </span>
    </div>
  );
};

ReadMore.defaultProps = {};
ReadMore.propTypes = {
  html: PropTypes.string,
  length: PropTypes.number,
  readLessLabel: PropTypes.string,
  readMoreLabel: PropTypes.string,
};

export default ReadMore;
