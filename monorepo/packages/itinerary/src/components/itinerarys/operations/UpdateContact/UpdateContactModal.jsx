import React, { useState, useEffect } from 'react';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import { useSelector, useDispatch } from 'react-redux';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import ModalComponent from 'skyplus-design-system-app/dist/des-system/ModalComponent';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { CONSTANTS } from '../../../../constants';
import { makePNRSearch, otpInitiateReq, updateContact } from '../../../../services';
import { toggleToast } from '../../../../store/configData';// setLoading
import EnterOTP from '../../../common/EnterOTP/EnterOTP';
import { pushAnalytic } from '../../../../utils/analyticEvents';
import { setItineraryDetails } from '../../../../store/itinerary';
import SuccessErrorConfirmPopup from '../../../common/SuccessErrorConfirmPopup/SuccessErrorConfirmPopup';
import { pushDataLayer } from '../../../../utils/dataLayerEvents';
import './CountryPicker.scss';

export const REGEX_LIST = {
  INDIAN_MOBILE_NUMBER: /^[6-9]\d{9}$/,
  EXCEPT_INDIAN_MOBILE_NUMBER: /^\d{7,14}$/,
};

const UpdateContactModal = ({ onClose }) => {
  const [formData, setFormData] = React.useState({
    mobilePhoneCountryCode: '91',
    mobilePhone: '',
    otherPhoneCountryCode: '91',
    otherPhone: '',
    emergencyPhoneCountryCode: '91',
    emergencyPhone: '',
    emailAddress: '',
    emergencycontact: {
      label: '',
      value: '',
    },
  });

  const itineraryApiData = useSelector((state) => state.itinerary?.apiData) || {};
  const mfAdditionalData = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
  ) || {};
  const { updateContactDetails, submitPassengerDetails, otpDetails, successMessage } = mfAdditionalData;
  const [error, setError] = useState({});
  const [otpInput, setOtpInput] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);// otpVerified
  /* eslint-disable no-unused-vars */
  const [otpError, setOtpError] = useState(null); // NOSONAR
  const [loading, setLoadingButton] = useState(false); // NOSONAR
  const [otpNumber, setOtpNumber] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const apiNavigationMenu = itineraryApiData?.navigationMenu_Mb?.Modify || [];
  const dispatch = useDispatch();
  const [isMobile] = useIsMobile();
  const phoneErrorMsg = 'Please enter a valid phone number';
  // As suggested by API, isOtpRequired by defaul set to true on update contact detail(WEB-4554)
  const showOtpPopup = true;// isOtpRequired
  const checkboxItems = updateContactDetails?.emergencyRelationship?.map((i) => ({
    label: i,
    value: i.toLowerCase().replace(' ', '-'),
  }));

  useEffect(() => {
    if (typeof window !== 'undefined' && window.document) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (typeof window !== 'undefined' && window.document) {
        document.body.style.overflow = 'unset';
      }
    };
  }, []);

  const sendOTP = async (resend = false) => {
    const response = await otpInitiateReq(true);
    if (response?.isSuccess || (response?.data?.success)) {
      if (!resend) {
        setLoadingButton(false);
        setOtpInput(true);
      }
    } else {
      let err;
      if (Array.isArray(response?.errors) && response?.errors.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        err = response.errors[0];
      } else if (response?.error) {
        err = response.error;
      } else {
        err = response?.errors;
      }
      const errorObj = getErrorMsgForCode(err?.code);
      // eslint-disable-next-line no-undef
      dispatch(
        toggleToast({
          show: true,
          props: {
            title: 'Error',
            description: errorObj?.message || 'Something went wrong',
          },
        }),
      );
      // eslint-disable-next-line no-unused-expressions
      // onClose && onClose();
      setError(errorObj);
      setOtpError(errorObj);
      setLoadingButton(false);
    }
  };

  const onCloseHandler = () => {
    setOtpVerified(false);
    onClose();
  };

  const isValidEmail = (email) => {
    return CONSTANTS.REGEX.EMAIL.test(email);
  };

  const isValidMobileNumber = (countryCode, value) => {
    if (countryCode === '91') {
      return REGEX_LIST.INDIAN_MOBILE_NUMBER.test(value);
    }
    return REGEX_LIST.EXCEPT_INDIAN_MOBILE_NUMBER.test(value);
  };

  const updateEmergencyContact = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      emergencycontact: {
        ...prevFormData.emergencycontact,
        label: value,
        value,
      },
    }));
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const onChangeFormData = (value, key) => {
    const updatedFormData = { ...formData };
    const updatedErrorObj = { ...error };
    // Update formData with new value
    updatedFormData[key] = value;
    const emergencyContactValue = Object.values(formData?.emergencycontact).every((ele) => ele === '');

    if (key === 'mobilePhone' || key === "mobilePhoneCountryCode") {
      const isValid = isValidMobileNumber(formData.mobilePhoneCountryCode, value);
      updatedErrorObj.mobilePhone = isValid ? '' : phoneErrorMsg;
    } else if (key === 'otherPhone' || key === 'otherPhoneCountryCode') {
      const isValid = isValidMobileNumber(formData.otherPhoneCountryCode, value);
      updatedErrorObj.otherPhone = isValid ? '' : phoneErrorMsg;
    } else if (key === 'emergencyPhone' || key === 'emergencyPhoneCountryCode') {
      const isValid = isValidMobileNumber(formData.emergencyPhoneCountryCode, value);
      updatedErrorObj.emergencyPhone = isValid ? '' : phoneErrorMsg;
    } else if (key === 'emailAddress') {
      updatedErrorObj.emergencycontact = emergencyContactValue ? 'Emergency contact is required' : '';
      updatedErrorObj.emailAddress = isValidEmail(value) ? '' : 'Enter valid email ID';
    } else if (key === 'emergencycontact') {
      updateEmergencyContact(value);
      updatedErrorObj.emergencycontact = '';
    }

    const isFormValid = Object.values(updatedErrorObj)?.every((ele) => ele === '')
      && !Object.values(updatedFormData)?.some((data) => data === '');

    setIsDisabled(!isFormValid);
    setError(updatedErrorObj);
    setFormData(updatedFormData);
  };

  const handleSubmit = async (otp) => {
    setLoadingButton(true);
    // dispatch(setLoading(true));
    const contactDetails = {
      bookingContacts: [
        {
          mobilePhoneCountryCode: formData.mobilePhoneCountryCode,
          mobilePhone: formData.mobilePhone,
          otherPhoneCountryCode: formData.otherPhoneCountryCode,
          otherPhone: formData.otherPhone,
          emergencyPhoneCountryCode: formData.emergencyPhoneCountryCode,
          emergencyPhone: formData.emergencyPhone,
          emailAddress: formData.emailAddress,
          emergencyContactRelationship: formData.emergencycontact.label,
        },
      ],
      otp,
    };

    const data = await updateContact(contactDetails);
    if (data && data.error) {
      setLoadingButton(false);
      const errorObj = getErrorMsgForCode(data?.errorCode);
      const { message } = errorObj;
      if (showOtpPopup) setOtpError(message);
      else {
        // eslint-disable-next-line no-unused-expressions
        onClose && onClose();
      }
      // dispatch(
      //   toggleToast({
      //     show: true,
      //     props: {
      //       title: 'Error',
      //       description: message,
      //       variation: 'notifi-variation--error',
      //     },
      //   }),
      // );
      // adobe Analytic
      pushAnalytic({
        data: {
          _event: 'contactDetailSubmit',
          _eventInfoName: 'Submit',
        },
        event: 'click',
        error: Object.create(null, {
          code: { value: data?.errorCode, enumerable: true },
          message: { value: message, enumerable: true },
        }),
      });
      // Warning Analytic
      pushAnalytic({
        data: {
          _event: 'warning',
          pnrResponse: { ...itineraryApiData },
        },
        event: 'warning',
        props: {
          clickText: 'Submit',
          clickNav: 'Update Contact detail>Submit',
        },
      });
      // dispatch(setLoading(false));
    } else {
      const dataIti = await makePNRSearch();
      const response = await dataIti;
      dispatch(setItineraryDetails({ data: response }));

      if (showOtpPopup) {
        setLoadingButton(false);
        onClose();
        const msg = successMessage?.filter((msgData) => msgData?.key === 'updateContact')?.[0]?.description?.html
          || 'Contact updated successfully';
        dispatch(
          toggleToast({
            show: true,
            props: {
              title: '',
              variation: 'notifi-variation--Success',
              description: msg,
              infoIconClass: 'icon-check text-forest-green',
              containerClass: 'itienararay--success itinearary-success-toast modification-success-toast',
            },
          }),
        );
      } else {
        onClose();
        // NOSONAR
        // const msg = 'Your contact details have been updated successfully.';
      }
      // adobe Analytic
      pushAnalytic({
        data: {
          _event: 'contactDetailSubmit',
          _eventInfoName: 'Submit',
        },
        event: 'click',
        error: {},
      });
      pushDataLayer({
        data: {
          _event: 'link_click',
          pnrResponse: { ...itineraryApiData },
        },
        event: 'link_click',
        props: {
          clickText: 'Submit',
          clickNav: 'Update Contact detail>Submit',
        },
      });
    }
  };

  const onClickContinue = () => {
    const errorObj = {};
    // const errorMsg = localStorage.getItem('generic_data_container_app');
    if (!formData.mobilePhoneCountryCode) {
      errorObj.mobilePhoneCountryCode = 'Please enter ISD code';
    }
    if (!formData.mobilePhone) {
      errorObj.mobilePhone = phoneErrorMsg;
    }
    if (!formData.emergencyPhoneCountryCode) {
      errorObj.emergencyPhoneCountryCode = 'Please enter ISD code';
    }
    if (!formData.emergencyPhone) {
      errorObj.emergencyPhone = phoneErrorMsg;
    }
    if (!formData.emailAddress || error.emailAddress) {
      errorObj.emailAddress = 'Enter valid email ID';
    }
    if (Object.keys(errorObj).length < 1) {
      setLoadingButton(true);
      // eslint-disable-next-line no-unused-expressions
      showOtpPopup ? sendOTP(false) : handleSubmit();
    }
    setError(errorObj);
  };

  useEffect(() => {
    pushAnalytic({
      data: {
        _event: 'contactDetailPopupOpen',
        _eventInfoName: 'Update Health & Contact Details',
      },
      event: 'click',
      error: {},
    });
  }, []);

  const renderForm = () => {
    const newErrorObj = {};
    for (const key in error) {
      if (newErrorObj[key] !== key) {
        const keys = key;
        newErrorObj[keys] = { message: error[key] };
      }
    }
    return (
      <div className="update-contact-form" key={`update-form-${uniq}`}>
        <div className="content">
          <Text variation="h5" containerClass="title">
            {updateContactDetails?.title}
          </Text>
          <div className="update-details-form">
            <div className="input-field-list">
              <PhoneComponent
                phonePlaceholder={updateContactDetails?.mobileNo}
                getValues={() => { }}
                register={() => { }}
                className="mob-num"
                showCrossIcon={false}
                onChangeCountryCode={(value,item) => onChangeFormData(item?.phoneCode, 'mobilePhoneCountryCode')}
                onChangePhoneNumber={(value) => onChangeFormData(value, 'mobilePhone')}
                errors={
                  { mobilePhone: { message: newErrorObj.mobilePhone?.message } }
                }
                name="mobilePhone"
                countryCodeName="countryCode"
                required
              />
              <PhoneComponent
                phonePlaceholder={updateContactDetails?.alternativeMobNo}
                getValues={() => { }}
                register={() => { }}
                className="alt-num"
                onChangeCountryCode={(value, item) => onChangeFormData(item?.phoneCode, 'otherPhoneCountryCode')}
                onChangePhoneNumber={(value) => onChangeFormData(value, 'otherPhone')}
                errors={
                  { otherPhone: { message: newErrorObj.otherPhone?.message } }
                }
                name="otherPhone"
                required
              />
              <PhoneComponent
                phonePlaceholder={updateContactDetails?.emergencyMobNo}
                getValues={() => { }}
                register={() => { }}
                className="emg-num"
                onChangeCountryCode={(value,item) => onChangeFormData(item?.phoneCode, 'emergencyPhoneCountryCode')}
                onChangePhoneNumber={(value) => onChangeFormData(value, 'emergencyPhone')}
                errors={newErrorObj}
                name="emergencyPhone"
                required
              />
              <Text variation="sh7" containerClass="rel-title">
                {updateContactDetails?.emergencyMobNo}
              </Text>
              <RadioBoxGroup
                items={checkboxItems}
                // eslint-disable-next-line no-return-assign
                onChange={(event) => onChangeFormData(event, 'emergencycontact')}
                // eslint-disable-next-line no-return-assign
                selectedValue={formData.emergencycontact}
                containerClassName="d-flex emg-checkbox"
                errors={newErrorObj}
                name="emergencycontact"
              />
              <InputField
                type="email"
                name="emailAddress"
                placeholder={submitPassengerDetails?.emailLabel}
                register={() => { }}
                inputWrapperClass="email"
                onChangeHandler={
                  (event) => {
                    onChangeFormData(event.target.value, 'emailAddress');
                  }
                }
                errors={newErrorObj}
                required
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <Button
            size="small"
            containerClass={`contact-cta ${isDisabled ? 'contact-cta-disabled' : ''}`}
            onClick={() => onClickContinue()}
            disabled={loading}
          >
            {loading ? 'Loading...' : updateContactDetails?.ctaUpdateLabel}
          </Button>
          <HtmlBlock
            html={updateContactDetails?.description?.html}
            className="note"
          />
        </div>
      </div>
    );
  };

  const renderSuccessForm = () => {
    return (
      <SuccessErrorConfirmPopup
        description={otpDetails?.successResponseMessage?.description}
        title={otpDetails?.successResponseMessage?.title}
        key={uniq}
      />
    );
  };
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {otpInput ? (
        <EnterOTP
          onChangeHandler={(val) => setOtpNumber(val)}
          onClickVerifyOtp={() => handleSubmit(otpNumber)}
          onClickResent={() => sendOTP(true)}
          variation="model"
          onClickClose={onClose}
          otpError={otpError}
          setOtpError={setOtpError}
          loading={loading}
        />
      ) : (
        <ModalComponent
          modalContent={!otpVerified ? renderForm : renderSuccessForm}
          onCloseHandler={onCloseHandler}
          modalWrapperClass="update-contact-modal"
          modalContentClass="update-contact-modal__content"
          showCrossIcon={!isMobile}
        />
      )}
    </>
  );
};

UpdateContactModal.propTypes = { onClose: () => { } };

export default UpdateContactModal;
