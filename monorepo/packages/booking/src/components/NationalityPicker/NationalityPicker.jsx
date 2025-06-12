/* eslint-disable react/jsx-wrap-multilines */
import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import groupBy from 'lodash/groupBy';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

import DropDown from '../common/DropDown/DropDown';
import CoutryMenuItem from './CoutryMenuItem';

import './NationalityPicker.scss';
import useAppContext from '../../hooks/useAppContext';
import { FormContext } from '../Form/FormContext';
import { formActions } from '../Form/formReducer';
import NationalityMobileHeading from './NationalityMobileHeading';
import { triggerClosePopup } from '../../utils';

const NationalityPicker = ({ items }) => {
  const {
    state: { additional },
  } = useAppContext();

  const {
    formState: { nationality },
    dispatch,
  } = useContext(FormContext);

  const groupByName = (v) => {
    return groupBy(
      items.filter((row) => row.name.toLowerCase().includes(v.toLowerCase())),
      (i) => i.name[0].toUpperCase(),
    );
  };

  const [countryItems, setCountryItems] = useState(() => groupByName(''));

  const [expanded, setExpanded] = useState(false);

  const onSearchHandler = (v) => {
    const data = groupByName(v);
    setCountryItems(data);
    setExpanded(false);
  };

  const onSelectCountry = (item) => {
    triggerClosePopup();

    dispatch({
      type: formActions.CHANGE_FORM_ITEM,
      payload: { nationality: item },
    });
  };

  return (
    <DropDown
      renderElement={() => {
        return (
          <div
            className="search-widget-form-top__nationality d-flex gap-2"
            tabIndex={0}
            aria-controls="dropdown-menu"
            aria-expanded={false}
            role="combobox"
          >
            <span className="body-extra-small-regular label">
              {additional.nationalityLabel}
            </span>

            {nationality?.countryCode ? (
              <div className="d-flex align-items-center gap-4">
                <span
                  className={`fflag fflag-${nationality.countryCode} ff-md ff-wave`}
                />
                <span className="country-name">{nationality.name}</span>
              </div>
            ) : (
              additional.nationalityData.title
            )}
            <Icon className="icon-accordion-down-simple" size="sm" />
          </div>
        );
      }}
      withSearch
      containerClass="nationality-dropdown--desktop"
      renderItem={(item) => (
        <CoutryMenuItem
          {...item}
          onSelect={onSelectCountry}
          key={item.countryCode}
        />
      )}
      items={countryItems}
      onSearch={onSearchHandler}
      heading={
        <NationalityMobileHeading
          title={additional.nationalityData.title}
          content={additional.nationalityData.description.html}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      }
    />
  );
};

NationalityPicker.propTypes = {
  items: PropTypes.array,
};

export default NationalityPicker;
