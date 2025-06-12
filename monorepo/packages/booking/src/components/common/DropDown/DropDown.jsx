import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';

import map from 'lodash/map';

import { TripTypes } from 'skyplus-design-system-app/src/functions/globalConstants';
import searchIcon from '../../../assets/images/search.svg';
import Popover from '../Popover/Popover';
import useAppContext from '../../../hooks/useAppContext';
import { FormContext } from '../../Form/FormContext';

const DropDown = ({
  withSearch,
  items,
  renderElement,
  containerClass,
  renderItem,
  onSearch,
  heading,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const {
    state: { additional, authUser, isLoyaltyEnabled },
  } = useAppContext();
  const { formState } = useContext(FormContext);

  const onChangeSearch = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const renderChildItem = (value, key) => {
    if (Array.isArray(value)) {
      return (
        <div key={key}>
          <span className="group-name">{key}</span>
          {value.map(renderItem)}
        </div>
      );
    }

    return renderItem(value);
  };

  const onCloseHandler = () => {
    onChangeSearch({ target: { value: '' } });
  };

  return (
    <Popover
      containerClass={`skyplus-dropdown ${containerClass}`}
      renderElement={renderElement}
      renderPopover={() => {
        return (
          <div className="skyplus-dropdown">
            <div className="skyplus-dropdown-popover">
              <div className="skyplus-dropdown-header">
                <Heading heading="h5 text-center mt-12 mb-8 ">
                  {heading}
                </Heading>
              </div>
              {withSearch && (
                <div className="skyplus-dropdown-list__searchbox">
                  <div
                    className={`search-inputbox d-flex gap-4 ${
                      searchValue ? 'focused' : ''
                    }`}
                  >
                    <img
                      src={searchIcon}
                      width="24px"
                      height="24px"
                      alt="Search"
                    />
                    <input
                      placeholder="Search"
                      onChange={onChangeSearch}
                      value={searchValue}
                    />
                  </div>
                  <hr />
                </div>
              )}
              <div className="scroll-container">
                <div className="skyplus-dropdown-list--container">
                  {map(items, renderChildItem)}
                </div>
                {containerClass === 'pay-mode-dropdown' &&
                  (formState?.triptype?.value || TripTypes.ONE_WAY) ===
                    TripTypes.ONE_WAY &&
                    isLoyaltyEnabled &&
                  authUser?.loyaltyMemberInfo?.FFN &&
                  !authUser?.loyaltyMemberInfo?.pointRedeemEligibilityFlag && (
                    <div className="px-6 py-8 bg-secondary-light mx-8 mb-8">
                      <p className="alert-msg-for-dropdown sh6 text-secondary ">
                        {additional?.notEligibleErrorMessage}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        );
      }}
      onClose={onCloseHandler}
    />
  );
};

DropDown.propTypes = {
  containerClass: PropTypes.any,
  items: PropTypes.any,
  onSearch: PropTypes.func,
  renderElement: PropTypes.any,
  renderItem: PropTypes.func,
  withSearch: PropTypes.any,
  heading: PropTypes.any,
};

export default DropDown;
