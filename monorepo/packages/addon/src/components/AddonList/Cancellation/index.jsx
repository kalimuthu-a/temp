import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Cancellation from './Cancellation';
import { AppContext } from '../../../context/AppContext';

/**
 *
 * @type {React.FC<*>}
 * @returns
 */
export const CancellationWrapper = (props) => {
  /**
   * @type {import("react").MutableRefObject<HTMLDivElement>}
   */
  const ref = useRef();
  const {
    state: { isZeroCancellationAddedFromPE },
  } = useContext(AppContext);
  useEffect(() => {
    if (isZeroCancellationAddedFromPE) {
      ref.current?.parentElement?.classList.add('d-none');
    }
  }, [isZeroCancellationAddedFromPE]);

  return isZeroCancellationAddedFromPE ? (
    <div ref={ref} />
  ) : (
    <Cancellation {...props} />
  );
};

CancellationWrapper.propTypes = {
  ssrCategory: PropTypes.string,
  addonData: PropTypes.any,
  passengerDetails: PropTypes.any,
  isRecommended: PropTypes.bool,
};

export default CancellationWrapper;
