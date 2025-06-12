import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import classnames from 'classnames';
import parse from 'date-fns/parse';
import isValid from 'date-fns/isValid';
import differenceInYears from 'date-fns/differenceInYears';

import Input from '../../../components/common/Form/Input';
import DatePicker from '../../../components/common/Form/DatePicker';
import { REGEX_LIST } from '../../../constants';
import AEMContext from '../../../context/AEMContextProvider';

function isDateInValid(DOB) {
  const dobDate = parse(DOB, 'dd-MM-yyyy', new Date());

  if (isValid(dobDate)) {
    let isInvalid = false;
    const years = parseInt(differenceInYears(new Date(), dobDate), 10);
    if (years < 2) {
      isInvalid = true;
    }
    return isInvalid;
  }
  return false;
}

const Form = ({ data, index, onChange }) => {
  const { aemLabel } = useContext(AEMContext);

  const { FirstName, LastName, Gender, DOB, isNew, duplicateNominee } = data;

  const onChangeValue = (key, value) => {
    if (!isNew) {
      return;
    }

    onChange(index, key, value);
  };

  const onChangeName = (e) => {
    const { value, dataset } = e.target;
    const { formKey } = dataset;

    onChangeValue(
      formKey,
      value.replace(REGEX_LIST.NAME_ONLY_ALPHABET_SPACE, ''),
    );
  };

  const { radioItems, aemData } = useMemo(() => {
    return {
      radioItems: Object.entries(aemLabel('genderIdentity', [])).map(
        ([value, label]) => ({
          label,
          value,
        }),
      ),
      aemData: {
        nameDescription: aemLabel('nameDescription'),
        dateOfBirthFormatMsg: aemLabel('dateOfBirthFormatMsg'),
        dateOfBirthErrorMsg: aemLabel('dateOfBirthErrorMsg'),
        firstNamePlaceholderText: aemLabel('firstNamePlaceholderText'),
        lastNamePlaceholderText: aemLabel('lastNamePlaceholderText'),
        dateOfBirthPlaceholderText: aemLabel('dateOfBirthPlaceholderText'),
        nomineeExistsErrorMsg: aemLabel('nomineeExistsErrorMsg'),
        nomineeInvalidErrorMsg: aemLabel('nomineeInvalidErrorMsg'),
      },
    };
  }, [aemLabel]);

  const className = classnames(
    'user-profile__nominee__passenger-container__item',
    { disabled: !isNew },
  );

  const dateClassName = 'date-error';
  const isDateInvalid = isDateInValid(DOB);

  return (
    <div className={className}>
      <RadioBoxGroup
        items={radioItems}
        selectedValue={Gender}
        containerClassName="genderinput"
        onChange={(value) => {
          onChangeValue('Gender', value);
        }}
        name={`gender-${index}`}
      />
      <span className="nameinfo">{aemData.nameDescription}</span>
      <div className="nameinput">
        <Input
          placeholder={aemData.firstNamePlaceholderText}
          value={FirstName}
          onChange={onChangeName}
          disabled={!isNew}
          data-form-key="FirstName"
          maxLength={32}
          customErrorMsg={duplicateNominee?.isDuplicateNominee}
        />
        <Input
          placeholder={aemData.lastNamePlaceholderText}
          value={LastName}
          onChange={onChangeName}
          disabled={!isNew}
          data-form-key="LastName"
          maxLength={32}
          customErrorMsg={duplicateNominee?.isDuplicateNominee}
        />
      </div>
      {duplicateNominee?.isLoggedLoyaltyName
      && <div className="dobinput__invalid mt-0 mb-6">{aemData.nomineeInvalidErrorMsg}</div>}
      {duplicateNominee?.isNommineeName
      && <div className="dobinput__invalid mt-0 mb-6">{aemData.nomineeExistsErrorMsg}</div>}
      <div className="dobinput">
        <DatePicker
          placeholder={aemData.dateOfBirthPlaceholderText}
          value={DOB}
          disabled={!isNew}
          onChange={(value) => {
            onChangeValue('DOB', value);
          }}
          className={isDateInvalid && dateClassName}
        />
        {isDateInvalid && <div className="dobinput__invalid">*{aemData.dateOfBirthErrorMsg || 'Invalid Date'}</div>}
        <span className="dobinput__hint">*{aemData.dateOfBirthFormatMsg}</span>
      </div>
    </div>
  );
};

Form.propTypes = {
  data: PropTypes.shape({
    DOB: PropTypes.any,
    FirstName: PropTypes.string,
    Gender: PropTypes.string,
    LastName: PropTypes.string,
    disabled: PropTypes.bool,
    errors: PropTypes.any,
    isNew: PropTypes.bool,
    duplicateNominee: PropTypes.any,
  }),
  index: PropTypes.any,
  onChange: PropTypes.func,
};

export default Form;
