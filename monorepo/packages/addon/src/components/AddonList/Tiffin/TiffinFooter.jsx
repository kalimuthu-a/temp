import React from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { AppContext } from '../../../context/AppContext';
import BottomPriceBlock from './BottomPriceBlock';

const TiffinFooter = (props) => {
  const { state } = React.useContext(AppContext);
  const { itemLabel, handleContinue, disable, continueCtaLabel } = props;

  return (
    <>
      {state.totalMealsPriceCount[state.tripIndex]?.count !== 0 && (
        <BottomPriceBlock
          priceCount={state.totalMealsPriceCount[state.tripIndex]}
          itemLabel={itemLabel}
        />
      )}
      <Button
        containerClass="skyplus-tiffin-slide__footer-continue-btn"
        color="primary"
        onClick={handleContinue}
        disabled={disable}
      >
        {continueCtaLabel}
      </Button>
    </>
  );
};

TiffinFooter.propTypes = {
  itemLabel: PropTypes.string,
  handleContinue: PropTypes.func,
  disable: PropTypes.bool,
  continueCtaLabel: PropTypes.string,

};

export default TiffinFooter;
