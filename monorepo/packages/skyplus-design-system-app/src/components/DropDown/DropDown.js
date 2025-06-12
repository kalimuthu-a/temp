import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import Text from '../Typography/Text/Text';
import Popover from '../Popover/Popover';

const DropDown = ({
  withSearch,
  items,
  renderElement,
  containerClass,
  renderItem,
  searchInputProps,
  setToggleModal,
  disabled = false,
  inputRef,
}) => {
  const renderChildItem = (value, key) => {
    if (Array.isArray(value)) {
      return (
        <div key={key}>
          <Text variation="body-md-reg">{key}</Text>
          {value.map(renderItem)}
        </div>
      );
    }

    return renderItem(value);
  };

  return (
    <Popover
      containerClass={`skyplus-dropdown ${containerClass}`}
      renderElement={renderElement}
      setToggleModal={setToggleModal}
      inputRef={inputRef}
      renderPopover={() => {
        if (disabled) {
          return null;
        }

        return (
          <div className="skyplus-dropdown">
            <div className="skyplus-dropdown-popover">
              {withSearch && (
                <div className="skyplus-dropdown-list__searchbox">
                  <input
                    className="search-inputbox"
                    placeholder="Search"
                    {...searchInputProps}
                  />
                  <hr />
                </div>
              )}
              <div className="skyplus-dropdown-list--container">
                {map(items, renderChildItem)}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

DropDown.propTypes = {
  withSearch: PropTypes.bool,
  items: PropTypes.array,
  renderElement: PropTypes.any,
  setToggleModal: PropTypes.func,
  containerClass: PropTypes.string,
  renderItem: PropTypes.any,
  searchInputProps: PropTypes.any,
  disabled: PropTypes.bool,
  inputRef: PropTypes.shape({
    current: PropTypes.node,
  }),
};

export default DropDown;
