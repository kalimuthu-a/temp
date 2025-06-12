import React, { useEffect } from 'react';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import useAppContext from '../../../hooks/useAppContext';
import { useCargo } from '../CargoContext';
import CargoBottom from '../CargoBottom';
import CargoCurrencySelector from './CargoCurrencySelector';
import { cargoFormActions } from '../CargoReducer';
import CargoJourneyRow from './CargoJourneyRow';
import { bookingActions } from '../../../context/reducer';
import { CARGO_CONSTANTS } from '../../../constants';

const CargoHome = () => {
  const {
    state: {
      activeCurrencyModel,
      main,
      airportsData,
    },
    dispatch: appDispatch,
  } = useAppContext();

  const { state, dispatch } = useCargo();
  const { journeys } = state;

  const tripTypesItems = main?.journeyType?.map((item) => ({
    journeyTypeCode: item?.journeyTypeLabel,
    journeyTypeLabel: item?.journeyTypeLabel,
    value: item?.journeyTypeCode,
    label: item?.journeyTypeLabel,
  }));

  const onChange = (value) => {
    const item = main?.journeyType.find((row) => row.journeyTypeCode === value);
    dispatch({ type: cargoFormActions.CHANGE_TRIP_TYPE, payload: item });
    const finalCityList = airportsData?.filter(
      (row) => row?.isInternational === (value === CARGO_CONSTANTS.INTERNATIONAL),
    );
    appDispatch({ type: bookingActions.SET_FINAL_CITY_LIST, payload: [...finalCityList] });
  };

  useEffect(() => {
    const finalCityList = airportsData?.filter((row) => row?.isInternational === false);
    appDispatch({ type: bookingActions.SET_FINAL_CITY_LIST, payload: [...finalCityList] });
  }, []);

  return (
    <div
      className="search-widget-form"
    >
      <div className="search-widget-form-top">
        <RadioBoxGroup
          items={tripTypesItems}
          onChange={onChange}
          selectedValue={state?.triptype?.value}
          name="triptype"
        />
      </div>
      <CargoJourneyRow {...journeys} />
      <div className="nationality-currency-picker">
        <CargoCurrencySelector items={activeCurrencyModel} />
      </div>

      <div className="search-widget-form-bottom">
        <CargoBottom />
      </div>
    </div>
  );
};

CargoHome.propTypes = {
};

export default CargoHome;
