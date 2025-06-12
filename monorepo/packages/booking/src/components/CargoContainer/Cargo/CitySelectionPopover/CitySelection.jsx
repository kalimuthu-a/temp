import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';

import {
  Pages,
  a11y,
} from 'skyplus-design-system-app/src/functions/globalConstants';

import {
  getSourceStationFromGeolocation,
  searchAirportCity,
} from '../../../../utils/functions';
import { getRecentCitySearch } from '../../../../utils/localStorageUtils';
import SwitchLegPill from './SwitchLegPill';
import NoAirportFound from './NoAirportFound';
import CityItem from './CityItem';
import useAppContext from '../../../../hooks/useAppContext';
import searchImage from '../../../../assets/images/search.svg';

const CitySelection = ({
  legs = [],
  onChangeCity,
  outsideSearch = '',
  cityToExclude = [],
  geoLocationOption,
  onChangePillIndex,
  formKey,
}) => {
  const {
    state: { finalCityList: airportsData, additional, main, pageType, popSearch },
  } = useAppContext();
  const { XPLORE } = Pages;
  let updatedLeg = [...legs];

  if (pageType === XPLORE) {
    updatedLeg = legs.filter((pill) => pill.icon !== 'icon-location');
  }

  const [data, setData] = useState({
    airports: [],
    value: '',
    popListZero: [],
    popListOne: [],
    popularDestination: [],
    currentCountryCode: '',
    isTyping: false,
  });

  const citySelectionRef = useRef();

  const [isMobile] = useIsMobileBooking();

  const getCurrentPositionCallback = (e) => {
    const nearestCity = getSourceStationFromGeolocation(e, airportsData);
    const key = 'origin';
    onChangeCity({
      selectedIndex: data.activeIndex,
      value: nearestCity,
      geoLocation: true,
    });
    setData((prev) => ({
      ...prev,
      [key]: nearestCity.countryCode,
      currentCountryCode: nearestCity.countryCode,
      isTyping: false,
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCurrentPositionCallback);
    }
  };

  const onKeyUpGeoLocation = (e) => {
    if (e.keyCode === a11y.keyCode.enter) {
      getCurrentLocation();
    }
  };

  const onClickCityItem = (item) => {
    setData((prev) => ({ ...prev, value: '', isTyping: false }));
    onChangeCity({ value: item });
  };
  const onSearch = (e) => {
    citySelectionRef?.current?.scrollTo({ top: 0, behavior: 'instant' });
    const { value, isTyping } = e.target;
    const citiesToExcludeWhileSearch = [];

    const otherPillIndex = legs.find((row) => !row.active);

    if (otherPillIndex && otherPillIndex.city) {
      citiesToExcludeWhileSearch.push(otherPillIndex.city.stationCode);
    }

    cityToExclude.forEach((row) => {
      if (row) {
        citiesToExcludeWhileSearch.push(row.stationCode);
      }
    });

    const airportsListToSearch = airportsData.filter((row) => {
      return !(citiesToExcludeWhileSearch.includes(row.stationCode));
    });

    const popListZero = popSearch?.[0]?.filter((row) => {
      return !(citiesToExcludeWhileSearch?.includes(row?.stationCode));
    });
    const popListOne = popSearch?.[1]?.filter((row) => {
      return !(citiesToExcludeWhileSearch?.includes(row?.stationCode));
    });

    const { filteredList, popularDestination } = searchAirportCity(
      value,
      airportsListToSearch,
      additional,
      data.origin,
      data.currentCountryCode,
    );
    const airportByStationCodeIndex = filteredList.findIndex(
      (a) => a.stationCode.toLowerCase() === value.toLowerCase(),
    );

    let airports = filteredList;

    if (airportByStationCodeIndex >= 0) {
      airports = [
        filteredList[airportByStationCodeIndex],
        ...filteredList.slice(0, airportByStationCodeIndex),
        ...filteredList.slice(airportByStationCodeIndex + 1),
      ];
    }
    setData((prev) => ({
      ...prev,
      airports,
      value,
      popListZero,
      popListOne,
      popularDestination,
      isTyping,
    }));
  };

  useEffect(() => {
    onSearch({ target: { value: '', isTyping: false } });
  }, [legs]);

  const onChangePill = (index) => {
    onChangePillIndex(index);
  };

  const recentSearches = useMemo(() => {
    const citiesToExcludeWhileSearch = [];

    const otherPillIndex = legs.find((row) => !row.active);

    if (otherPillIndex && otherPillIndex.city) {
      citiesToExcludeWhileSearch.push(otherPillIndex.city.stationCode);
    }

    cityToExclude.forEach((row) => {
      if (row) {
        citiesToExcludeWhileSearch.push(row.stationCode);
      }
    });

    let localKey =
      formKey === 'destinationCity'
        ? 'selectedDestinationCityInfo'
        : 'selectedSourceCityInfo';

    if (isMobile) {
      localKey =
        otherPillIndex.index === 0
          ? 'selectedDestinationCityInfo'
          : 'selectedSourceCityInfo';
    }

    const searches = getRecentCitySearch(localKey);

    return searches.filter((row) => {
      return !(citiesToExcludeWhileSearch.includes(row.stationCode));
    });
  });

  const showRecentSearchCondition = recentSearches.length > 0;
  useEffect(() => {
    if (!isMobile) {
      onSearch({
        target: { ...outsideSearch },
      });
    } else {
      onSearch({ target: { value: '' } });
    }
  }, [outsideSearch]);

  const activePillIndex = updatedLeg.findIndex((row) => row.active);
  return (
    <div className="city-selection" ref={citySelectionRef}>
      <div className="city-selection-header">
        <Heading heading="h5 text-center pt-8 pb-4">
          {activePillIndex === 0
            ? additional.flyingFromAppLabel
            : additional.goingToAppLabel}
        </Heading>
        <div className="city-selection-header-pill rounded-4">
          {updatedLeg.map((pill) => (
            <SwitchLegPill
              {...pill}
              key={pill.index}
              onClick={onChangePill}
              active={pill.active}
              pageType={pageType}
            />
          ))}
        </div>
        <div className="skyplus-dropdown-list__searchbox mx-4">
          <div
            className={`search-inputbox d-flex gap-4 ${
              data.value ? 'focused' : ''
            }`}
          >
            <img src={searchImage} alt="Search" width="24px" height="24px" />
            <input
              placeholder="Search"
              value={data.value}
              onChange={onSearch}
              maxLength={20}
              role="searchbox"
            />
          </div>
        </div>
        {geoLocationOption && activePillIndex === 0 && !data.isTyping && (
          <div
            className={`city-selection__get-current-location ${
              geoLocationOption && Boolean(!data.isTyping)
                ? 'withDottedBorder'
                : ''
            }`}
            onClick={getCurrentLocation}
            onKeyUp={onKeyUpGeoLocation}
            tabIndex={0}
            role="button"
          >
            <Icon
              className="icon-location text-primary-main body-medium-medium"
              size="sm"
            />
            <Text
              mobileVariation="link"
              containerClass="text-primary-main"
              variation="link-small"
            >
              {additional.useCurrentLocationLabel}
            </Text>
          </div>
        )}
      </div>
      <div className="city-selection__list mt-6">
        {data.value && data.airports.length === 0 ? (
          <NoAirportFound
            label={formattedMessage(additional.noAirportsFoundLabel, {
              city: data.value,
            })}
          />
        ) : (
          <>
            {data.value && data.airports.length > 0 && (
              <Heading
                mobileHeading="h0 px-10 text-uppercase text-text-tertiary"
                heading="d-none"
              />
            )}

            {data?.airports?.map((row, index) => (
              <CityItem
                {...row}
                key={`${row?.longitude}-${row?.stationCode}`}
                onChange={onClickCityItem}
                dataIndex={index}
                triptype={null}
                formKey={formKey}
                nationalityDeclarationLabel={
                  additional?.nationalityDeclarationLabel
                }
              />
            ))}
            {showRecentSearchCondition &&
              recentSearches?.map((recent, index) => (
                <CityItem
                  {...recent}
                  key={recent?.stationCode}
                  onChange={onClickCityItem}
                  dataIndex={index}
                  dataGroup={index === 0 ? main.recentSearchLabel : ''}
                  triptype={null}
                  formKey={formKey}
                  nationalityDeclarationLabel={
                    additional?.nationalityDeclarationLabel
                  }
                />
              ))}
            {(activePillIndex === 0 && !data?.isTyping) &&
                data?.popListZero
                  ?.map((row, index) => (
                   row && (
                   <CityItem
                     {...row}
                     key={`${row?.longitude}-${row?.stationCode}`}
                     onChange={onClickCityItem}
                     dataIndex={index}
                     dataGroup={index === 0 ? 'Popular Destination' : ''}
                     triptype={null}
                     formKey={formKey}
                     nationalityDeclarationLabel={
                        additional?.nationalityDeclarationLabel
                      }
                   />
                 )
            ))}
            {(activePillIndex === 1 && !data?.isTyping) &&
                data?.popListOne
                  ?.map((row, index) => (
                   row && (
                   <CityItem
                     {...row}
                     key={`${row?.longitude}-${row?.stationCode}`}
                     onChange={onClickCityItem}
                     dataIndex={index}
                     dataGroup={index === 0 ? 'Popular Destination' : ''}
                     triptype={null}
                     formKey={formKey}
                     nationalityDeclarationLabel={
                        additional?.nationalityDeclarationLabel
                      }
                   />
                 )
            ))}
            {data?.popularDestination?.map((row, index) => (
              <CityItem
                {...row}
                key={`${row?.longitude}-${row?.stationCode}`}
                onChange={onClickCityItem}
                dataIndex={index}
                dataGroup={index === 0 ? 'All Cities' : ''}
                triptype={null}
                formKey={formKey}
                nationalityDeclarationLabel={
                              additional?.nationalityDeclarationLabel
                            }
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

CitySelection.propTypes = {
  legs: PropTypes.array,
  cityToExclude: PropTypes.array,
  onChangeCity: PropTypes.func,
  onChangePillIndex: PropTypes.func,
  outsideSearch: PropTypes.any,
  formKey: PropTypes.string,
  geoLocationOption: PropTypes.bool,
};

export default CitySelection;
