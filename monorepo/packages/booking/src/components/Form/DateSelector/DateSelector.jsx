import PropTypes from 'prop-types';
import React, {
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import parse from 'html-react-parser';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import format from 'date-fns/format';
import { TripTypes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';
import { delay } from 'skyplus-design-system-app/dist/des-system/utils';

import { Pages } from 'skyplus-design-system-app/src/functions/globalConstants';
import Popover from '../../common/Popover/Popover';
import FormField from '../FormField';
import DateSelectorPopover from '../../common/DateSelectorPopover';
import { FormContext } from '../FormContext';
import { triggerClosePopup } from '../../../utils';
import DateSelectorShimmer from './DateSelectorShimmer';
import useAppContext from '../../../hooks/useAppContext';
import DateSelectorXplore from '../../common/DateSelectorXplore';

const DateSelector = ({
  containerClass,
  topLabel,
  middleLabel,
  hintLabel,
  onSelect,
  formKey,
  index,
  value,
  calendarProps = {},
  sourceCity,
  destinationCity,
  openDatePopover,
  handleDateOpenPopover,
}) => {
  const {
    formState: { triptype, journies, payWith },
  } = useContext(FormContext);

  const {
    state: { additional, main, pageType },
  } = useAppContext();

  const { MULTI_CITY } = TripTypes;

  const [isMobile] = useIsMobileBooking();

  const [legs, setLegs] = useState([]);

  const [openDate, setOpenDate] = useState();

  const { XPLORE } = Pages;

  const onChange = async (item) => {
    let dateValue = '';

    dateValue = item?.value?.selection?.startDate;

    const selectedLegIndex = legs?.findIndex((i) => i?.active === true);
    const selectedLeg = legs[selectedLegIndex];
    onSelect(formKey, index, dateValue);

    if (isMobile && legs.length === 2) {
      await delay(0.5);
      const { value: v } = selectedLeg;

      if (selectedLegIndex === 0 && !v) {
        setLegs((prev) => {
          return [
            { ...prev[0], active: false },
            { ...prev[1], active: true, minDate: item.value },
          ];
        });
        handleDateOpenPopover?.(true, formKey);
      } else if (selectedLegIndex === 1 && !v) {
        setLegs((prev) => {
          return [
            { ...prev[0], active: false, maxDate: item.value },
            { ...prev[1], active: false },
          ];
        });
        triggerClosePopup();
      } else if (selectedLegIndex === 0) {
        setLegs((prev) => {
          return [
            { ...prev[0], active: false },
            { ...prev[1], active: true },
          ];
        });
        handleDateOpenPopover?.(true, formKey);
      } else if (selectedLegIndex === 1) {
        setLegs((prev) => {
          return [
            { ...prev[0], active: false },
            { ...prev[1], active: false },
          ];
        });
        triggerClosePopup();
      }
    } else {
      triggerClosePopup();
    }
  };

  const updateLegState = () => {
    const legItems = [];

    const { departureDate, minDate, arrivalDate } = journies[index];

    if (destinationCity || sourceCity) {
      if (triptype?.value === TripTypes.ROUND) {
        legItems.push({
          origin: sourceCity?.stationCode,
          destination: destinationCity?.stationCode,
          active: formKey === 'departureDate',
          index: 0,
          minDate: minDate || departureDate,
          ...arrivalDate, // && { maxDate: arrivalDate }
          value: departureDate,
        });

        legItems.push({
          origin: destinationCity?.stationCode,
          destination: sourceCity?.stationCode,
          active: formKey === 'arrivalDate',
          index: 1,
          minDate: departureDate || minDate,
          value: arrivalDate,
        });
      } else {
        legItems.push({
          origin: sourceCity?.stationCode,
          destination: destinationCity?.stationCode,
          active: true,
          index: 0,
          minDate: minDate || departureDate,
          value: departureDate,
        });
      }
    }
    setLegs(legItems);
  };

  useEffect(() => {
    if (index < 0) {
      return;
    }
    updateLegState();
    setOpenDate(!!openDatePopover);
  }, [triptype, index, journies, openDatePopover]);

  const getTheClickHandler = async (i) => {
    if (calendarProps) {
      const { ranges } = calendarProps;
      ranges[0].startDate = legs[i].value;
      ranges[0].endDate = legs[i].value;
    }

    // First update legs state
    await new Promise((resolve) => {
      setLegs((prev) => {
        resolve();
        return [
          ...prev.slice(0, i).map((r) => ({ ...r, active: false })),
          {
            ...prev[i],
            active: true,
          },
          ...prev.slice(i + 1).map((r) => ({ ...r, active: false })),
        ];
      });
    });

    // Then update date popover state
    if (i) {
      handleDateOpenPopover?.(false, 'departureDate', true);
      await delay(0.1); // Small delay to ensure state updates are processed
      handleDateOpenPopover?.(true, 'arrivalDate', true);
    } else {
      handleDateOpenPopover?.(false, 'arrivalDate', true);
      await delay(0.1); // Small delay to ensure state updates are processed
      handleDateOpenPopover?.(true, 'departureDate', true);
    }
  };

  const onClickPillHandler = (i) => {
    if (isMobile) {
      getTheClickHandler(i);
    }
  };

  const formFieldProps = useMemo(() => {
    return {
      topLabel,
      middleLabel: value ? format(value, 'd MMM') : middleLabel,
      hintLabel: value ? format(value, 'EEEE') : hintLabel,
      filled: Boolean(value),
    };
  }, [value, middleLabel, hintLabel]);

  const returnOfferDescription = () => {
    if (
      additional?.returnOfferDescriptionLabel?.html &&
      triptype.value !== MULTI_CITY
    ) {
      return (
        <div id="roundTripMessage">
          {parse(additional?.returnOfferDescriptionLabel?.html || '')}
        </div>
      );
    }
    return null;
  };

  const renderElementField = () => {
    const children = (
      <FormField
        containerClass="notsearchable"
        {...formFieldProps}
        accessiblityProps={{
          'aria-label': formKey,
        }}
      />
    );
    if (
      containerClass?.split(' ')?.includes('search-widget-form-body__return')
    ) {
      return <div className="animate-border">{children}</div>;
    }
    return children;
  };

  return (
    <Popover
      openPopover={openDate}
      renderElement={() => {
        return renderElementField();
      }}
      renderPopover={() => {
        return pageType === XPLORE && formKey === 'departureDate' ? (
          <div className="city-selection">
            <div className="date-label">
              <span className="label_hint">{main.dateLabel}</span>
            </div>
            <DateSelectorXplore onChangeDate={onChange} />
          </div>
        ) : (
          <Suspense fallback={<DateSelectorShimmer />}>
            <DateSelectorPopover
              onChangeDate={onChange}
              {...calendarProps}
              legs={legs}
              onClickPillHandler={onClickPillHandler}
              formKey={formKey}
              sourceCity={sourceCity}
              destinationCity={destinationCity}
              payWith={payWith}
              returnOfferDescriptionLabel={returnOfferDescription()}
            />
          </Suspense>
        );
      }}
      containerClass={containerClass}
    />
  );
};

DateSelector.propTypes = {
  calendarProps: PropTypes.object,
  containerClass: PropTypes.string,
  formKey: PropTypes.string,
  hintLabel: PropTypes.string,
  index: PropTypes.number,
  middleLabel: PropTypes.string,
  minDate: PropTypes.any,
  onSelect: PropTypes.func,
  topLabel: PropTypes.string,
  value: PropTypes.any,
  sourceCity: PropTypes.any,
  destinationCity: PropTypes.any,
  isForXplorePage: PropTypes.any,
  payWith: PropTypes.any,
  handleDateOpenPopover: PropTypes.func,
  openDatePopover: PropTypes.any,
};

export default DateSelector;
