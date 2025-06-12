import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { TripTypes } from 'skyplus-design-system-app/src/functions/globalConstants';

/**
 * Represents a city item in the city selection popover.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onChange - The function to be called when the city item is changed.
 * @param {string} props.airportName - The name of the airport.
 * @param {string} props.fullName - The full name of the city.
 * @param {string} props.stationCode - The station code of the city.
 * @param {boolean} props.isNationalityPopup - Indicates if nationality declaration is required for this destination.
 * @returns {JSX.Element} The rendered CityItem component.
 */
const CityItem = ({
  onChange,
  dataIndex,
  dataGroup,
  triptype,
  formKey,
  nationalityDeclarationLabel,
  ...item
}) => {
  const { airportName, fullName, stationCode, isNationalityPopup } = item;

  const onClickItem = () => {
    onChange(item);
  };

  /**
   * Handles the key up event on the city item.
   *
   * @param {KeyboardEvent} e - The key up event.
   */
  const onKeyUp = (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      onChange(item);
    }

    if (e.key === 'ArrowDown') {
      e?.currentTarget?.nextSibling?.focus();
    }

    if (e.key === 'ArrowUp') {
      e.currentTarget?.previousSibling?.focus();
    }
  };

  const showNationalityLabel = useMemo(() => {
    if (triptype === TripTypes.ROUND && isNationalityPopup) {
      return true;
    }

    return formKey === 'sourceCity' && isNationalityPopup;
  }, [triptype]);

  return (
    <div
      className="city-selection__list-item-wrapper"
      onClick={onClickItem}
      tabIndex="0"
      aria-labelledby={fullName}
      onKeyUp={onKeyUp}
      aria-controls="dropdown-menu"
      aria-expanded={false}
      role="combobox"
      data-index={dataIndex}
      {...(dataGroup && { 'data-group': dataGroup })}
    >
      <div className="city-selection__list-item gap-6">
        <Icon className="icon-origin-loc" size="lg" />
        <div className="city-selection__list-item--info">
          <div className="city-selection__list-item--info__left">
            <Text
              variation="body-medium-regular"
              mobileVariation="body-small-regular"
            >
              {fullName}
            </Text>
            <Text
              variation="body-small-regular"
              mobileVariation="body-extra-small-regular"
            >
              {airportName}
            </Text>
          </div>
          <div className="city-selection__list-item--info__right">
            <Text variation="body-medium-regular">{stationCode}</Text>
          </div>
        </div>
      </div>
      {showNationalityLabel && (
        <Text variation="body-small-regular px-10 nationality-msg pb-4">
          {nationalityDeclarationLabel}
        </Text>
      )}
    </div>
  );
};

CityItem.propTypes = {
  airportName: PropTypes.string,
  fullName: PropTypes.string,
  dataIndex: PropTypes.number,
  dataGroup: PropTypes.string,
  onChange: PropTypes.func,
  stationCode: PropTypes.string,
  isNationalityPopup: PropTypes.bool,
  triptype: PropTypes.string,
  formKey: PropTypes.string,
  nationalityDeclarationLabel: PropTypes.string,
};

export default CityItem;
