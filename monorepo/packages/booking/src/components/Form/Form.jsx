import React, { useContext, useMemo } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import {
  TripTypes,
  Pages,
} from 'skyplus-design-system-app/dist/des-system/globalConstants';
import last from 'lodash/last';
import { a11y } from 'skyplus-design-system-app/src/functions/globalConstants';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import Bottom from '../Bottom/Bottom';
import NationalityPicker from '../NationalityPicker/NationalityPicker';
import CurrencySelector from './CurrencySelector/CurrencySelector';
import JourneyRow from './JourneyRow';
import PaxFareSelection from './PaxFareSelection/PaxFareSelection';
import useAppContext from '../../hooks/useAppContext';
import TripTypeRadioGroup from './TripTypeRadioGroup';
import { FormContext } from './FormContext';
import { formActions } from './formReducer';
import { getMaxDateForCalendar } from '../../utils';

const Form = () => {
  const {
    state: {
      activeCountryModel,
      activeCurrencyModel,
      widgetsModel,
      additional,
      isModificationFlow,
      pageType,
    },
  } = useAppContext();

  const { formState, dispatch } = useContext(FormContext);

  const { toast } = formState;

  const [isMobile] = useIsMobileBooking();

  const onClickAdd = () => {
    const { journies } = formState;
    if (journies.length < widgetsModel.multiCitiesCount) {
      const lastJourney = last(journies);

      dispatch({
        type: formActions.CHANGE_FORM_ITEM,
        payload: {
          journies: journies.concat({
            destinationCity: null,
            sourceCity: lastJourney?.destinationCity,
            isNationalityPopup: false,
            departureDate: lastJourney.departureDate,
            minDate: lastJourney.departureDate || new Date(),
            arrivalDate: null,
            key: uniq(),
            maxDate: getMaxDateForCalendar(),
          }),
          identicalDestinationsErrorMessage:
            additional.identicalDestinationsErrorMessage,
        },
      });
    }
  };

  const onClickKeyUpAddFlightButton = (e) => {
    if (e.keyCode === a11y.keyCode.enter) {
      onClickAdd();
    }
  };

  const showNationalityDropdown = useMemo(() => {
    const { journies, triptype } = formState;
    return journies.some((row) => {
      const { sourceCity, destinationCity } = row;

      return (
        sourceCity?.isNationalityPopup ||
        (triptype.value === TripTypes.ROUND &&
          destinationCity?.isNationalityPopup)
      );
    });
  }, [formState.journies, formState.triptype]);

  return (
    <div
      className="search-widget-form"
    >
      <div className="search-widget-form-top">
        <TripTypeRadioGroup />
      </div>
      {formState.journies.map((journey, id) => {
        return (<JourneyRow key={journey.key} {...journey} id={id} />
        );
      })}

      {formState.triptype.value === TripTypes.MULTI_CITY &&
        !isModificationFlow && (
          <div
            className={`add-flight ${formState.journies.length >= widgetsModel.multiCitiesCount
                ? 'disabled'
                : ''
              }`}
            onClick={onClickAdd}
            role="button"
            tabIndex="0"
            onKeyDown={onClickKeyUpAddFlightButton}
          >
            <Icon className="icon-add-circle" />
            <span>{additional.addFlightLabel}</span>
          </div>
        )}

      {formState.journies.length >= widgetsModel.multiCitiesCount && (
        <Text variation="body-small-regular error mb-4">
          {additional.multicityMaxCountError}
        </Text>
      )}

      {isMobile && (
        <div className="search-widget-form-body-pax">
          <PaxFareSelection />
        </div>
      )}

      <div className="nationality-currency-picker">
        {showNationalityDropdown && !isModificationFlow && (
          <NationalityPicker items={activeCountryModel} />
        )}
        {![Pages.XPLORE, Pages.FLIGHT_SELECT_MODIFICATION].includes(
          pageType,
        ) && <CurrencySelector items={activeCurrencyModel} />}
      </div>

      <div className="search-widget-form-bottom">
        <Bottom />
      </div>

      {toast.show && (
        <Toast
          infoIconClass="icon-info"
          variation={`notifi-variation--${toast.variation}`}
          description={toast.description}
          containerClass="toast-example"
          autoDismissTimeer={5000}
          onClose={() => {
            dispatch({
              type: formActions.SET_TOAST,
              payload: { show: false, description: '' },
            });
          }}
        />
      )}
    </div>
  );
};

Form.propTypes = {
};

export default Form;
