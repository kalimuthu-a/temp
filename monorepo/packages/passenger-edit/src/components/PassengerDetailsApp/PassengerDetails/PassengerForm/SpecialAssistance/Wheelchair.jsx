import React, { useContext, useState, useEffect } from 'react';
import FormRadio from 'skyplus-design-system-app/src/components/FormRadio/FormRadio';
import StyledDropdown from 'skyplus-design-system-app/src/components/StyledDropdown/StyledDropdown';
import { useFormContext } from 'react-hook-form';
import FormText from 'skyplus-design-system-app/src/components/FormText/FormText';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import camelCase from 'lodash/camelCase';
import PropTypes from 'prop-types';
import { transformStr } from '../../../../../helpers';
import {
  MEDICAL_REASONS,
  OTHERS,
  WHEELCHAIR_USER,
  COUNTRY_CODE_ELEMENT_NAME,
} from '../../../../../constants/constants';
import { AppContext } from '../../../../../context/appContext';
import './SpecialAssistance.scss';

const Wheelchair = ({
  wheelchairReasonName,
  wheelchairCategoryName,
  wheelchairSubCategoryName,
  assistanceRequiredName,
  contactNumberName,
  onChangePhoneNumber,
  validatePhone,
  category,
  subCategory,
}) => {
  const {
    state: {
      contactFormLabels: { phoneLabels },
      aemMainData: {
        specialAssistanceDetails: {
          selectReasonRequestLabel,
          wheelChairReason: {
            selectCategory,
            selectSubCategory,
            medicalReason,
            medicalReasonTitle,
            seniorCitizensTitle,
            wheelchairUserTitle,
            othersTitle,
            othersDetails,
            wheelChairUserCategoryList,
          },
        },
      },
    },
  } = useContext(AppContext);

  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
    ...methods
  } = useFormContext();

  const inputTextTitle = othersDetails[2].title;

  const wheelchairItems = [
    medicalReasonTitle,
    seniorCitizensTitle,
    wheelchairUserTitle,
    othersTitle,
  ].map((reasonTitle) => {
    return {
      label: reasonTitle,
      value: transformStr(reasonTitle),
    };
  });

  const wheelchairReasons = watch(wheelchairReasonName);
  const medicalCategory = medicalReason.map((item) => item.categoryName);
  const [medicalSubCategory, setMedicalSubCategory] = useState([]);
  const [categoryPlaceholder, setCategoryPlaceholder] = useState(selectCategory);
  const [subCategoryPlaceholder, setSubCategoryPlaceholder] = useState(selectSubCategory);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const categoryChangeHandler = (val) => {
    setValue(wheelchairCategoryName, val);
    const subCategories = medicalReason.filter(
      (el) => el.categoryName === val,
    )?.[0]?.subCategoryName;
    setSubCategoryPlaceholder(selectSubCategory);
    setMedicalSubCategory(subCategories);
  };

  useEffect(() => {
    setCategoryPlaceholder(selectCategory);
    setSubCategoryPlaceholder(selectSubCategory);
  }, [wheelchairReasons]);

  useEffect(() => {
    if (category) {
      setCategoryPlaceholder(category);
      categoryChangeHandler(category);
    }
    if (subCategory) setSubCategoryPlaceholder(subCategory);
  }, []);

  return (
    <div className="special-assistance__card bg-white p-8 d-flex flex-column gap-2 position-relative">
      <div className="special-assistance__heading body-medium-large">
        {selectReasonRequestLabel}
      </div>
      <div className="special-assistance__dashed-card d-flex flex-column gap-4 rounded px-4 py-2 flex-md-row gap-md-12">
        <div
          className="w-100 d-flex flex-wrap gap-4 column-gap-md-12 flex-column
          body-small-regular flex-md-row"
        >
          {wheelchairItems.map(({ label }) => {
            const val = camelCase(label);
            return (
              <FormRadio
                key={val}
                id={val}
                register={register}
                registerKey={wheelchairReasonName}
                value={val}
                containerClass="d-flex gap-3"
              >
                {label}
              </FormRadio>
            );
          })}
        </div>
      </div>
      {wheelchairReasons === MEDICAL_REASONS && (
        <>
          <div className="special-assist-select-category mt-8 mb-6">
            <StyledDropdown
              containerClass="body-small-light"
              list={medicalCategory}
              onChange={categoryChangeHandler}
              selected={categoryPlaceholder}
              setIsSelected={setCategoryPlaceholder}
              isActive={activeDropdown === categoryPlaceholder}
              setActiveDropdown={() => setActiveDropdown(categoryPlaceholder)}
              deactivateDropdown={() => setActiveDropdown(null)}
            />
          </div>
          {(categoryPlaceholder !== selectCategory) && (
            <div className="special-assist-select-category">
              <StyledDropdown
                containerClass="body-small-light"
                list={medicalSubCategory}
                onChange={(val) => setValue(wheelchairSubCategoryName, val)}
                selected={subCategoryPlaceholder}
                setIsSelected={setSubCategoryPlaceholder}
                isActive={activeDropdown === subCategoryPlaceholder}
                setActiveDropdown={() => setActiveDropdown(subCategoryPlaceholder)}
                deactivateDropdown={() => setActiveDropdown(null)}
              />
            </div>
          )}
        </>
      )}
      {wheelchairReasons === WHEELCHAIR_USER && (
        <div className="special-assist-select-category mt-8">
          <StyledDropdown
            containerClass="body-small-light"
            list={wheelChairUserCategoryList}
            onChange={(val) => setValue(wheelchairCategoryName, val)}
            selected={categoryPlaceholder}
            setIsSelected={setCategoryPlaceholder}
            isActive={activeDropdown === categoryPlaceholder}
            setActiveDropdown={() => setActiveDropdown(categoryPlaceholder)}
            deactivateDropdown={() => setActiveDropdown(null)}
          />
        </div>
      )}
      {wheelchairReasons === OTHERS && (
        <>
          <PhoneComponent
            className="mb-0"
            name={contactNumberName}
            onChangePhoneNumber={onChangePhoneNumber}
            countryCodeName={COUNTRY_CODE_ELEMENT_NAME}
            errors={errors}
            value={validatePhone}
            register={register}
            required="This field is required"
            {...methods}
            {...phoneLabels}
          />
          <FormText
            placeholder={inputTextTitle}
            register={register}
            registerKey={assistanceRequiredName}
          />
        </>
      )}
    </div>
  );
};

Wheelchair.propTypes = {
  onChangePhoneNumber: PropTypes.func,
  wheelchairReasonName: PropTypes.string,
  wheelchairCategoryName: PropTypes.string,
  wheelchairSubCategoryName: PropTypes.string,
  assistanceRequiredName: PropTypes.string,
  contactNumberName: PropTypes.string,
  validatePhone: PropTypes.string,
  category: PropTypes.string,
  subCategory: PropTypes.string,
};

export default Wheelchair;
