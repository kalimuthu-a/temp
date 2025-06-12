import PropTypes from 'prop-types';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';

import { Pages } from 'skyplus-design-system-app/src/functions/globalConstants';
import Popover from '../../common/Popover/Popover';
import FormField from '../FormField';
import CitySelectionPopover from '../../common/CitySelectionPopover';
import useAppContext from '../../../hooks/useAppContext';
import { FormContext } from '../FormContext';
import {
  cityFormattedValue,
  scrollBookingDropdownsIntoView,
  triggerClosePopup,
} from '../../../utils';
import CitySelectionShimmer from '../../common/CitySelectionPopover/CitySelectionShimmer';
import { bookingActions } from '../../../context/reducer';

const CitySelector = ({
  containerClass,
  topLabel,
  middleLabel,
  hintLabel,
  onSelect,
  formKey = 'sourceCity',
  index = 0,
  cityToExclude = [],
  enabledSwitchJourney = false,
  switchJourney,
  geoLocationOption = false,
  handleDateOpenPopover,
}) => {
  const {
    dispatch,
    state: { main, pageType },
  } = useAppContext();

  const { XPLORE } = Pages;

  const {
    formState: { journies },
  } = useContext(FormContext);

  const { destinationCity, sourceCity } = journies[index];
  const value = journies[index][formKey];

  const [isMobile] = useIsMobileBooking();
  const [data, setData] = useState({
    city: [
      {
        label: cityFormattedValue(sourceCity, main.fromSectionLabel),
        icon: 'icon-switch-destination',
        index: 0,
        active: formKey === 'sourceCity',
        city: sourceCity,
      },
      {
        label: cityFormattedValue(destinationCity, main.goingToLabel),
        icon: 'icon-location',
        index: 1,
        active: formKey === 'destinationCity',
        city: destinationCity,
      },
    ],
    openPopover: false,
    value: '',
    formFieldProps: {
      topLabel,
      middleLabel: value?.stationCode
        ? `${value.fullName}, ${value.stationCode}`
        : middleLabel,
      hintLabel,
      airportName: value?.airportName,
    },
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      city: [
        {
          ...prev.city[0],
          label: cityFormattedValue(sourceCity, main.fromSectionLabel),
          city: sourceCity,
        },
        {
          ...prev.city[1],
          label: cityFormattedValue(destinationCity, main.goingToLabel),
          city: destinationCity,
        },
      ],
    }));
  }, [sourceCity, destinationCity]);

  const onChangePillIndex = (pillIndex) => {
    setData((prev) => ({
      ...prev,
      city: [
        { ...prev.city[0], active: pillIndex === 0 },
        { ...prev.city[1], active: pillIndex === 1 },
      ],
    }));
  };

  const onClickCityItem = (item) => {
    const selectedIndex = data.city.findIndex((i) => i.active === true);

    if (isMobile) {
      const key = selectedIndex === 0 ? 'sourceCity' : 'destinationCity';
      onSelect(key, index, item.value);

      if (selectedIndex === 0 && !destinationCity) {
        setData((prev) => ({
          ...prev,
          city: [
            {
              ...prev.city[0],
              active: false,
              label: cityFormattedValue(item.value),
            },
            { ...prev.city[1], active: true },
          ],
          openPopover: true,
        }));
      } else if (selectedIndex === 1 && !sourceCity) {
        setData((prev) => ({
          ...prev,
          city: [
            {
              ...prev.city[0],
              active: true,
            },
            {
              ...prev.city[1],
              active: false,
              label: cityFormattedValue(item.value),
            },
          ],
        }));
      } else if (
          selectedIndex === 0 &&
          destinationCity &&
          item.geoLocation &&
          item.value.stationCode === destinationCity?.stationCode
        ) {
          onSelect('destinationCity', index, null);

          setData((prev) => ({
            ...prev,
            city: [
              {
                ...prev.city[0],
                label: cityFormattedValue(item.value),
                active: true,
              },
              {
                ...prev.city[1],
                active: false,
                label: '',
                city: null,
              },
            ],
            openPopover: true,
          }));
        } else if (selectedIndex === 0 && destinationCity) {
          setData((prev) => ({
            ...prev,
            city: [
              {
                ...prev.city[0],
                label: cityFormattedValue(item.value),
                active: false,
              },
              {
                ...prev.city[1],
                active: true,
              },
            ],
            openPopover: true,
          }));
        }
      if (sourceCity && selectedIndex === 1) {
        setData((prev) => ({ ...prev, openPopover: false }));
        handleDateOpenPopover?.(true, key);
      }
    } else {
      if (
        item.geoLocation &&
        item.value.stationCode === destinationCity?.stationCode
      ) {
        onSelect('destinationCity', index, null);
      }

      onSelect(formKey, index, item.value);
      if (!isMobile) {
        triggerClosePopup();
      }
    }
     setData((prev) => ({ ...prev, value: '', isTyping: false }));
    if (sourceCity && selectedIndex === 0) {
      dispatch({ type: bookingActions.SET_SOURCE_CITY, payload: item });
    }
  };

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      formFieldProps: {
        topLabel,
        middleLabel: value?.stationCode
          ? `${value.fullName}, ${value.stationCode}`
          : middleLabel,
        hintLabel,
        airportName: value?.airportName,
        filled: Boolean(value?.stationCode),
      },
      value: value?.fullName ?? '',
    }));
  }, [value]);

  const onChangeValue = (e) => {
    const { value: v } = e.target;
    setData((prev) => ({ ...prev, value: v, isTyping: true }));
  };

  const onClickSwitchJourney = (e) => {
    switchJourney();
    e.stopPropagation();
  };

  const onOpen = () => {
    scrollBookingDropdownsIntoView();
    setData((prev) => ({
      ...prev,
      city: [
        {
          ...prev.city[0],
          label: cityFormattedValue(sourceCity, main.fromSectionLabel),
          active: formKey === 'sourceCity',
        },
        {
          ...prev.city[1],
          active: formKey === 'destinationCity',
        },
      ],
      isTyping: false,
      value: '',
      openPopover: true,
    }));
  };

  return (
    <Popover
      onOpen={onOpen}
      openPopover={data?.openPopover}
      renderElement={() => {
        return (
          <>
            <FormField
              containerClass=""
              {...data.formFieldProps}
              inputProps={{
                onChange: onChangeValue,
                value: data.value,
                'data-value': JSON.stringify(value),
              }}
              accessiblityProps={{
                'aria-label': formKey,
              }}
            />
            {formKey === 'sourceCity' && pageType !== XPLORE && (
              <Icon
                className={`icon-switch-destination ${
                  enabledSwitchJourney ? '' : 'disabled-icon'
                }`}
                size="sm"
                onClick={onClickSwitchJourney}
                role="button"
                aria-label="Switch Journey"
              />
            )}
          </>
        );
      }}
      renderPopover={() => (
        <Suspense fallback={<CitySelectionShimmer />}>
          <CitySelectionPopover
            onChangeCity={onClickCityItem}
            legs={data.city}
            outsideSearch={data}
            cityToExclude={cityToExclude}
            geoLocationOption={geoLocationOption}
            onChangePillIndex={onChangePillIndex}
            formKey={formKey}
          />
        </Suspense>
      )}
      containerClass={containerClass}
    />
  );
};

CitySelector.propTypes = {
  cityToExclude: PropTypes.array,
  containerClass: PropTypes.string,
  handleDateOpenPopover: PropTypes.func,
  enabledSwitchJourney: PropTypes.bool,
  formKey: PropTypes.string,
  geoLocationOption: PropTypes.bool,
  hintLabel: PropTypes.string,
  index: PropTypes.number,
  middleLabel: PropTypes.string,
  onSelect: PropTypes.func,
  switchJourney: PropTypes.func,
  topLabel: PropTypes.string,
  value: PropTypes.shape({
    airportName: PropTypes.any,
    fullName: PropTypes.string,
    stationCode: PropTypes.any,
    toLowerCase: PropTypes.func,
  }),
};

export default CitySelector;
