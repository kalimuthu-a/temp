import React from 'react';
import DropDown from 'skyplus-design-system-app/dist/des-system/DropDown';

const PreferencesDetails = () => {
  const options = [
    { id: 'lesiure', label: 'Lesiure1', value: 'Lesiure', group: 'A' },
    { id: 'lesiure', label: 'Lesiure2', value: 'Lesiure', group: 'A' },
    { id: 'work', label: 'Work', value: 'Work', group: 'A' },
    { id: 'medical', label: 'Medical', value: 'Medical', group: 'B' },
  ];

  const getDropdownElement = (placeholder) => (
    <div className="design-system-input-field position-relative mb-6 profile-input-container select">
      <input className="my-profile-input" placeholder={placeholder} />
      <i className="icon icon-accordion-down-simple" />
    </div>
  );

  return (
    <div className="profile-container">
      <div className="title">Preferences</div>
      <div className="subtitle">Seat</div>
      <DropDown
        renderElement={() => getDropdownElement('Preferred seat')}
        containerClass="travelling-reason-dropdown"
        items={options}
        renderItem={({ id, label }) => (
          <div className="travelling-reason-dropdown__item" key={id}>
            {label}
          </div>
        )}
        setToggleModal={() => {}}
      />
      <DropDown
        renderElement={() => getDropdownElement('Seat type')}
        containerClass="travelling-reason-dropdown"
        items={options}
        renderItem={({ id, label }) => (
          <div className="travelling-reason-dropdown__item" key={id}>
            {label}
          </div>
        )}
        setToggleModal={() => {}}
      />
      <div className="dashed-line" />
      <div className="subtitle">Meal</div>
      <DropDown
        renderElement={() => getDropdownElement('Meal preference')}
        containerClass="travelling-reason-dropdown"
        items={options}
        renderItem={({ id, label }) => (
          <div className="travelling-reason-dropdown__item" key={id}>
            {label}
          </div>
        )}
        setToggleModal={() => {}}
      />
    </div>
  );
};

export default PreferencesDetails;
