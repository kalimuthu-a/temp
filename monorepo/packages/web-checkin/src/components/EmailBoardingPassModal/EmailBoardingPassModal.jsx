/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import ModalComponent from 'skyplus-design-system-app/dist/des-system/ModalComponent';
import { regexConstant } from '../../constants';
import { emailBoardinPass } from '../../services';
import { webcheckinActions } from '../../context/reducer';
import useAppContext from '../../hooks/useAppContext';

const EmailBoardingPass = ({ onClose, recordLocator }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const { dispatch, aemLabel } = useAppContext();

  const aemLabels = {
    emailSuccessMessage: aemLabel(
      'boardingPass.emailSuccessMessage',
      'Your Boarding Pass has been sent to your email address successfully.',
    ),
    boardingTimeLabel: aemLabel('boardingPass.boardingTimeLabel'),
    emailLabel: aemLabel('boardingPass.emailLabel', 'Email'),
    cancelLabel: aemLabel('boardingPass.cancelLabel', 'Cancel'),
    sendLabel: aemLabel('boardingPass.sendLabel', 'Send'),
  };

  const validateForm = (valueTemp) => {
    const splittedEmails = valueTemp?.split(',') || [];
    if (splittedEmails.length === 0) {
      setError('Email Address is Not valid');
      return;
    }

    const isNotValid = splittedEmails.some((eItem) => {
      return !regexConstant.EMAIL.test(eItem);
    });

    setError(isNotValid ? 'Please enter email validate address' : '');
  };

  const onClickProceed = async () => {
    const splittedEmails = value?.split(',') || [];

    const emailListArr = [];

    splittedEmails.forEach((eItem) => {
      emailListArr.push({ EmailAddress: eItem });
    });

    dispatch({ type: webcheckinActions.SHOW_LOADER, payload: true });

    const payload = {
      emailBoardingPass: {
        RecordLocator: recordLocator,
        EmailAddresses: emailListArr,
      },
    };
    try {
      const response = await emailBoardinPass(payload);

      if (response.data.success === true) {
        dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
        onClose();
        dispatch({
          type: webcheckinActions.SET_TOAST,
          payload: {
            variation: 'Success',
            show: true,
            description: aemLabels.emailSuccessMessage,
          },
        });
      }
    } catch {
      dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
      onClose();
    }
  };

  const onChangeHandler = (event) => {
    const { value: v } = event.target;
    setValue(v);
    validateForm(v);
  };

  const renderForm = () => {
    return (
      <div className="email-itinerary-form">
        <div className="content">
          <Text variation="h5" containerClass="title">
            {aemLabels.emailLabel}
          </Text>
          <InputField
            type="email"
            name="emailAddress"
            placeholder="Enter email address"
            inputWrapperClass="email"
            onChangeHandler={onChangeHandler}
            customErrorMsg={error}
          />
        </div>

        <div className="footer">
          <Button
            color="secondary"
            size="small"
            variation="secondary"
            containerClass="contact-cta"
            onClick={onClose}
          >
            {aemLabels.cancelLabel}
          </Button>
          <Button
            size="small"
            containerClass="contact-cta"
            disabled={error || !value}
            onClick={onClickProceed}
          >
            {aemLabels.sendLabel}
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

EmailBoardingPass.propTypes = {
  onClose: PropTypes.func,
  recordLocator: PropTypes.string.isRequired,
};

export default EmailBoardingPass;
