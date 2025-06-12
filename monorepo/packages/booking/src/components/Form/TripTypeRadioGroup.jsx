import React, { useContext, useMemo } from 'react';
import { PayWithModes, Pages } from 'skyplus-design-system-app/src/functions/globalConstants';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import classNames from 'classnames';

import { FormContext } from './FormContext';
import { formActions } from './formReducer';
import useAppContext from '../../hooks/useAppContext';
import { screenLiveAnnouncer } from '../../utils/a11y';

const { XPLORE } = Pages;

const TripTypeRadioGroup = () => {
  const {
    formState: { triptype, selectedSpecialFare },
    dispatch,
  } = useContext(FormContext);

  const {
    state: { widgetsModel, isModificationFlow, pageType },
  } = useAppContext();

  const tripTypesItems = useMemo(() => {
    let { journeysAllowed } = widgetsModel;
    if (pageType === XPLORE) {
      journeysAllowed = journeysAllowed.filter((item) => item !== 'MultiCity');
    }

    if (selectedSpecialFare) {
      journeysAllowed = selectedSpecialFare.journeyTypesAllowed;
    }

    return widgetsModel.getTripTypes(journeysAllowed);
  }, [selectedSpecialFare]);

  const onChange = (value) => {
    const item = tripTypesItems.find((row) => row.value === value);
    dispatch({ type: formActions.CHANGE_TRIP_TYPE, payload: item });
    dispatch({
      type: formActions.CHANGE_FORM_ITEM,
      payload: { payWith: PayWithModes.CASH },
    });
    screenLiveAnnouncer(`You have selected ${item.label} trip type`);
  };

  const containerClassName = classNames('select-triptype-container', {
    disabled: isModificationFlow,
  });

  return (
    <RadioBoxGroup
      items={tripTypesItems}
      onChange={onChange}
      selectedValue={triptype.value}
      containerClassName={containerClassName}
      name="triptype"
    />
  );
};

TripTypeRadioGroup.propTypes = {};

export default TripTypeRadioGroup;
