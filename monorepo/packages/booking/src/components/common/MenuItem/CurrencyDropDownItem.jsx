import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import { a11y } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import { triggerClosePopup } from '../../../utils';

const CurrencyDropDownItem = ({
  currencyCode,
  description,
  country = '',
  currencySymbol,
  onChange,
}) => {
  const onClickItem = () => {
    onChange({ currencyCode, currencySymbol });
    triggerClosePopup();
  };

  const onKeyUpHandler = (e) => {
    if ([a11y.keyCode.enter, a11y.keyCode.space].includes(e.keyCode)) {
      onClickItem();
    }
  };

  return (
    <div
      className="currency-dropdown-item"
      onClick={onClickItem}
      role="option"
      tabIndex="0"
      onKeyUp={onKeyUpHandler}
      aria-selected="false"
    >
      <Text variation="body-medium-bold" containerClass="symbol">
        {currencySymbol}
      </Text>
      <div className="currency-dropdown-item--container">
        <div className="currency-dropdown-item--container__left">
          <Text variation="body-medium-regular">{currencyCode}</Text>
          <Text
            variation="body-small-regular"
            containerClass="text-text-secondary"
          >
            {description}
          </Text>
        </div>
        <div className="currency-dropdown-item--container__right">
          <Text variation="body-medium-regular">{country}</Text>
        </div>
      </div>
    </div>
  );
};

CurrencyDropDownItem.propTypes = {
  country: PropTypes.string,
  currencyCode: PropTypes.string,
  description: PropTypes.string,
  currencySymbol: PropTypes.string,
  onChange: PropTypes.func,
};

export default CurrencyDropDownItem;
