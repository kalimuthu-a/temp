import React, { useState } from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import DropDown from 'skyplus-design-system-app/dist/des-system/DropDown';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import { SCREEN_TYPE } from '../../constants';
import { deleteAccountApi } from '../../services/deleteAccount.service';

function Delete({ setActiveScreen }) {
  const [doneState, setDoneState] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ feedback: '', suggestion: '' });
  const [isOpened, setIsOpened] = useState(false);

  const feedbackOptions = [
    { id: 1, label: 'Don\'t want to fly', value: 'Don\'t want to fly' },
    { id: 2, label: 'Change my Decision', value: 'Change my Decision' },
    { id: 3, label: 'For long Break', value: 'For long Break' },
    { id: 4, label: 'For Security Purpose ', value: 'For Security Purpose ' },
  ];

  const getDropdownElement = (placeholder) => (
    <div className="design-system-input-field position-relative mb-6 profile-input-container select">
      <input className="my-profile-input" placeholder={placeholder} readOnly value={feedbackData?.feedback} onClick={() => setIsOpened(!isOpened)} />
      <i className="icon icon-accordion-down-simple arrow-down-icon" />
    </div>
  );

  const getDropdownElement1 = (value = '1', field) => (
    isOpened && (
    <div
      className="feedback-dropdown__item"
      key={value}
      onClick={() => { onChangeForm(field, value); setIsOpened(false); }}
    >
      {value}
    </div>
    )
  );

  const onChangeForm = (key, value, nestedKey = null) => {
    setFeedbackData((prevData) => {
      const newData = { ...prevData };

      if (nestedKey) {
        newData[key] = { ...newData[key], [nestedKey]: value };
      } else {
        newData[key] = value;
      }

      if (newData?.feedback) {
        setDoneState(true);
      } else {
        setDoneState(false);
      }

      return newData;
    });
  };

  const deleteApi = async () => {
    const response = await deleteAccountApi();
    console.log('Response', response);
  };

  return (
    <OffCanvas
      containerClassName="is-hidden delete-feedback"
      onClose={() => setActiveScreen(SCREEN_TYPE.SETTINGS)}
      renderFooter={() => (
        <div className="py-8 px-4 w-100">
          <Button
            containerClass="w-100 cancel-btn"
            onClick={() => { setActiveScreen(SCREEN_TYPE.SETTINGS); }}
            {...{ block: true }}
          >
            Cancel
          </Button>
          <Button
            containerClass="w-100 mt-8"
            onClick={() => {
              deleteApi();
            }}
            {...{ block: true }}
            disabled={!doneState}
          >
            Delete Account
          </Button>
        </div>
      )}
    >
      <div>
        <div className="sidebar-header h4 pt-5 pb-25">
          Account <span className="inner-text">Delete</span>
        </div>
        <div className="px-8">
          <span className="body-medium-regular feedback-instruction">
            Please Share your feedback why you want to leave
          </span>
          <div className="pt-10">
            <DropDown
              renderElement={() => getDropdownElement('For Security Purpose')}
              containerClass="travelling-reason-dropdown body-small-light max-height"
              items={feedbackOptions}
              renderItem={({ value }) => (
                getDropdownElement1(value, 'feedback')
              )}
              setToggleModal={() => { }}
              onSelect={(selectedItem) => console.log({ selectedItem })}
            />
          </div>
          <div>
            <Input
              placeholder="How can we improve (optional)"
              onChangeHandler={(event) => onChangeForm('suggestion', event.target.value)}
              value={feedbackData?.suggestion}
            />
          </div>
        </div>
      </div>
    </OffCanvas>
  );
}
Delete.propTypes = {};
export default Delete;
