import PropTypes from 'prop-types';
import React, { useState, useContext, useEffect } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { PayWithModes } from 'skyplus-design-system-app/src/functions/globalConstants';
import DropDown from '../../common/DropDown/DropDown';
import CurrencyDropDownItem from '../../common/MenuItem/CurrencyDropDownItem';
import useAppContext from '../../../hooks/useAppContext';
import { FormContext } from '../FormContext';
import { formActions } from '../formReducer';
import { getRecentCurrencySearch } from '../../../utils/localStorageUtils';
import CalendarResponseService from '../../../services/calendar.response';

const CurrencySelector = ({ items }) => {
  const {
    formState: { currency, payWith },
    dispatch,
  } = useContext(FormContext);

  const {
    state: { main, additional },
  } = useAppContext();

  const groupByName = (v) => {
    const recentSearches = getRecentCurrencySearch();

    const popularCurrencies = [];
    const recentSearchesCurrency = [];

    items.forEach((row) => {
      if (row?.currencyCode?.toLowerCase().includes(v?.toLowerCase())) {
        if (recentSearches.includes(row.currencyCode)) {
          recentSearchesCurrency.push(row);
        }

        popularCurrencies.push(row);
      }
    });

    return {
      ...(recentSearchesCurrency.length > 0 && {
        [main.recentSearchLabel]: recentSearchesCurrency,
      }),
      ...(popularCurrencies.length > 0 && {
        'All Currencies': popularCurrencies,
      }),
    };
  };

  const [currencyItems, setCurrencyItems] = useState(() => groupByName(''));

  const onSearchHandler = (search) => {
    const data = groupByName(search);
    setCurrencyItems(data);
  };

  const onSelectCurrency = (item) => {
    CalendarResponseService.flushCache();
    dispatch({
      type: formActions.CHANGE_FORM_ITEM,
      payload: { currency: item },
    });
  };

  useEffect(() => {
    if (payWith !== PayWithModes.CASH) {
      CalendarResponseService.flushCache();
      dispatch({
        type: formActions.CHANGE_FORM_ITEM,
        payload: { currency: { currencyCode: 'INR', currencySymbol: '₹' } },
      });
    }
  }, [payWith]);

  return (
    <DropDown
      renderElement={() => (
        <div
          className={`search-widget-form-top__currency d-flex gap-4 ${
            payWith !== PayWithModes.CASH ? 'text-btn-disabled-background' : ''
          }`}
          role="combobox"
          tabIndex={0}
          aria-controls="dropdown-menu"
          aria-expanded={false}
          aria-label="Currency Selector"
        >
          <span className="body-extra-small-regular label">
            {main.currencyLabel}
          </span>
          <span className="symbol">{currency.currencySymbol}</span>
          {currency.currencyCode}
          <Icon className="icon-accordion-down-simple" size="sm" />
        </div>
      )}
      withSearch
      containerClass={`currency-dropdown-desktop ${
        payWith !== PayWithModes.CASH
          ? 'pe-none text-btn-disabled-background'
          : ''
      }`}
      items={currencyItems}
      renderItem={(item) => (
        <CurrencyDropDownItem
          {...item}
          onChange={onSelectCurrency}
          key={item.currencyCode}
        />
      )}
      onSearch={onSearchHandler}
      heading={additional.chooseCurrencyLabel}
    />
  );
};

CurrencySelector.propTypes = {
  items: PropTypes.array,
  onSelect: PropTypes.func,
  value: PropTypes.shape({
    currencyCode: PropTypes.any,
    currencySymbol: PropTypes.any,
    toLowerCase: PropTypes.func,
  }),
};

export default CurrencySelector;
