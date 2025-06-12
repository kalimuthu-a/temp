import React, { useContext, useEffect, useState } from 'react';
import InputField from 'skyplus-design-system-app/src/components/InputField/InputField';
import PropTypes from 'prop-types';
import Heading from '../../../common/HeadingComponent/Heading';
import { AppContext, passengerEditActions } from '../../../context/appContext';
import { gstContextKeys } from '../../../context/contextKeys';
import regexConstant from '../../../constants/regex';
import SavedGstDetails from './SavedGstDetails/SavedGstDetails';
import './GstForm.scss';
import nextButtonStateUtil from '../../../utils/nextButtonStateUtil';
import LocalStorage from '../../../utils/LocalStorage';
import { localStorageKeys } from '../../../constants';

const GstForm = ({ disableNextButton }) => {
  const {
    state: {
      gstDetails,
      isGstComplete,
      isGstTouched,
      modificationFlow,
      nextFlagForGst,
      paxData: {
        gstContact,
      },
      aemMainData: {
        enterGstLabel,
        gstAccordionTitle,
        gstNumberLabel,
        gstNumberErrorMessage,
        gstEmailLabel,
        gstCompanyNameLabel,
        // gstSavedListLabel,
        // mandatoryFieldLabel,
        invalidMailIdLabel,
        // viewAllLabel,
      },
    },
    dispatch,
  } = useContext(AppContext);
  const [toggle, setToggle] = useState(() => {
    if (window?.adobeTarget?.gstMandatory) {
      return true;
    }
    return modificationFlow;
  });
  const [selectedSavedGst, setSelectedSavedGst] = useState();
  const { companyName, companyEmail, companyGstNum } = gstContextKeys;
  const countryDetails = LocalStorage.getAsJson(localStorageKeys?.bw_cntxt_val)?.selectedSourceCityInfo || {};
  const isGstVaidate = countryDetails?.currencyCode === 'INR';

  const gstFieldValidation = (type = '', value = '') => {
    if (value && type === 'email' && !value.match(regexConstant.EMAIL)) {
      return invalidMailIdLabel;
    }
    if (value && type === 'gstNum' && !value.match(regexConstant.GST)) {
      return gstNumberErrorMessage;
    }
    return '';
  };

  useEffect(() => {
    if (gstContact?.CustomerNumber) {
      const gstFields = {
        [companyName]: gstContact?.CompanyName,
        [companyEmail]: gstContact?.EmailAddress,
        [companyGstNum]: gstContact?.CustomerNumber,
      };

      for (const field in gstFields) {
        // eslint-disable-next-line no-prototype-builtins
        if (gstFields.hasOwnProperty(field)) {
          dispatch({
            type: passengerEditActions.SET_GST_DETAILS,
            payload: {
              key: field,
              value: gstFields[field],
              error: '',
            },
          });
        }
      }
    }
  }, [gstContact?.CustomerNumber]);

  const onChangeHandler = (e, fieldType) => {
    const { name, value } = e.target;
    dispatch({
      type: passengerEditActions.SET_GST_DETAILS,
      payload: {
        key: name,
        value,
        error: isGstVaidate ? gstFieldValidation(fieldType, value) : null,
      },
    });
  };

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    const gstValues = [
      gstDetails.companyName.value,
      gstDetails.companyEmail.value,
      gstDetails.companyGstNum.value,
    ];
    let isGstTouchedValue = gstValues.some((item) => item);
    if (window?.adobeTarget?.gstMandatory) {
      isGstTouchedValue = true;
    }

    dispatch({
      type: passengerEditActions.SET_GST_FLAGS,
      payload: {
        flag: gstContextKeys.isGstTouched,
        value: isGstTouchedValue,
      },
    });

    const errors = [
      gstDetails.companyName.error,
      gstDetails.companyEmail.error,
      gstDetails.companyGstNum.error,
    ];
    const isGstFormComplete = errors.every((item) => !item) && gstValues.every((item) => item);
    dispatch({
      type: passengerEditActions.SET_GST_FLAGS,
      payload: {
        flag: gstContextKeys.isGstComplete,
        value: isGstFormComplete,
      },
    });
  }, [gstDetails]);

  useEffect(() => {
    const shouldNextEnable = !!(isGstTouched && isGstComplete);
    dispatch({
      type: passengerEditActions.SET_GST_FLAGS,
      payload: {
        flag: gstContextKeys.nextFlagForGst,
        value: isGstTouched ? shouldNextEnable : true,
      },
    });
  }, [isGstTouched, isGstComplete]);

  useEffect(() => {
    nextButtonStateUtil(disableNextButton());
  }, [nextFlagForGst]);

  return (
    <div className="gst-form">
      <Heading headingTitle={enterGstLabel || 'Enter GST details'} headingClass="h4" />
      {!modificationFlow ? (
        <SavedGstDetails
          gstFieldValidation={gstFieldValidation}
          selectedSavedGst={selectedSavedGst}
          setSelectedSavedGst={setSelectedSavedGst}
          setToggle={setToggle}
        />
      ) : null}
      <div className="gst-form__container bg-white overflow-hidden mb-16">
        <button
          onClick={toggleHandler}
          type="button"
          className={`gst-form__accordion-title ${toggle ? 'bg-active-light' : 'bg-white'} align-items-center border-0
          d-flex justify-content-between p-6 px-md-12 py-md-8 w-100 text-primary 
          body-medium-regular text-capitalize text-start`}
        >
          <p>{gstAccordionTitle || 'GST Details'}</p>
          <span className={`icon-accordion-${toggle ? 'up' : 'down'}-simple icon-size-sm icon-size-md-lg`} />
        </button>
        <div className={`gst-form__wrapper p-6 gap-6 px-md-12 py-md-10 d-grid gap-md-8 
          bg-white ${toggle ? 'd-block' : 'd-none'}`}
        >
          <div className="gst-form__input">
            <InputField
              type="text"
              name={gstContextKeys.companyGstNum}
              placeholder={gstNumberLabel || 'Enter GST Number'}
              onChangeHandler={(e) => onChangeHandler(e, 'gstNum')}
              register={() => {}}
              value={gstDetails.companyGstNum.value.toUpperCase()}
              customErrorMsg={gstDetails.companyGstNum.error}
              disabled={modificationFlow}
              maxLength={isGstVaidate ? 15 : null}
              minLength={isGstVaidate ? 15 : null}
            />
          </div>
          <div className="gst-form__input">
            <InputField
              type="email"
              name={gstContextKeys.companyEmail}
              placeholder={gstEmailLabel || 'Enter Email'}
              onChangeHandler={(e) => onChangeHandler(e, 'email')}
              register={() => {}}
              value={gstDetails.companyEmail.value}
              customErrorMsg={gstDetails.companyEmail.error}
              disabled={modificationFlow}
            />
          </div>
          <div className="gst-form__input">
            <InputField
              type="text"
              name={gstContextKeys.companyName}
              placeholder={gstCompanyNameLabel || 'Company Name'}
              onChangeHandler={(e) => onChangeHandler(e)}
              register={() => {}}
              value={gstDetails.companyName.value}
              customErrorMsg={gstDetails.companyName.error}
              disabled={modificationFlow}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
GstForm.propTypes = {
  disableNextButton: PropTypes.func,
};
export default React.memo(GstForm);
