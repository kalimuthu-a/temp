import PropTypes from 'prop-types';
import React, { Suspense, useEffect, useState } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Text from 'skyplus-design-system-app/dist/des-system/Text';

import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';
import Popover from '../../common/Popover/Popover';

import customEvent from '../../../utils/customEvent';
import CitySelectionPopover from '../../common/CitySelectionPopover';
import DateSelectorPopover from '../../common/DateSelectorPopover';
import { FormContextProvider } from '../FormContext';
import { cityFormattedValue, getMaxDateForCalendar } from '../../../utils';
import useAppContext from '../../../hooks/useAppContext';

const TempForm = ({ context }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {
    state: { main, airportsData },
  } = useAppContext();
  const [isMobile] = useIsMobileBooking();
  const [data, setData] = useState(() => {
    const defaultLocationEle = document.getElementById('src-dest-iata');
    const defaultSource = defaultLocationEle?.dataset?.originIata || '';

    const sourceCity = airportsData.find(
      (airport) => airport.stationCode === defaultSource,
    );

    return {
      city: [
        {
          label: cityFormattedValue(sourceCity, main.fromSectionLabel),
          icon: 'icon-switch-destination',
          index: 0,
          active: true,
          city: sourceCity,
        },
        {
          label: 'Going To?',
          icon: 'icon-location',
          index: 1,
          active: false,
          value: null,
          city: undefined,
        },
      ],
      dates: [
        {
          origin: '',
          destination: '',
          minDate: new Date(),
          value: '',
          index: 1,
        },
      ],
      openPopover: false,
    };
  });

  const onChangeDate = ({ value }) => {
    setData((prev) => {
      return {
        ...prev,
        dates: [
          {
            origin: prev.city[0]?.city?.stationCode,
            destination: prev.city[1]?.city?.stationCode,
            minDate: new Date(),
            value: value.selection.startDate,
            active: true,
            index: 1,
          },
        ],
      };
    });
  };

  const onChangeCity = ({ value }) => {
    const activeIndex = data.city.findIndex((row) => row.active);

    const city = [
      {
        ...data.city[0],
        label: cityFormattedValue(
          activeIndex === 0 ? value : data.city[0].city,
          main.fromSectionLabel,
        ),
        city: activeIndex === 0 ? value : data.city[0].city,
        active: activeIndex !== 0,
      },
      {
        ...data.city[1],
        label: cityFormattedValue(
          activeIndex === 1 ? value : data.city[1].city,
          main.goingToLabel,
        ),
        city: activeIndex === 1 ? value : data.city[1].city,
        active: activeIndex !== 1,
      },
    ];

    setData((prev) => {
      return {
        ...prev,
        city,
        dates: [
          {
            origin: city[0]?.city?.stationCode,
            destination: city[1]?.city?.stationCode,
            minDate: new Date(),
            value: '',
            active: true,
            index: 1,
          },
        ],
      };
    });

    const allCityNotFilled = city.find((_city) => !_city.city);

    if (!allCityNotFilled) {
      setTimeout(() => {
        setShowDatePicker(true);
      }, 200);
    }
  };

  useEffect(() => {
    const ifDateFilled = data.dates[0].value;

    if (ifDateFilled) {
      document.dispatchEvent(
        new CustomEvent(customEvent.SHOW_FULL_BOOKING_WIDGET_FORM, {
          detail: {
            origin: data.city[0].city,
            destination: data.city[1].city,
            date: data.dates[0].value,
          },
        }),
      );
    }
  }, [data]);

  const onChangePillIndex = (value) => {
    setData((prev) => ({
      ...prev,
      city: [
        { ...prev.city[0], active: value === 0 },
        { ...prev.city[1], active: value === 1 },
      ],
    }));
  };

  const onClickFrom = () => {
    window.scrollTo(0, 150);
    setData((prev) => ({
      ...prev,
      city: [
        { ...prev.city[0], active: true },
        { ...prev.city[1], active: false },
      ],
      openPopover: true,
    }));
  };

  const onClickWhereTo = () => {
    if (!(isMobile && document.querySelector('.dynamiccontainer.bw-stop-scrolling-mweb'))) {
      window.scrollTo(0, 150);
    }
    setData((prev) => ({
      ...prev,
      city: [
        { ...prev.city[0], active: false },
        { ...prev.city[1], active: true },
      ],
      openPopover: true,
    }));
  };

  const onClose = () => {
    setData((prev) => ({ ...prev, openPopover: false }));
    setShowDatePicker(false);
  };

  return (
    <FormContextProvider context={context}>
      <Popover
        disableonClick
        openPopover={data.openPopover}
        onClose={onClose}
        renderElement={() => {
          return (
            <div className="booking-mobile-temp-form">
              <div className="booking-mobile-temp-form-location">
                <Icon className="icon-location text-primary-main" size="lg" />
                <div>
                  {`${main?.fromSectionLabel} `}
                  <span
                    className="text-primary-main"
                    onClick={onClickFrom}
                    role="presentation"
                  >
                    {data?.city[0].city?.shortName}
                  </span>
                </div>
              </div>
              <div
                className="booking-mobile-temp-form-where"
                role="presentation"
                onClick={onClickWhereTo}
              >
                <div className="booking-mobile-temp-form-where-left">
                  <Text mobileVariation="body-large-medium text-primary-main">
                    {main?.whereToLabel}
                  </Text>
                  <Text mobileVariation="body-small-regular">
                    {main?.searchByAppLabel}
                  </Text>
                </div>
              </div>
            </div>
          );
        }}
        renderPopover={() => {
          return (
            <Suspense>
              {showDatePicker ? (
                <DateSelectorPopover
                  months={1}
                  color="#AFE4FF"
                  legs={data.dates}
                  onChangeDate={onChangeDate}
                  minDate={new Date()}
                  sourceCity={data.city[0].city}
                  destinationCity={data.city[1].city}
                  ranges={[
                    {
                      startDate: new Date(),
                      endDate: new Date(),
                      key: 'selection',
                    },
                  ]}
                  maxDate={getMaxDateForCalendar()}
                />
              ) : (
                <CitySelectionPopover
                  legs={data.city}
                  onChangeCity={onChangeCity}
                  onChangePillIndex={onChangePillIndex}
                />
              )}
            </Suspense>
          );
        }}
        containerClass="search-widget-form-body__to"
      />
    </FormContextProvider>
  );
};

TempForm.propTypes = {
  context: PropTypes.any,
  value: PropTypes.shape({
    airportName: PropTypes.any,
    fullName: PropTypes.any,
    stationCode: PropTypes.any,
    toLowerCase: PropTypes.func,
  }),
};

export default TempForm;
