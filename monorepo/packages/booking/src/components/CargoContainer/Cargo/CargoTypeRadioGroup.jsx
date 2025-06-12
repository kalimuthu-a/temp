import React from 'react';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';

const CargoTypeRadioGroup = () => {
  const onChange = () => {};
  const tripTypesItems = [
    {
        journeyTypeCode: 'Domestic',
        journeyTypeLabel: 'Domestic',
        value: 'domestic',
        label: 'Domestic',
    },
    {
        journeyTypeCode: 'International',
        journeyTypeLabel: 'International',
        value: 'international',
        label: 'International',
    },
];

const triptype = {
  value: 'domestic',
  journeyTypeCode: 'Domestic',
  journeyTypeLabel: 'Domestic',
  label: 'Domestic',
};
  return (
    <div>
      <RadioBoxGroup
        items={tripTypesItems}
        onChange={onChange}
        selectedValue={triptype.value}
        name="triptype"
      />
    </div>
  );
};

export default CargoTypeRadioGroup;
