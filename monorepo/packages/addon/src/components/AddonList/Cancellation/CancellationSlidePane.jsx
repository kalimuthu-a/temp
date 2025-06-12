// import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
// import set from 'lodash/set';
import React, { useState, useContext } from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
// import TabsContainer from 'skyplus-design-system-app/dist/des-system/TabsContainer';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
// import CountryDropdown from 'skyplus-design-system-app/dist/des-system/CountryDropDown';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';
import { AppContext } from '../../../context/AppContext';
// import { getPassengerName } from '../../../functions';
// import { parseDataOfBirth } from '../../../functions/utils';
// import {
//   rowValidator,
//   dobValidator,
//   defaultTabUserData,
// } from './CancellationUtils';
import ReadMore from './ReadMore';
import CancellationBenefits from './CancellationBenefits';
// import CancellationSlidePaneTab from './CancellationSlidePaneTab';
// import { INDIA_ISO_CODE, paxCodes } from '../../../constants/index';

/**
 *
 * @type {React.FC<import("../../../../types/AddOnList").CancellationSlidePaneProps>}
 * @returns {React.FunctionComponentElement}
 */
const CancellationSlidePane = ({
  onClose,
  onSubmit,
  // passengerDetails,
  addonData,
  configData,
  // ssrCategory,
  // segmentData,
  sliderPaneConfigData,
}) => {
  const {
    state: { isInternationalFlight },
  } = useContext(AppContext);

  const [formData, setFormData] = useState({
    // data: [],
    checkbox__1: true,
    checkbox__2: true,
    // country: {
    //   iso: INDIA_ISO_CODE,
    // },
    error__1: false,
    error__2: false,
  });
  // const [activeTab, setActiveTab] = useState(true);

  const [benefitSlide, setBenefitSlide] = useState(false);
  // Country Dropdown: const [isInternational, setIsInternational] = useState(false);
  const [, setIsInternational] = useState(false);

  const AEMData = addonData?.availableSlidePaneData[0];
  const price = addonData?.availableSSR[0].ssrs[0].price;

  const onCloseSlider = () => {
    onClose();
  };

  const onSubmitHandler = () => {
    // const shuffleA = [
    //   ...formData.data.slice(activeTab + 1),
    //   ...formData.data.slice(0, activeTab + 1),
    // ];
    // const indexToChange = shuffleA.findIndex((row) => !rowValidator(row));

    // if (indexToChange !== -1) {
    //   const newTab = (indexToChange + 1 + activeTab) % formData.data.length;
    //   setActiveTab(newTab);
    //   return;
    // }

    const errors = { error__1: formData.error__1, error__2: formData.error__2 };

    // Based on AEM termsAndConditionsList Chekcbox Required Condition
    if (!formData.checkbox__1) {
      errors.error__1 = get(
        AEMData,
        ['termsAndConditionsList', 0, 'required'],
        false,
      );
    }

    if (!formData.checkbox__2) {
      errors.error__2 = get(
        AEMData,
        ['termsAndConditionsList', 1, 'required'],
        false,
      );
    }

    if (errors.error__1 || errors.error__2) {
      setFormData((prev) => ({ ...prev, ...errors }));
    } else {
      onSubmit(formData);
    }
  };

  const cancelProps = {
    modalCustomClass: 'cancellation-slider',
    title: `${AEMData?.sliderTitle}`,
    onClose: onCloseSlider,
    containerClassName: 'skyplus-offcanvas__addon-mf',
  };

  /**
    *
    * @param {import("../../../../types").PassengerDetails} passenger
    * @returns
  */
  // const extractPassengerInformation = (passenger) => {
  //   let type = passenger.passengerTypeCode;

  //   // for senior citizens
  //   if (
  //     passenger.discountCode === paxCodes.seniorCitizen.discountCode && passenger.info.dateOfBirth
  //   ) {
  //     type = paxCodes.seniorCitizen.discountCode;
  //   }

  //   let dob = { dd: '', mm: '', yy: '' };
  //   const errors = {};

  //   if (passenger.info.dateOfBirth) {
  //     dob = parseDataOfBirth(passenger.info.dateOfBirth);
  //   }

  //   return {
  //     type,
  //     dob,
  //     errors,
  //   };
  // };

  // useEffect(() => {
  //   const defaultActiveTab = paxIndex[tripIndex]?.paxIndex || 0;
  //   setActiveTab(defaultActiveTab);
  // }, []);

  // useEffect(() => {
  //   const initialData = {
  //     data: [],
  //     checkbox__1: true,
  //     checkbox__2: true,
  //     error__1: false,
  //     error__2: false,
  //   };

  //   let nationality;
  //   getPassengerDetails.forEach((passenger) => {
  //     nationality = passenger.info.nationality || INDIA_ISO_CODE;
  //   });
  //   initialData.data = getPassengerDetails.map(extractPassengerInformation);
  //   setFormData({
  //     ...initialData,
  //     country: { iso: nationality },
  //   });
  // }, []);

  // const onChangeTabDataHandler = (key, value, type = 'ADT') => {
  //   const newData = cloneDeep(formData);
  //   const oldData = get(newData, ['data', activeTab]);
  //   const obj = { [key]: value, errors: oldData.errors };
  //   obj.errors[key] = '';

  //   // if (key === 'dob') {
  //   //   obj.errors[key] = dobValidator(
  //   //     value,
  //   //     segmentData.journeydetail.arrival,
  //   //     type,
  //   //   )
  //   //     ? ''
  //   //     : AEMData?.invalidDateLabel;
  //   // }

  //   const updatedData = set(newData, ['data', activeTab], { ...oldData, ...obj });
  //   setFormData(updatedData);
  // };

  // const tabsProps = useMemo(() => {
  //   const contentProps = {
  //     AEMData: addonData?.availableSlidePaneData[0],
  //     configData,
  //     ssrCategory,
  //   };

  //   const tabsContent = {
  //     tabs: [],
  //     defaultActiveTab: activeTab,
  //     showSingleTabBtn: false,
  //     content: [],
  //   };

  //   const values = formData.data;

  //   if (values.length === 0) {
  //     return tabsContent;
  //   }

  //   passengerDetails?.forEach((passenger, index) => {
  //     const rowValue = get(values, [index], defaultTabUserData);

  //     tabsContent.tabs.push({
  //       title: getPassengerName(passenger),
  //       checked: rowValidator(rowValue),
  //     });

  //     tabsContent.content.push(
  //       <CancellationSlidePaneTab
  //         key={passenger.passengerKey}
  //         {...contentProps}
  //         {...rowValue}
  //         onChangeTabDataHandler={onChangeTabDataHandler}
  //         configData={configData}
  //         segmentData={segmentData}
  //       />,
  //     );
  //   });

  //   return tabsContent;
  // }, [formData, activeTab]);

  // const isSubmitButtonDisabled = useMemo(() => {
  //   if (activeTab === undefined || formData.data.length === 0) {
  //     return false;
  //   }

  //   // TD: Update this after date of birth and country selector
  //   return !rowValidator(formData.data[activeTab]);
  // }, [formData, activeTab]);

  // TD: uncomment after adding the country dropdown filed
  // const onChangeCountry = (country) => {
  //   setFormData((prev) => ({ ...prev, country }));
  // };

  // const onChangeTab = (t) => {
  //   setActiveTab(t);
  // };

  const btnProps = {
    label: configData?.doneCtaLabel,
    color: 'primary',
    variant: 'filled',
    size: 'medium',
    disabled: false,
  };
  const CancellationApiObj = addonData?.availableSSR[0]?.ssrs[0];
  return (
    <div className="cancelAddonSlider">
      <OffCanvas {...cancelProps}>
        <div className="skyplus-cancellation">
          <div className="skyplus-cancellation__title h0">{AEMData?.sliderTitle}</div>
          {/* <div className="skyplus-cancellation__tab-container">

          </div> */}
          {/* TD: Update typography for heading */}
          <Heading heading="h5" mobileHeading="h5" containerClass="mt-6">
            <div
              dangerouslySetInnerHTML={{
                __html: AEMData?.sliderDescription?.html,
              }}
            />
          </Heading>
          <h2
            className="skyplus-cancellation__description"
            dangerouslySetInnerHTML={{
              __html: !isInternationalFlight
                ? AEMData.domesticSliderDescription.html.replace(
                  '@ {}',
                  `<span class="skyplus-cancellation_price">@ ${price}</span>`,
                )
                : AEMData.internationalSliderDescription.html.replace(
                  '@ {}',
                  `<span class="skyplus-cancellation_price">@ ${price}</span>`,
                ),
            }}
          />
          <button
            className="skyplus-cancellation__viewbtn"
            onClick={() => setBenefitSlide(true)}
            type="button"
          >
            {AEMData?.viewDetailsCtaLabel}
          </button>
          <p className="skyplus-cancellation__country">
            {/* TD: {AEMData?.pleaseSelectCountryLabel} */}
          </p>

          <p className="skyplus-cancellation__mandatory">
            {/* TD: {AEMData?.mandatoryFieldsLabel} */}
          </p>
          {/* TD: for showing single passanger name in cancellation addon-mf */}
          {/* TD: {tabsProps.tabs.length === 1 && (
          <div
            className="skyplus-cancellation__single"
            dangerouslySetInnerHTML={{
              __html: AEMData?.addDetailsForLabel.replace(
                '{}',
                tabsProps?.tabs[0]?.title,
              ),
            }}
          />
          )} */}

          {/* <TabsContainer {...tabsProps} onChangeTab={onChangeTab} /> */}

          {/* <div className="skyplus-cancellation__country-dropdown-container">
            <CountryDropdown
              showCountryName
              defaultValue={{
                countryName: formData.country.iso,
                countryCode: formData.country.iso,
              }}
              onChangeCountryCode={onChangeCountry}
              setIsInternational={setIsInternational}
              showCountryCode={false}
              showFlag
              showToggler
              showPhoneCode={false}
              countryDropdownField="skyplus-cancellation__country-dropdown"
            />
          </div> */}
          {AEMData && AEMData?.termsAndCondition?.map((element, key) => {
            const keyName = `checkbox__${key + 1}`;
            const keyError = `error__${key + 1}`;
            const hasError = get(formData, keyError, null);

            return (
              <div
                className={`skyplus-cancellation__content-terms ${
                  hasError ? 'error' : ''
                }`}
                key={keyName}
              >
                <Checkbox
                  onChangeHandler={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      [keyName]: e.target.checked,
                      [keyError]: null,
                    }));
                  }}
                  checked={get(formData, [keyName], false)}
                  id={keyName}
                />
                <div className="skyplus-cancellation__content-checkboxdata">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: element.description?.html,
                    }}
                  />
                  <div className="skyplus-cancellation__checkbox__error">
                    {hasError ? element?.requiredLabel : ''}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="skyplus-cancellation__benefit-poweredbyname">
            <ReadMore
              html={AEMData?.poweredByDisclaimer?.html}
              length={80}
              readMoreLabel={sliderPaneConfigData.readMoreLabel}
              readLessLabel={sliderPaneConfigData.readLessLabel}
            />
          </div>
          <div className="skyplus-cancellation__donebtn">
            <OffCanvasFooter
              title={sliderPaneConfigData?.totalPriceLabel}
              titleData={price}
              buttonTitle={AEMData?.sliderButtonLabel}
              btnProps={btnProps}
              buttonIcon={false}
              postButtonIcon="icon-accordion-left-24"
              onSubmit={onSubmitHandler}
              // disabled={isSubmitButtonDisabled}
              currencycode={CancellationApiObj.currencycode}
            />
          </div>
        </div>
      </OffCanvas>
      {benefitSlide && (
      <CancellationBenefits
        onClose={() => setBenefitSlide(false)}
        AEMData={addonData?.availableSlidePaneData[0]}
        sliderPaneConfigData={sliderPaneConfigData}
      />
      )}
    </div>
  );
};

CancellationSlidePane.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  // passengerDetails: PropTypes.arrayOf(PropTypes.any),
  addonData: PropTypes.any,
  configData: PropTypes.any,
  // ssrCategory: PropTypes.string,
  // segmentData: PropTypes.any,
  sliderPaneConfigData: PropTypes.object,
};

export default CancellationSlidePane;
