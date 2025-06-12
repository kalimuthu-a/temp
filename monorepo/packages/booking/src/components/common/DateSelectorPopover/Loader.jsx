import PropTypes from 'prop-types';
import React from 'react';

const Loader = ({ loading }) => {
  return loading ? (
    <span className="loading">???</span>
  ) : (
    <span className="dash">-</span>
  );
};

Loader.propTypes = {
  loading: PropTypes.bool,
};

export default Loader;
