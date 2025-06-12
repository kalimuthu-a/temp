import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import Front from './Front';
import DropDown from '../DropDown/DropDown';
import CoutryMenuItem from './CoutryMenuItem';
import CountriesWithCodes from './countries';
import { PREFFERED_COUNTRY } from '../../common/Constants/constants';
import ModalComponent from '../ModalComponent/ModalComponent';

const CountryDropDown = (props) => {
  const {
    list,
    isDisabled,
    containerClass,
    setIsInternational,
    onChangeCountryCode,
    countryDropdownField,
    defaultValue,
    ...otherProps
  } = props;
  const items = list || CountriesWithCodes;
  const [countryList, setCountryList] = useState(items);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleModalSecond, setToggleModalSecond] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(PREFFERED_COUNTRY);
  useEffect(() => {
    const sortCountriesByName = sortBy(countryList, 'name');
    setCountryList(sortCountriesByName);
  }, [selectedCountry]);
  // Getting country name from country code.
  useEffect(() => {
    try {
      const isSameCountryInState = (defaultValue === selectedCountry?.phoneCode);
      if (defaultValue && !isSameCountryInState) {
        const countryObj = CountriesWithCodes?.find((country) => {
          return country?.phoneCode.includes(String(defaultValue));
        });
        if (countryObj) setSelectedCountry(countryObj);
      }
    } catch (error) {
    // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [defaultValue]);

  useEffect(() => {
    setCountryList(items);
  }, [toggleModal, toggleModalSecond]);

  const filterCountriesByQuery = (query) => {
    const lowerQuery = query?.toLowerCase()?.replace('+', '');
    let data = [];
    data = items.filter((countryItem) => {
      if (countryItem?.countryName?.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      return countryItem?.phoneCode?.find((i) => (query.includes('+') ? i?.startsWith(lowerQuery) : i?.includes(lowerQuery)));
    });
    return data;
  };

  const onSearchHandler = (query) => {
    const data = filterCountriesByQuery(query);
    setCountryList(data);
  };

  const onSelectCountry = (item) => {
    setSelectedCountry(item);
    const isInternational = item.countryCode
      !== PREFFERED_COUNTRY.countryCode;
    setIsInternational(isInternational);
    setCountryList(items);
    if (setIsInternational) setIsInternational(isInternational);
    if (onChangeCountryCode) onChangeCountryCode(item.countryCode, item);
    setToggleModalSecond(false);
  };

  const modalContent = () => {
    return (
      <>
        <div className="skyplus-dropdown-list__searchbox">
          <div className="d-flex search-inputbox">
            <div className="search-input d-flex">
              <span className="icon-search pe-5" />
              <input
                placeholder="Search"
                onChange={(e) => onSearchHandler(e.target.value)}
              />
            </div>
          </div>
          <hr />
        </div>
        {countryList.map((item) => (
          <CoutryMenuItem
            {...item}
            otherProps={otherProps}
            onSelect={onSelectCountry}
            key={item.countryCode}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <DropDown
        heading=""
        withSearch={!isDisabled}
        renderItem={(item) => (!isDisabled ? (
          <CoutryMenuItem
            {...item}
            otherProps={otherProps}
            onSelect={onSelectCountry}
            key={item.countryCode}
          />
        ) : null)}
        items={countryList}
        renderElement={() => (
          <Front
            toggleModal={toggleModal}
            selectedCountry={selectedCountry}
            setToggleModal={setToggleModal}
            setToggleModalSecond={setToggleModalSecond}
            countryDropdownField={countryDropdownField}
            isDisabled={isDisabled}
            {...otherProps}
          />
        )}
        setToggleModal={setToggleModal}
        searchInputProps={{ onChange: (e) => onSearchHandler(e.target.value) }}
        containerClass={`nationality-dropdown-desktop ${containerClass}`}
      />
      <div className="d-md-none">
        {toggleModalSecond ? (
          <ModalComponent
            showCrossIcon
            variation="dropdown"
            modalContent={modalContent}
            onCloseHandler={() => setToggleModalSecond(false)}
            modalContentClass="bottom-0 w-100 px-0"
            modalWrapperClass="nationality-dropdown-desktop"
          />
        ) : null}
      </div>
    </>
  );
};

CountryDropDown.propTypes = {
  list: PropTypes.array,
  isDisabled: PropTypes.bool,
  onSelect: PropTypes.func,
  value: PropTypes.shape({
    countryCode: PropTypes.any,
    name: PropTypes.any,
    toLowerCase: PropTypes.func,
  }),
  countryDropdownField: PropTypes.any,
  renderElement: PropTypes.any,
  containerClass: PropTypes.string,
  setIsInternational: PropTypes.func,
  onChangeCountryCode: PropTypes.func,
  defaultValue: PropTypes.object,
};

export default CountryDropDown;
