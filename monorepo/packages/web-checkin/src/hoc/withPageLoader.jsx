/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 * @param {React.ComponentType<*>} Component
 * @returns {React.ComponentType<*>}
 */
const WithPageLoader = (Component) => {
  const Wrapped = (props) => {
    const { loading, loaderImage } = props;

    return (
      <>
        <Component {...props} />
        {loading && (
          <div className="skyplus-loader skyplus-loader-overlay">
            <div className="h-100 d-flex align-items-center">
              <div className="payment-page-intermediate-orchestrator-dynamic__flight-animation">
                <img
                  src={loaderImage}
                  alt="Loader"
                  width="250px"
                  height="250px"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  Wrapped.propTypes = {
    loading: PropTypes.bool,
    loaderImage: PropTypes.string,
  };

  return Wrapped;
};

WithPageLoader.propTypes = {
  Component: PropTypes.element,
};

export default WithPageLoader;
