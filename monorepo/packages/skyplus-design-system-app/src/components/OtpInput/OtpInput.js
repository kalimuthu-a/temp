import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/extensions
import InputTextField from './InputTextField.jsx';
import { uniq } from '../../functions/utils';
// const { InputTextField } = ComponentLib;

const initialValue = {
  minute: 10,
  seconds: 0,
};

const OtpInput = forwardRef(
  (
    {
      otpLength = 6,
      onChangeHandler,
      containerClass = '',
      renderResentOtp,
      initialTimerObj = initialValue,
      variation = '',
      error = '',
      onEnter = () => {},
    },
    ref,
  ) => {
    const [otpNumber, setOtpNumber] = useState([]);
    const [minutes, setMinutes] = useState(initialTimerObj?.minute);
    const [seconds, setSeconds] = useState(initialTimerObj?.seconds);
    let otpTimerInterval = null;
    const otpInputArr = useMemo(() => {
      return Array.from({ length: otpLength }).map(() => uniq());
    }, []);

    useImperativeHandle(ref, () => ({
      resetTimer() {
        setMinutes(initialTimerObj.minute);
        setSeconds(initialTimerObj.seconds);
      },
    }));

    useEffect(() => {
      otpTimerInterval = !renderResentOtp
        ? null
        : setInterval(() => {
          if (seconds > 0) {
            setSeconds(seconds - 1);
          }
          if (seconds === 0) {
            if (minutes === 0) {
              clearInterval(otpTimerInterval);
            } else {
              setMinutes(minutes - 1);
              setSeconds(59);
            }
          }
        }, 1000);
      return () => {
        clearInterval(otpTimerInterval);
      };
    }, [seconds, minutes, initialTimerObj?.minute, initialTimerObj?.seconds]);

    const inputProps = {
      label: '',
      variation: 'DEFAULT',
      customClass: `skyplus-otpInput__otp-input ${error ? 'otp__error' : ''}`,
      type: 'number',
      maxLength: 1,
    };
    const onKeyUpHandler = (elmnt) => {
      const isNumeric = /^[0-9]$/.test(elmnt.target.value);

      if (isNumeric) {
        {
          const next = elmnt.target.dataset.index;
          if (next < otpLength) {
            elmnt?.target?.form?.elements[next]?.focus();
          }
        }
        return;
      }
      switch (elmnt.key) {
        case 'Backspace':
          {
            const next = elmnt.target.dataset.index - 2;
            if (next > -1) {
              elmnt?.target?.form?.elements[next]?.focus();
            }
          }
          break;
        case 'Delete':
          elmnt.target.value = null;
          const updatedOtpNumber = [...otpNumber];
          updatedOtpNumber[elmnt.target.dataset.index - 1] = '';
          setOtpNumber(updatedOtpNumber);
          const next = elmnt.target.dataset.index - 2;
          if (next > -1) {
            elmnt?.target?.form?.elements[next]?.focus();
          }

          break;
        case 'ArrowLeft':
          {
            const next = elmnt.target.dataset.index - 2;
            if (next > -1) {
              elmnt?.target?.form?.elements[next]?.focus();
            }
          }
          break;
        case 'ArrowRight':
          {
            const next = elmnt.target.dataset.index;
            if (next < elmnt?.target?.form?.elements?.length) {
              elmnt?.target?.form?.elements[next]?.focus();
            }
          }
          break;
        case 'Tab':
          // Do nothing on Tab
          break;
        default:
          // Do nothing on alphabets or symbols
          break;
      }
    };
    const onChnageOtpField = (index, value) => {
      if (value && !/^\d$/.test(value)) return;
      const temp = [...otpNumber];
      temp[index] = value;
      const stringValue = temp.join('').toString();
      // eslint-disable-next-line no-unused-expressions
      onChangeHandler && onChangeHandler(stringValue);
      setOtpNumber(temp);
    };

    const handlePaste = (event) => {
      event.preventDefault();
      const pasteData = event.clipboardData.getData('text');
      const digits = pasteData.match(/\d/g).slice(0, otpLength);
      if (digits) {
        const temp = [...otpNumber];
        digits.forEach((digit, index) => {
          if (index < otpLength) {
            temp[index] = digit;
          }
        });
        const stringValue = temp.join('').toString();
        onChangeHandler && onChangeHandler(stringValue);
        setOtpNumber(temp);
      }
    };

    return (
      <>
        <form className={`skyplus-otpInput__container ${containerClass}`}>
          {otpInputArr?.map((item, index) => {
            const customInputProps = {
              'data-index': index + 1,
              id: `otpF${index}`,
              autoComplete: 'off',
              onKeyUp: onKeyUpHandler,
              onPaste: handlePaste,
            };
            return (
              <InputTextField
                {...inputProps}
                value={otpNumber[index]}
                inputProps={customInputProps}
                onChangeHandler={(val) => onChnageOtpField(index, val)}
                variation={variation}
                key={item}
                onEnter={onEnter}
              />
            );
          })}

          {error && <p className="otp-field__error body-small-regular">{error}</p>}
        </form>
        {renderResentOtp ? renderResentOtp(minutes, seconds) : null}
      </>
    );
  },
);
OtpInput.displayName = 'OtpInput';
OtpInput.propTypes = {
  otpLength: PropTypes.number,
  onChangeHandler: PropTypes.func,
  containerClass: PropTypes.string,
  renderResentOtp: PropTypes.func,
  initialTimerObj: PropTypes.shape({
    minute: PropTypes.number,
    seconds: PropTypes.number,
  }),
  variation: PropTypes.string,
  error: PropTypes.string,
  onEnter: PropTypes.func,
};

export default OtpInput;
