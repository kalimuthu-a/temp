import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import TravelAssistance from './TravelAssistance';
import { AppContext } from '../../../context/AppContext';

/**
 *
 * @type {React.FC<*>}
 * @returns
 */
export const TravelAssistanceWrapper = (props) => {
  /**
   * @type {import("react").MutableRefObject<HTMLDivElement>}
   */
  const ref = useRef();
  const {
    state: { istravelAssistanceAddedFromPE },
  } = useContext(AppContext);
  useEffect(() => {
    if (istravelAssistanceAddedFromPE) {
      ref.current?.parentElement?.classList.add('d-none');
    }
  }, [istravelAssistanceAddedFromPE]);

  return istravelAssistanceAddedFromPE ? (
    <div ref={ref} />
  ) : (
    <TravelAssistance {...props} />
  );
};

TravelAssistanceWrapper.propTypes = {
  ssrCategory: PropTypes.string,
  addonData: PropTypes.any,
  passengerDetails: PropTypes.any,
  isRecommended: PropTypes.bool,
};

export default TravelAssistanceWrapper;
