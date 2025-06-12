import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import CheckBox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import { paxCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import AddonTabConatiner from 'skyplus-design-system-app/dist/des-system/TabsContainer';

import FormField from './FormField';
import useAppContext from '../../hooks/useAppContext';
import { webcheckinActions } from '../../context/reducer';
import Validator from '../../utils/Validation/Validator';
import InfoAlert from '../../components/common/Alerts/InfoAlert';

const Form = ({
  isInternational,
  index,
  schema,
  visaFormSchema,
  contactInfoSchema,
  passenger,
  openMinorConsent,
  isEmergencyContactForm,
  emergencyContactInfoSchema,
  passengers
}) => {
  const {
    state: {
      formErrors,
      formData,
      copyForAll,
      aemModel,
      minorConsentSelection,
      emergencyDetails,
      emergencyDetailsFormError,
      getMinorConsentData,
    },
    aemLabel,
    dispatch,
  } = useAppContext();

  const aemLabels = aemModel?.checkinPassenger;

  const errors = formErrors[index] || {};
  const data = formData[index] || {};
  const [consent, setConsent] = useState(data?.consent ?? false);

  const [copyPassport, setCopyPassport] = useState(false);

  const allVisaIds = formData.map((p) => p.visaUidNumber ?? '').filter(Boolean);
  const allVisaUniqueIds = new Set([...allVisaIds]);
  const allpassportNumbers = formData
    .map((p) => p.passportNumber ?? '')
    .filter(Boolean);

  const allpassportUniueNumbers = new Set([...allpassportNumbers]);

  if (allVisaIds.length !== allVisaUniqueIds.size && isInternational) {
    errors.visaUidNumber = aemLabel(
      'checkinPassenger.passportNumberDupicateError',
      'Duplicate Visa Number',
    );
  }

  if (
    allpassportNumbers.length !== allpassportUniueNumbers.size &&
    isInternational
  ) {
    errors.passportNumber = aemLabel(
      'checkinPassenger.passportNumberDupicateError',
      'Duplicate Passport Number',
    );
  }

  const aemData = useMemo(() => {
    return {
      visaOptions: [
        {
          label: aemLabel('checkinPassenger.declarationMessages.0.title'),
          value: 'no',
        },
        {
          value: 'yes-temp',
          label: aemLabel('checkinPassenger.declarationMessages.[1].title'),
        },
        {
          label: aemLabel('checkinPassenger.declarationMessages.2.title'),
          value: 'yes',
        },
      ],
      copyPassengersLabel: aemLabel('checkinPassenger.copyPassengersLabel'),
      addonsLabel: aemLabel('checkinPassenger.addonsLabel', 'Add-ons'),
      copyPassportDetails: aemLabel(
        'checkinPassenger.copyPassportDetails',
        'Copy from passport details (Exclusing Visa number & expiration date',
      ),
      bookingIsAuthorised: aemLabel(
        'checkinPassenger.minorAuthorization',
        'This booking is authorised by parent/legal guardian',
      ),
      editSelection: aemLabel('checkinPassenger.editSelectionLabel'),
    };
  }, [aemLabel]);

  /**
   * @param {import('react').ChangeEvent<HTMLInputElement>} e
   */
  const handleChange = (e, schemaType) => {
    const { name, value } = e.target;
    let error = {
      [name]: Validator.validateSingle(schemaType[name], value, data),
    };
    if (name === 'country') {
      const _err = Validator.validateSingle(schemaType.mobile, data.mobile, {
        ...data,
        [name]: value,
      });

      error = { mobile: _err };
    }

    dispatch({
      type: webcheckinActions.ON_FORM_DATA_CHANGE,
      payload: {
        index,
        values: { name, value },
        error,
      },
    });
  };
  const handleChangeEmergencyForm = (e, schemaType) => {
    const { name, value } = e.target;
    const error = {
      [name]: Validator.validateSingle(schemaType[name], value, emergencyDetails),
    };

    if ([name] && value.length == 0) {
      error[name] = '';
    }
    dispatch({
      type: webcheckinActions.EMERGENCY_FORM_UPADTE,
      payload: {
        index,
        values: { name, value },
        error,
      },
    });
  };

  const onChangeRadioBox = (e) => {
    dispatch({
      type: webcheckinActions.ON_FORM_DATA_CHANGE,
      payload: {
        index,
        values: { name: 'visa', value: e },
        error: '',
      },
    });
  };

  const onChangeCopyForAll = () => {
    dispatch({
      type: webcheckinActions.COPY_FOR_ALL,
      payload: !copyForAll,
    });
  };

  const { addonTabContainer } = useMemo(() => {
    const _addonTabContainer = {
      tabs: [],
      content: [],
    };

    passenger?.segments?.forEach((segment) => {
      let _ssrData = [];

      const { passengerSegment, designator } = segment || {
        passengerSegment: { ssrs: [], seats: [] },
      };

      _addonTabContainer.tabs.push({
        title: `${designator?.origin}-${designator?.destination}`,
      });

      passengerSegment?.seatsAndSsrs?.forEach((ssr) => {
        const { ssrCode, ssrCategory, ssrName, count } = ssr;

        const iconSet = {
          baggage: 'icon-additional-baggage',
          Meal: 'icon-6e-eats',
          SPEQ: 'icon-sports-equipment',
          PROT: 'icon-baggage-tag',
          BRB: 'icon-lifestyle-assistance',
          ABHF: 'icon-additional-baggage',
          IFNR: 'icon-cancellation-assistance',
          FFWD: 'icon-fast-forward',
          SRCT: 'icon-senior-citizen',
          WCHR: 'icon-Wheelchair',
          SEAT: 'icon-seat-single',
        };

        if (['EXST', 'EXST2'].includes(ssrCode)) {
          const icons = [`${iconSet.SEAT} i-1`];

          const { ExtraSeatTag } = passenger;

          _ssrData.push({
            ssrCode,
            ssrName: `${ExtraSeatTag} Seat(s)`,
            ssrCategory,
            icons:
              ExtraSeatTag?.toLowerCase() === 'double'
                ? icons.concat(`${iconSet.SEAT} i-2`)
                : icons.concat([`${iconSet.SEAT} i-2`, `${iconSet.SEAT} i-3`]),
          });
        } else {
          _ssrData.push({
            ssrCode,
            ssrName: `${count} ${ssrName}`,
            ssrCategory,
            icons: [
              iconSet[ssrCategory] || iconSet[ssrCode] || 'icon-fast-forward',
            ],
          });
        }

        const ssrDataAccul = _ssrData.reduce(
          (acc, curr) => {
            if (!acc.ssrCodes.includes('BUSN')) {
              return {
                ssrCodes: [...acc.ssrCodes, curr.ssrCode],
                ssrData: [...acc.ssrData, curr],
              };
            }

            return acc;
          },
          {
            ssrCodes: [],
            ssrData: [],
          },
        );

        _ssrData = ssrDataAccul.ssrData.filter(
          (_ssr) => !['XSAT'].includes(_ssr.ssrCode),
        );
      });

      passengerSegment?.seats?.forEach((seat) => {
        const { unitDesignator } = seat;

        _ssrData.push({
          ssrCode: 'SEAT',
          ssrName: `${unitDesignator}`,
          ssrCategory: '',
          icons: ['icon-seat-single'],
        });
      });

      const { handBaggageWeight, checkinBaggageWeight } =
        passenger?.fareIncludedBaggage || {};

      if (handBaggageWeight > 0) {
        _ssrData.push({
          icons: ['icon-cabin-bag'],
          ssrName: `${handBaggageWeight} KG Cabin Baggage`,
        });
      }

      if (checkinBaggageWeight > 0) {
        _ssrData.push({
          icons: ['icon-checkin-bag'],
          ssrName: `${checkinBaggageWeight} KG Checkin Baggage`,
        });
      }

      _addonTabContainer.content.push(
        _ssrData.map((ssr) => (
          <ul>
            <li key={ssr.ssrCode}>
              {ssr.icons.map((r) => (
                <i key={r} className={`sky-icons sm icon ${r}`} />
              ))}
              {ssr.ssrName}
            </li>
          </ul>
        )),
      );
    });

    return {
      addonTabContainer: _addonTabContainer,
    };
  }, [passenger]);

  const copyPassportFieldHandler = () => {
    setCopyPassport((prev) => !prev);

    if (!copyPassport) {
      const passportDetails = {
        visaFirstName: data?.passportFirstName,
        visaLastName: data?.passportLastName,
        visaGender: data?.passportGender,
        visaDateOfBirth: data?.passportDOB,
        visaCountry: data?.passportCountry,
        visaNationality: data?.passportNationality,
        visaCountryOfResidence: data?.residenceCountry,
      };

      dispatch({
        type: webcheckinActions.COPY_PASSPORT_DETAILS_TO_VISA,
        payload: {
          index,
          passportDetails,
        },
      });
    }
  };

  const handleConsentChange = () => {
    setConsent(!consent);

    dispatch({
      type: webcheckinActions.ON_FORM_DATA_CHANGE,
      payload: {
        index,
        values: { name: 'consent', value: !consent },
        error: {},
      },
    });
  };

  const { passengerTypeCode, passengerKey } = passenger;

  const showConsentCheckbox = useMemo(() => {
    return [paxCodes.children.code, paxCodes.infant.code].includes(
      passengerTypeCode,
    );
  }, []);

  const isInfant = passengerTypeCode === paxCodes.infant.code;

  const onKeyUpHandler = (e) => {
    if (e.key === 'Enter') {
      openMinorConsent();
    }
  };

  React.useEffect(() => {
    let isMinoConsent = false;
    if (!getMinorConsentData?.errors) {
      isMinoConsent = getMinorConsentData?.some((x) => x.MinorConsent === true && x.PassengerKey === passengerKey);
      setConsent(isMinoConsent);
      let childConsent=getMinorConsentData?.filter((x) => x.MinorConsent === true );
      childConsent?.forEach((item) =>{
        let passengerIndex=passengers?.findIndex(x=>x.passengerKey===item?.PassengerKey);
        dispatch({
          type: webcheckinActions.ON_FORM_DATA_CHANGE,
          payload: {
            index: passengerIndex,
            values: { name: 'consent', value: item?.MinorConsent },
            error: {},
          },
        });
      })
    }
  }, []);

  return (
    <div>
      {!isInfant &&
        <>
          <div className="d-flex flex-column flex-md-row gap-8">
            <div className="phonewithcountry w-100">
              {contactInfoSchema && Object.entries(contactInfoSchema).map(
                ([fieldName, { className, ...fieldConfig }]) => (
                  <div key={fieldName} className={`form-field ${className}`}>
                    <FormField
                      fieldConfig={fieldConfig}
                      fieldName={fieldName}
                      data={data}
                      errors={errors}
                      onChange={(e) => {
                        handleChange(e, contactInfoSchema);
                      }}
                    />
                  </div>
                ),
              )}
              {emergencyContactInfoSchema && Object.entries(emergencyContactInfoSchema).map(
                ([fieldName, { className, ...fieldConfig }]) => (
                  <div key={fieldName} className={`form-field ${className}`}>
                    <FormField
                      fieldConfig={fieldConfig}
                      fieldName={fieldName}
                      data={emergencyDetails}
                      errors={emergencyDetailsFormError || {}}
                      onChange={(e) => {
                        handleChangeEmergencyForm(e, emergencyContactInfoSchema);
                      }}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
          {index === 0 && formData?.length > 1 && (
            <CheckBox
              onChangeHandler={onChangeCopyForAll}
              checked={copyForAll}
              id="copy-for-all-checkbox"
            >
              {aemData?.copyPassengersLabel}
            </CheckBox>
          )}
        </>
      }
      {isInternational && (
        <div>
          <Text variation="body-large-regular" containerClass="my-8">
            {aemLabels?.passportDetailsLabel}
          </Text>
          <div className="passport-form">
            {Object.entries(schema)?.map(([fieldName, fieldConfig]) => (
              <div key={fieldName} className="form-field">
                <FormField
                  fieldConfig={fieldConfig}
                  fieldName={fieldName}
                  data={data}
                  errors={errors}
                  onChange={(e) => handleChange(e, schema)}
                />
              </div>
            ))}
          </div>
          <div className="declartions my-8">
            <RadioBoxGroup
              items={aemData?.visaOptions}
              onChange={onChangeRadioBox}
              selectedValue={data?.visa}
              containerClassName="d-flex flex-column"
            />
          </div>
          {data.visa === 'yes' && (
            <div className="visa-details">
              <Text variation="body-large-regular" containerClass="my-8">
                {aemLabels?.visaDetailsLabel}
              </Text>
              <Text variation="body-medium-regular" containerClass="my-8">
                <div
                  dangerouslySetInnerHTML={{
                    __html: aemLabels?.visaDetailsDescription?.html,
                  }}
                />
              </Text>
              <CheckBox
                containerClass="mb-8"
                onChangeHandler={copyPassportFieldHandler}
                checked={copyPassport}
                id={`${index}-copy-passport`}
              >
                {aemData.copyPassportDetails}
              </CheckBox>
              <div className="visa-form">
                {Object.entries(visaFormSchema).map(
                  ([fieldName, fieldConfig]) => (
                    <div key={fieldName} className="form-field">
                      <FormField
                        fieldConfig={fieldConfig}
                        fieldName={fieldName}
                        data={data}
                        errors={errors}
                        onChange={(e) => handleChange(e, visaFormSchema)}
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {!isEmergencyContactForm &&
      <div className="separator" />}
      {!isInfant && !isEmergencyContactForm && (
        <div className="addon-container">
          <div className="addon-container-header mb-4">
            {aemData.addonsLabel}
          </div>

          <AddonTabConatiner
            showSingleTabBtn={false}
            defaultActiveTab={0}
            tabs={addonTabContainer.tabs}
            content={addonTabContainer.content}
          />
        </div>
      )}

      {minorConsentSelection.has(passengerKey) && (
        <InfoAlert containerClassName="consent-container">
          <div className="heading">{aemData.bookingIsAuthorised}</div>
          <div
            className="edit"
            onClick={openMinorConsent}
            tabIndex={0}
            onKeyUp={onKeyUpHandler}
            aria-label="Edit Monor Consent"
            role="button"
          >
            <Icon className="icon-edit" />
            <div className="anchor">{aemData.editSelection}</div>
          </div>
        </InfoAlert>
      )}
      {showConsentCheckbox && (
        <CheckBox
          checked={consent}
          onChangeHandler={handleConsentChange}
          containerClass="booking-is-authorised"
          id={`${index}-booking-is-authorised`}
        >
          {aemData.bookingIsAuthorised}
        </CheckBox>
      )}
    </div>
  );
};

Form.propTypes = {
  isInternational: PropTypes.bool,
  index: PropTypes.number,
  schema: PropTypes.object,
  visaFormSchema: PropTypes.object,
  contactInfoSchema: PropTypes.object,
  passenger: PropTypes.object,
  openMinorConsent: PropTypes.func,
  passengers: PropTypes.array
};

export default Form;
