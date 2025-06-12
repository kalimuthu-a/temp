/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React from 'react';

const FlightIcon = ({ fill = '#000999' }) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.46969 15.3646L18.7196 5.11421C19.0125 4.82131 19.4873 4.8213 19.7802 5.11419C20.0731 5.40707 20.0731 5.88195 19.7802 6.17485L9.53037 16.4252C9.23749 16.7181 8.76261 16.7181 8.46971 16.4252C8.17681 16.1324 8.1768 15.6575 8.46969 15.3646Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.9998 7.89463V18.6449C16.9998 19.0591 16.664 19.3949 16.2498 19.3949C15.8356 19.3949 15.4998 19.0591 15.4998 18.6449V9.39466L6.24984 9.39489C5.83563 9.3949 5.49984 9.05912 5.49983 8.64491C5.49981 8.23069 5.83559 7.8949 6.24981 7.89489L16.9998 7.89463Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 14.8949V20.1449C10 20.5591 9.66421 20.8949 9.25 20.8949C8.83579 20.8949 8.5 20.5591 8.5 20.1449V16.3949H4.75C4.33579 16.3949 4 16.0591 4 15.6449C4 15.2306 4.33579 14.8949 4.75 14.8949H10Z"
        fill={fill}
      />
    </svg>
  );
};

FlightIcon.propTypes = {
  fill: PropTypes.string,
};

export default FlightIcon;
