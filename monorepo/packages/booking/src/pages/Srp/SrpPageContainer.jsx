import React, { useContext, useMemo } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import format from 'date-fns/format';
import {
  TripTypes,
  Pages,
} from 'skyplus-design-system-app/dist/des-system/globalConstants';
import classNames from 'classnames';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { useCustomEventListener } from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import HeaderOffcanvas from './HeaderOffcanvas';
import useAppContext from '../../hooks/useAppContext';
import { customEvents, dateFormats, localStorageKeys } from '../../constants';
import { bookingActions } from '../../context/reducer';
import {
  FormContext,
  FormContextProvider,
} from '../../components/Form/FormContext';
import ModificationModel from '../../models/ModificationModel';
import { getPaxCount } from '../../utils';
import { formActions } from '../../components/Form/formReducer';
import LocalStorage from '../../utils/LocalStorage';

const SRPPage = () => {
  const {
    state: { additional, showFullFormInSrp, pageType },
    dispatch,
  } = useAppContext();

  const { formState, dispatch: dispatchForm } = useContext(FormContext);

  const onClickEdit = () => {
    dispatchForm({
      type: formActions.SET_TEMP_FORM_STATE,
    });

    dispatch({
      type: bookingActions.SHOW_FULL_FORM_IN_SRP,
      payload: true,
    });
  };
  useCustomEventListener(customEvents.MODIFY_BOOKING, onClickEdit);
  const onClose = () => {
    dispatch({
      type: bookingActions.SHOW_FULL_FORM_IN_SRP,
      payload: false,
    });

    dispatchForm({
      type: formActions.RESET_FORM_STATE,
    });
  };

  const context = useMemo(() => {
    const journeyCities = [];
    const dateInfo = [];

    const { journies, triptype, paxInfo } = formState;
    const { ADT, CHD, SRCT } = paxInfo;

    if (journies.length > 0) {
      const { sourceCity, destinationCity } = journies[0];
      if (sourceCity && destinationCity) {
        journeyCities.push(journies[0].sourceCity?.shortName);
        journeyCities.push(
          journies[journies.length - 1].destinationCity?.shortName,
        );

        dateInfo.push(format(journies[0].departureDate, dateFormats.doMMM));
        if (triptype.value === TripTypes.ROUND) {
          const { arrivalDate } = journies[0];
          if (arrivalDate) {
            dateInfo.push(format(journies[0].arrivalDate, dateFormats.doMMM));
          }
        }

        if (triptype.value === TripTypes.MULTI_CITY) {
          dateInfo.push(
            format(
              journies[journies.length - 1].departureDate,
              dateFormats.doMMM,
            ),
          );
        }
      }
    }
    if (pageType === Pages.XPLORE) {
      return {
        journeyCities: journeyCities[0],
        dateInfo: dateInfo.join('-'),
        count: getPaxCount(ADT) + getPaxCount(CHD) + getPaxCount(SRCT),
      };
    }

    return {
      journeyCities: journeyCities.join('<u></u>'),
      dateInfo: dateInfo.join('-'),
      count: getPaxCount(ADT) + getPaxCount(CHD) + getPaxCount(SRCT),
    };
  }, [formState]);

  const withDisabledClass = classNames({
    disabled: pageType === Pages.FLIGHT_SELECT_MODIFICATION,
    'booking-header-widget__box': true,
  });

  return (
    <div className="booking-header-widget">
      <HtmlBlock
        className={`${withDisabledClass} city`}
        html={context.journeyCities}
      />
      <div className="booking-header-widget__box">{context.dateInfo}</div>
      <div className="booking-header-widget__box">
        {context.count}{' '}
        {context.count > 1 ? additional.passengersLabel : additional.paxLabel}
      </div>
      <Icon
        className="booking-header-widget__box text-primary-main icon-edit"
        onClick={onClickEdit}
        tabIndex={0}
        role="button"
        aria-label="Modify Flight"
      />
      {showFullFormInSrp && (
        <HeaderOffcanvas onClose={onClose} context={context} />
      )}
    </div>
  );
};

const SRPPageContainer = () => {
  const {
    state: { widgetsModel, pageType, airportsData, activeCurrencyModel },
  } = useAppContext();

  const context = useMemo(() => {
    const modificationContext = LocalStorage.getAsJson(
      localStorageKeys.c_m_d,
      {},
    );

    const fareCodeData = modificationContext?.codes?.promotionCode;

    const data = widgetsModel?.specialFareList?.filter(
      (item) => item.specialFareCode === fareCodeData,
    );

    return new ModificationModel({
      pageType,
      airportsData,
      activeCurrencyModel,
      tripTypes: widgetsModel.allTriptypes,
      specialFares: widgetsModel.specialFareList,
      startDate: data?.[0]?.bookingAllowedAfterDays || 0,
    });
  }, []);

  return (
    <FormContextProvider
      context={{
        payload: {
          ...context.payload,
          specialFares: widgetsModel.specialFareList,
        },
      }}
    >
      <SRPPage />
    </FormContextProvider>
  );
};

export default SRPPageContainer;
