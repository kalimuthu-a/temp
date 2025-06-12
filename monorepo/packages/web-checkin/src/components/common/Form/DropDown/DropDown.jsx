import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';

import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Popover from '../../Popover/Popover';

const DropDown = ({
  withSearch,
  items,
  renderElement,
  containerClass,
  renderItem,
  onSearch,
  heading,
  onSelectItem,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const [showPopover, setShowPopover] = useState(false);

  const inputRef = useRef(null);

  const onChangeSearch = (e) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const onSelectItemHandler = (v) => {
    setShowPopover(false);
    onSelectItem(v);
  };

  const renderChildItem = (v) => {
    return (
      <div
        key={v.value}
        onClick={() => {
          onSelectItemHandler(v);
        }}
        role="presentation"
      >
        {renderItem(v)}
      </div>
    );
  };

  const onOpenPopover = () => {
    setShowPopover(true);

    if (withSearch) {
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 100);
    }
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
                <Heading heading="h5 text-center my-10">{heading}</Heading>
              </div>
              {withSearch && (
                <div className="skyplus-dropdown-list__searchbox">
                  <div className="search-inputbox d-flex gap-4">
                    <Icon className="icon-search" size="lg" />
                    <input
                      placeholder="Search"
                      onChange={onChangeSearch}
                      value={searchValue}
                      ref={inputRef}
                    />
                  </div>
                  <hr />
                </div>
              )}
              <div className="scroll-container">
                <div className="skyplus-dropdown-list--container">
                  {items?.map(renderChildItem)}
                </div>
              </div>
            </div>
          </div>
        );
      }}
      showPopover={showPopover}
      onOpen={onOpenPopover}
    />
  );
};

DropDown.propTypes = {
  containerClass: PropTypes.any,
  items: PropTypes.any,
  onSearch: PropTypes.func,
  renderElement: PropTypes.any,
  renderItem: PropTypes.func,
  onSelectItem: PropTypes.func,
  withSearch: PropTypes.any,
  heading: PropTypes.string,
};

export default DropDown;
