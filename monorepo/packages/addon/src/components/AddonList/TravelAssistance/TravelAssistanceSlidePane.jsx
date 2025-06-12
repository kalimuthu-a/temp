import get from 'lodash/get';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
// Old Code:
// import Button from 'skyplus-design-system-app/dist/des-system/Button';
// import TabsContainer from 'skyplus-design-system-app/dist/des-system/TabsContainer';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import PropTypes from 'prop-types';

import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import { AppContext } from '../../../context/AppContext';
import { getPassengerName } from '../../../functions/index';
import { parseDataOfBirth } from '../../../functions/utils';

import ReadMore from './ReadMore';
import TravelAssistanceBenefits from './TravelAssistanceBenefits';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';
// TD: TravelAssistanceSlidePaneTab Component is not used
// import TravelAssistanceSlidePaneTab from './TravelAssistanceSlidePaneTab';
// TD: CountryCode
// import CountryDropdown from '../../common/CountryDropdown/CountryDropDown';
import {
  // aboveDateExpiry,
  defaultTabUserData,
  // dobValidator,
  // isAlphaNumericAndRequired,
  travelAssistanceRowValidator,
} from './TravelAssistanceUtils';
import {
  paxCodes,
  documentTypeCode,
  INDIA_ISO_CODE,
} from '../../../constants/index';

/**
 *
 * @type {React.FC<import("../../../../types/AddOnList").TravelAssistanceSlidePaneProps>}
 * @returns {React.FunctionComponentElement}
 */
const TravelAssistanceSlidePane = ({
  onClose,
  onSubmit,
  passengerDetails,
  addonData,
  configData,
  // ssrCategory,
  // segmentData,
  sliderPaneConfigData,
}) => {
  const {
    state: { tripIndex, paxIndex, getPassengerDetails, isInternationalFlight },
  } = useContext(AppContext);

  const [formData, setFormData] = useState({
    data: [],
    checkbox__1: true,
    checkbox__2: true,
    country: {
      iso: INDIA_ISO_CODE,
    },
    error__1: false,
    error__2: false,
  });
  const [activeTab, setActiveTab] = useState(0);

  const [benefitSlide, setBenefitSlide] = useState(false);
  const AEMData = addonData?.availableSlidePaneData[0];
  const price = addonData?.availableSSR[0].ssrs[0].price;

  const onCloseSlider = () => {
    onClose();
  };

  const onSubmitHandler = () => {
    // Handler Next Tab Active Logic

    const shuffleA = [
      ...formData.data.slice(activeTab + 1),
      ...formData.data.slice(0, activeTab + 1),
    ];
    const indexToChange = shuffleA.findIndex(
      (row) => !travelAssistanceRowValidator(row, isInternationalFlight),
    );

    if (indexToChange !== -1) {
      const newTab = (indexToChange + 1 + activeTab) % formData.data.length;
      setActiveTab(newTab);
      return;
    }

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

  const travelProps = {
    modalCustomClass: 'skyplus-travel-assistance-slider',
    title: `${AEMData?.sliderTitle}`,
    onClose: onCloseSlider,
    containerClassName: 'skyplus-offcanvas__addon-mf',
  };

  /**
 *
 * @param {import("../../../../types").PassengerDetails} passenger
 * @returns
 */
  const extractPassengerInformation = (passenger) => {
    let passportExpiry = { dd: '', mm: '', yy: '' };
    let visaExpiry = { dd: '', mm: '', yy: '' };
    let passportNumber = '';
    let visaNumber = '';

    let type = passenger.passengerTypeCode;

    // for senior citizens
    if (
      passenger.discountCode === paxCodes.seniorCitizen.discountCode && passenger.info.dateOfBirth
    ) {
      type = paxCodes.seniorCitizen.discountCode;
    }

    let dob = { dd: '', mm: '', yy: '' };
    const errors = {};
    passenger?.travelDocuments?.forEach((document) => {
      // Passport Details
      if (document.documentTypeCode === documentTypeCode.passport) {
        passportNumber = document.number;
        passportExpiry = parseDataOfBirth(document.expirationDate);
      }

      // Visa Details
      if (document.documentTypeCode === documentTypeCode.visa) {
        visaNumber = document.number;
        visaExpiry = parseDataOfBirth(document.expirationDate);
      }
    });

    if (passenger.info.dateOfBirth) {
      dob = parseDataOfBirth(passenger.info.dateOfBirth);
    }

    return {
      type,
      dob,
      passportNumber,
      passportExpiry,
      visaExpiry,
      visaNumber,
      errors,
    };
  };

  useEffect(() => {
    const defaultActiveTab = paxIndex[tripIndex]?.paxIndex || 0;
    setActiveTab(defaultActiveTab);
  }, []);

  useEffect(() => {
    const initialData = {
      data: [],
      checkbox__1: true,
      checkbox__2: true,
      error__1: false,
      error__2: false,
    };

    initialData.data = passengerDetails.map(extractPassengerInformation);
    let nationality;

    getPassengerDetails.forEach((passenger) => {
      nationality = passenger.info.nationality || INDIA_ISO_CODE;
    });

    setFormData({
      ...initialData,
      country: { iso: nationality },
    });
  }, []);

  /* Old Code:
  const onChangeTabDataHandler = (key, value, type = 'ADT') => {
    const newData = cloneDeep(formData);
    const oldData = get(newData, ['data', activeTab]);
    const obj = { [key]: value, errors: oldData.errors };

    if (key === 'dob') {
      obj.errors[key] = dobValidator(
        value,
        segmentData.journeydetail.arrival,
        type,
      )
        ? ''
        : AEMData?.invalidDateLabel;
    } else if (['visaNumber', 'passportNumber'].includes(key)) {
      obj.errors[key] = isAlphaNumericAndRequired(value, key, AEMData);
    } else if (['passportExpiry', 'visaExpiry'].includes(key)) {
      obj.errors[key] = aboveDateExpiry(value) ? '' : AEMData?.invalidDateLabel;
    }

    const updatedData = set(newData, ['data', activeTab], { ...oldData, ...obj });
    setFormData(updatedData);
  }; */

  const tabsProps = useMemo(() => {
    /* Old Code:
    const contentProps = {
      AEMData: addonData?.availableSlidePaneData[0],
      configData,
      ssrCategory,
    }; */

    const tabsContent = {
      tabs: [],
      defaultActiveTab: activeTab,
      showSingleTabBtn: false,
      content: [],
    };

    const values = formData.data;

    if (values.length === 0) {
      return tabsContent;
    }

    passengerDetails?.forEach((passenger, index) => {
      const rowValue = get(values, [index], defaultTabUserData);

      tabsContent.tabs.push({
        title: getPassengerName(passenger),
        checked: travelAssistanceRowValidator(rowValue, isInternationalFlight),
      });
      /* Old Code:
      tabsContent.content.push(
      <TravelAssistanceSlidePaneTab
        key={passenger.passengerKey}
        {...contentProps}
        {...rowValue}
        onChangeTabDataHandler={onChangeTabDataHandler}
        isInternational={isInternationalFlight}
        configData={configData}
      />
      ); */
      tabsContent.content.push(null);
    });

    return tabsContent;
  }, [formData, activeTab]);

  const isSubmitButtonDisabled = useMemo(() => {
    if (activeTab === undefined || formData.data.length === 0) {
      return false;
    }

    return !travelAssistanceRowValidator(
      formData.data[activeTab],
      isInternationalFlight,
    );
  }, [formData, activeTab]);

  /* Old Code:
  const onChangeCountry = (country) => {
    setFormData((prev) => ({ ...prev, country }));
  };

  const onChangeTab = (t) => {
    setActiveTab(t);
  }; */

  const btnProps = {
    label: configData?.doneCtaLabel,
    color: 'primary',
    variant: 'filled',
    size: 'medium',
    disabled: false,
  };
  const traveleAssistanceApiObj = addonData?.availableSSR[0]?.ssrs[0];
  return (
    <div className="travelAddonSlider">
      <OffCanvas {...travelProps}>
        <div className="skyplus-travel-assistance">
          <div className="skyplus-travel-assistance__heading-container">
            <div className="h0 skyplus-travel-assistance__title">{AEMData?.sliderTitle}</div>
            {/* TD: Update Heading typography */}
            <Heading heading="h5" mobileHeading="h5" containerClass="mt-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: AEMData?.sliderDescription?.html,
                }}
              />
            </Heading>
            <h2
              className="skyplus-travel-assistance__description body-small-regular"
              dangerouslySetInnerHTML={{
                __html: !isInternationalFlight
                  ? AEMData?.domesticSliderDescription?.html?.replace(
                    '@ {}',
                    `<span class="cancellation_price">@ ${price || 0}</span>`,
                  )
                  : AEMData?.internationalSliderDescription?.html?.replace(
                    '@ {}',
                    `<span class="cancellation_price">@ ${price || 0}</span>`,
                  ),
              }}
            />
            <button
              className="skyplus-travel-assistance__viewbtn"
              onClick={() => setBenefitSlide(true)}
              type="button"
            >
              {AEMData?.viewDetailsCtaLabel}
            </button>
          </div>
          {/* <p className="skyplus-travel-assistance__country">
{AEMData?.pleaseSelectCountryLabel}
</p>
<CountryDropdown
onChangeCountry={onChangeCountry}
defaultValue={formData.country.iso}
placeholder={AEMData.countrySearchPlaceholder ?? "Search Country"}
/>

<p className="skyplus-travel-assistance__mandatory">
{AEMData?.mandatoryFieldsLabel}
</p> */}

          {tabsProps.tabs.length === 1 && (
          <div
            className="skyplus-travel-assistance__single"
            dangerouslySetInnerHTML={{
              __html: AEMData?.addDetailsForLabel?.replace(
                '{}',
                tabsProps?.tabs[0]?.title,
              ),
            }}
          />
          )}

          {/* TD: Tabcontainer is commented Due to new Functionality */}
          {/* <TabsContainer {...tabsProps} onChangeTab={onChangeTab} /> */}

          {AEMData && AEMData?.termsAndCondition.map((element, key) => {
            const keyName = `checkbox__${key + 1}`;
            const keyError = `error__${key + 1}`;
            const hasError = get(formData, keyError, null);

            return (
              <div
                className={`skyplus-travel-assistance__content-terms ${
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
                <div className="skyplus-travel-assistance__content-checkboxdata">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: element.description?.html,
                    }}
                  />
                  <div className="skyplus-travel-assistance__checkbox__error">
                    {hasError ? element?.requiredLabel : ''}
                  </div>
                </div>
              </div>
            );
          })}
          <ReadMore
            html={AEMData?.poweredByDisclaimer?.html}
            length={80}
            readMoreLabel={sliderPaneConfigData?.readMoreLabel}
            readLessLabel={sliderPaneConfigData?.readLessLabel}
          />
          <div className="skyplus-travel-assistance__donebtn">
            <OffCanvasFooter
              title={sliderPaneConfigData?.totalPriceLabel}
              titleData={price}
              buttonTitle={AEMData?.sliderButtonLabel}
              btnProps={btnProps}
              buttonIcon={false}
              postButtonIcon="icon-accordion-left-24"
              onSubmit={onSubmitHandler}
              disabled={isSubmitButtonDisabled}
              currencycode={traveleAssistanceApiObj.currencycode}
            />
          </div>
        </div>
        {/* </div> */}
      </OffCanvas>
      {benefitSlide && (
      <TravelAssistanceBenefits
        onClose={() => setBenefitSlide(false)}
        AEMData={addonData?.availableSlidePaneData[0]}
        sliderPaneConfigData={sliderPaneConfigData}
      />
      )}
    </div>
  );
};

TravelAssistanceSlidePane.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  passengerDetails: PropTypes.arrayOf(PropTypes.any),
  addonData: PropTypes.any,
  configData: PropTypes.any,
  ssrCategory: PropTypes.string,
  segmentData: PropTypes.any,
  sliderPaneConfigData: PropTypes.object,
};

export default TravelAssistanceSlidePane;
