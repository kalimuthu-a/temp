import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import { useDispatch, useSelector } from 'react-redux';
import ModalComponent from 'skyplus-design-system-app/dist/des-system/ModalComponent';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { emailItineraryReq } from '../../../../services';
import { CONSTANTS } from '../../../../constants';
import { pushAnalytic } from '../../../../utils/analyticEvents';
import { toggleToast } from '../../../../store/configData';

const EmailItinerary = ({ onClose }) => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { emailPopUp, successMessage } = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
  ) || {};
  const { bookingDetails } = useSelector((state) => state.itinerary?.apiData) || {};
  const dispatch = useDispatch();

  useEffect(() => {
    pushAnalytic({
      data: {
        _event: 'emailItineraryOverlay',
        _eventInfoName: 'Email itinerary',
      },
      event: 'click',
      error: {},
    });
  }, []);

  const validateForm = (valueTemp) => {
    const splittedEmails = valueTemp?.split(',') || [];
    let isValid = splittedEmails.length > 0;
    splittedEmails.forEach((eItem) => {
      if (!CONSTANTS.REGEX.EMAIL.test(eItem)) {
        isValid = false;
      }
    });
    if (!isValid) {
      const emailAddress = 'Please enter email validate address';
      setError({
        emailAddress,
      });
    }
    setError('');
    return isValid;
  };

  const onClickProceed = async () => {
    if (!validateForm(value)) {
      const emailAddress = 'Enter valid email ID';
      setError({
        emailAddress,
      });
      return;
    }
    const splittedEmails = value?.split(',') || [];
    const emailListArr = [];
    splittedEmails.forEach((eItem) => {
      emailListArr.push({ emailAddress: eItem });
    });

    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (value?.length > 0) {
      // sending emails
      if (emailListArr.length > 0) {
        setIsLoading(true);
        const payload = {
          emailItinerary: {
            isMultipleEmailIds: true,
            recordLocator: bookingDetails.recordLocator,
            emailAddresses: emailListArr,
          },
        };

        const data = await emailItineraryReq(payload);
        const getErrorMsg = getErrorMsgForCode(data?.errorCode);
        const { message } = getErrorMsg;
        setIsLoading(false);
        const msg = successMessage?.filter((msgData) => msgData?.key === 'emailItinerary')?.[0]?.description?.html
          || 'Your Itinerary details sent you on email successfully';
        if (data?.data?.success) {
          dispatch(
            toggleToast({
              show: true,
              props: {
                title: '',
                description: msg,
                variation: 'notifi-variation--Success',
                containerClass: 'email-itinerary-success-toast modification-success-toast',
                infoIconClass: 'icon-check text-forest-green',
                autoDismissTimeer: 10000,
              },
            }),
          );
        } else {
          dispatch(
            toggleToast({
              show: true,
              props: {
                title: '',
                variation: 'notifi-variation--Error',
                description: message || 'Error',
              },
            }),
          );
        }
        onClose();
      }
    }
  };

  const renderForm = () => {
    return (
      <div className="email-itinerary-form">
        <div className="content">
          <Text variation="h5" containerClass="title">
            {emailPopUp?.note}
          </Text>
          <InputField
            type="email"
            name="emailAddress"
            placeholder={emailPopUp?.heading}
            register={() => {}}
            inputWrapperClass="email"
            onChangeHandler={(event) => {
              setValue(event?.target?.value);
              validateForm(event?.target?.value);
            }}
            customErrorMsg={error?.emailAddress || ''}
          />
        </div>

        <div className="footer">
          <Button
            color="secondary"
            size="small"
            variation="secondary"
            containerClass="contact-cta"
            onClick={() => {
              pushAnalytic({
                data: {
                  _event: 'emailItineraryPopupAction',
                  _eventInfoName: emailPopUp?.ctaLabel,
                },
                event: 'click',
                error: {},
              });
              onClose();
            }}
          >
            {emailPopUp?.ctaLabel}
          </Button>
          <Button
            size="small"
            containerClass="contact-cta"
            disabled={isLoading}
            onClick={onClickProceed}
          >
            {!isLoading && emailPopUp?.secondaryCtaLabel}
            {isLoading && 'Loading...'}
          </Button>
        </div>
      </div>
    );
  };
  return (
    <ModalComponent
      modalContent={renderForm}
      onCloseHandler={onClose}
      modalWrapperClass="email-itinerary-contact-modal"
      modalContentClass="email-itinerary-contact-modal__content"
      showCrossIcon
    />
  );
};

EmailItinerary.propTypes = {
  onClose: PropTypes.func,
};

export default EmailItinerary;
