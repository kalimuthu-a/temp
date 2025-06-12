import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import classnames from 'classnames';

import useAppContext from '../../../hooks/useAppContext';
import { URLS } from '../../../constants';
import CargoCitySelector from './CargoCitySelector/CargoCitySelector';
import CargoDateSelector from './CargoDateSelector/CargoDateSelector';
import QuantitySelector from './CargoQuantitySelector/QuantitySelector';
import GoodsTypeSelector from './CargoGoodsTypeSelector/GoodsTypeSelector';
import { useCargo } from '../CargoContext';
import { cargoFormActions } from '../CargoReducer';

const CargoJourneyRow = ({
  sourceCity,
  destinationCity,
  departureDate,
  minDate,
  maxDate,
}) => {
  const id = 0;

  const {
    state: { main, additional, isModificationFlow },
  } = useAppContext();

  const {
    dispatch,
  } = useCargo();

  const onClickRemove = () => {
    // if (isModificationFlow) {
    //   return;
    // }
    // const nextRow = journies[id + 1];
    // const prevRow = journies[id - 1];
    // if (nextRow && prevRow) {
    //   nextRow.minDate = prevRow.departureDate;
    // }

    // const newJournies = [
    //   ...journies.slice(0, id),
    //   nextRow,
    //   ...journies.slice(id + 2),
    // ].filter((r) => Boolean(r));

    // const { isInternational } = specialFareListForContext([], newJournies, '');

    // dispatch({
    //   type: formActions.REMOVE_JORNEY_ITEM,
    //   payload: {
    //     identicalDestinationsErrorMessage:
    //       additional.identicalDestinationsErrorMessage,
    //     journies: newJournies,
    //     isInternational,
    //   },
    // });
  };

  const switchJourney = () => {
    // dispatch({
    //   type: formActions.CHANGE_JOURNEY_ROW_ITEM,
    //   payload: {
    //     index: id,
    //     objData: { sourceCity: destinationCity, destinationCity: sourceCity },
    //     identicalDestinationsErrorMessage:
    //       additional.identicalDestinationsErrorMessage,
    //   },
    // });
  };

  const onChangeJourneyElement = async (key, index, value) => {
    dispatch({
      type: cargoFormActions.CHANGE_JOURNEY_ROW_ITEM,
      payload: {
        index,
        objData: { [key]: value },
      },
    });

    // if (key === 'destinationCity') {
    //   const payloadForFareCalendar = {
    //     startDate: format(departureDate, dateFormats.yyyyMMdd),
    //     endDate: format(addDays(departureDate, 62), dateFormats.yyyyMMdd),
    //     origin: sourceCity?.stationCode,
    //     destination: value?.stationCode,
    //     currencyCode: currency.currencyCode,
    //     promoCode: promocode?.indigoCode || promocode?.card,
    //     lowestIn: 'M',
    //   };

    //   await fetchFareCalendar(payloadForFareCalendar);
    // }
  };

  return (
    <div
      className="journey-row"
    >
      <div className="panel-header">
        {`${additional.flightLabel} ${id + 1}`}
        {id !== 0 && (
          <Icon
            className="icon-close-circle"
            size="lg"
            onClick={onClickRemove}
          />
        )}
      </div>
      <div className="search-widget-form-body" key={id}>
        <CargoCitySelector
          containerClass={`search-widget-form-body__from d-flex align-items-center justify-content-between ${
            isModificationFlow ? 'disabled' : ''
          }`}
          topLabel={main.fromSectionLabel}
          middleLabel={main.flyingFromLabel}
          hintLabel={main.searchByLabel}
          geoLocationOption
          onSelect={onChangeJourneyElement}
          formKey="sourceCity"
          index={id}
          cityToExclude={[destinationCity]}
          enabledSwitchJourney={Boolean(sourceCity) && Boolean(destinationCity)}
          switchJourney={switchJourney}
        />
        <CargoCitySelector
          containerClass={`search-widget-form-body__to ${
            isModificationFlow ? 'disabled' : ''
          }`}
          topLabel={main.toSectionLabel}
          middleLabel={main.goingToLabel}
          hintLabel={main.searchByLabel}
          onSelect={onChangeJourneyElement}
          formKey="destinationCity"
          index={id}
          cityToExclude={[sourceCity]}
        />

        <CargoDateSelector
          containerClass={classnames({
            'search-widget-form-body__departure': true,
            'full-grid': false,
            [`layout-${URLS.displayCalenderMonths}`]: true,
          })}
          topLabel={main.departureDateLabel}
          middleLabel={main.dateLabel}
          hintLabel={main.departureSectionLabel}
          formKey="departureDate"
          index={id}
          value={departureDate}
          calendarProps={{
            date: departureDate,
            minDate,
            maxDate,
          }}
        />
        <QuantitySelector
          containerClass={classnames({
            'search-widget-form-body__quantity': true,
            'full-grid': false,
          })}
          formKey="quantity"
          index={id}
        />
        <GoodsTypeSelector
          containerClass={classnames({
            'search-widget-form-body__goods-type': true,
            'full-grid': false,
          })}
          formKey="goodsType"
          index={id}
        />
      </div>
    </div>
  );
};

CargoJourneyRow.propTypes = {
  destinationCity: PropTypes.any,
  sourceCity: PropTypes.any,
  departureDate: PropTypes.any,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
};

export default CargoJourneyRow;
