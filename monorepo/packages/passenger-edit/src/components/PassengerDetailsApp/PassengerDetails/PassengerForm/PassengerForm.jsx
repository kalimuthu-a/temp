import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import parse from 'html-react-parser';
import { useFormContext } from 'react-hook-form';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import CheckBoxV2 from 'skyplus-design-system-app/src/components/CheckBoxV2/CheckBoxV2';
import SpecialFareBanner from '../SpecialFareBanner/SpecialFareBanner';
import Heading from '../../../../common/HeadingComponent/Heading';
import { AppContext } from '../../../../context/appContext';
import {
  getPaxLabels,
  getSpecialFareCodeLabels,
} from '../../../../functions/getPassengersFormLabels';
import RadiosGroup from './SeatRadios/RadiosGroup';
import PaxInput from './PaxInput/PaxInput';
import '../PassengerDetails.scss';
import GenderRadios from './GenderRadios/GenderRadios';
import PaxDobInput from './PaxInput/PaxDobInput';
import FormCheckBox from './FormCheckBox/FormCheckBox';
import SpecialAssistance from './SpecialAssistance/SpecialAssistance';
import { PASSENGER_TYPE, UMNR_ID_CODE } from '../../../../constants/constants';
import './PassengerForm.scss';
import FFNumber from './FFNumber/FFNumber';
import LoyaltySignupCheckbox from './LoyaltySignupCheckbox/LoyaltySignupCheckbox';
import LoyaltyNote from '../../../LoyaltyNote/LoyaltyNote';
import checkDuplicateNames from './PaxInput/checkDuplicateNames';
import TipsCodeShare from './TipsCodeShare/TipsCodeShare';
import checkDuplicateFF from './FFNumber/checkDuplicateFF';
import checkIfMinorIsSelected from '../../../../functions/checkIfMinorIsSelected';

const PassengerForm = (props) => {
  const {
    paxName,
    cardIndex,
    PaxFields,
    fieldValue,
    paxTypeCode,
    setFieldValue,
    setInputValues,
    hideCardDetails,
    setValidateThisCard,
    isFirstAdultOrSeniorPassenger,
    infantPrice,
    setisMinorSliderOpen,
    minorCheckboxData,
    passengerKey,
  } = props;
  const {
    register,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useFormContext();
  const {
    state: { specialFareCode,
      aemMainData,
      modificationFlow,
      isAuthenticated,
      isSMEUser,
      isAgentUser,
      paxData,
      getPrivacyPolicyData },
  } = useContext(AppContext);
  const {
    nameDescription,
    nameDescriptionForTK,
    errorMsgForNameGuideline,
    forDetailedInfoText,
    clickHerePopUpText,
    noteLabel,
    singleCharacterNamePopup,
    passengerDetails,
    loyaltyMemberAgeInvalidError,
    specialFareDetail,
    specialSeatLabel,
    saveForFutureLabel,
    infantNote,
    duplicateSrctIdErrorMsg,
    duplicateNameError,
    duplicateFFNError,
    codeShare,
    authorisationconsent,
    editSelectionLabel,
  } = aemMainData;

  const codeShareDetails = codeShare?.find((obj) => paxData?.bookingDetails?.carrierCode === obj?.carrierCode);
  const paxLabels = getPaxLabels(passengerDetails, paxTypeCode);
  const seatSelectTxt = paxLabels?.seatSelectMessage?.html
    ? parse(paxLabels?.seatSelectMessage?.html)
    : '';
  const specialFareLabels = getSpecialFareCodeLabels(
    specialFareDetail,
    specialFareCode,
  );
  const disclaimer = paxLabels?.disclaimerText?.html
    ? parse(paxLabels?.disclaimerText?.html)
    : '';
  const { heading, description } = specialFareLabels;
  const {
    paxRadioData,
    paxFieldData,
    paxSpecialFareData,
    paxStudentData,
    adultExtraSeatsData,
    srctExtraSeatsData,
    childExtraSeatsData,
    paxInfantTaggedData,
    paxFutureBookingData,
    paxSpecialAssistanceData,
    paxFFNumberData,
    loyaltySignupData } = PaxFields;
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isMinorConsent, SetIsMinorConsent] = useState(false);
  const openSliderPopup = (e) => {
    e.preventDefault();
    setIsSliderOpen(true);
  };
  const onSliderPopUpTipCloseHandler = () => {
    setIsSliderOpen(false);
  };

  const onEveryInputChange = (name, value) => {
    setValidateThisCard(`${name}-${value}`);
    setInputValues(name, value);
  };

  const errorMsgs = {
    ADT_LOYALTY_AGE_LIMIT_ERROR_MSG: loyaltyMemberAgeInvalidError,
    ADT_AGE_LIMIT_ERROR_MSG: passengerDetails?.find(
      ({ typeCode, discountCode }) => typeCode === PASSENGER_TYPE.ADULT && discountCode === null,
    )?.validationMessage,
    SRCT_AGE_LIMIT_ERROR_MSG: passengerDetails?.find(
      ({ typeCode, discountCode }) => typeCode === PASSENGER_TYPE.ADULT
        && discountCode === PASSENGER_TYPE.SENIOUR,
    )?.validationMessage,
    UMNR_AGE_LIMIT_ERROR_MSG: passengerDetails?.find(
      ({ typeCode }) => typeCode === UMNR_ID_CODE,
    )?.validationMessage,
    CHD_AGE_LIMIT_ERROR_MSG: passengerDetails?.find(
      ({ typeCode }) => typeCode === PASSENGER_TYPE.CHILD,
    )?.validationMessage,
    IFT_AGE_LIMIT_ERROR_MSG: passengerDetails?.find(
      ({ typeCode }) => typeCode === PASSENGER_TYPE.INFANT,
    )?.validationMessage,
  };

  const nameGuidelineValidation = (val) => {
    if (val.trim().length < codeShareDetails?.minCharLengthName
    && codeShare?.some((obj) => paxData?.bookingDetails?.carrierCode === obj?.carrierCode)
    ) return errorMsgForNameGuideline;
  };

  const duplicateNameValidation = () => {
    const values = getValues('userFields');
    const error = checkDuplicateNames(errors, values, setError, clearErrors, duplicateNameError, cardIndex);
    return error || !error;
  };

  const duplicateFFValidation = () => {
    const values = getValues('userFields');
    const error = checkDuplicateFF({ errors, passengers: values, setError, clearErrors, duplicateFFNError, cardIndex });
    return error || !error;
  };

  const isChildPolicy = () => {
    const isChild = paxTypeCode === PASSENGER_TYPE.CHILD
      && !paxData?.bookingDetails?.carrierCode
      && specialFareCode !== UMNR_ID_CODE;
    if (isChild) {
      return (
        <div className={hideCardDetails ? 'd-none' : ''}>
          <div className="passenger-form__seat-info mb-8">
            <div className="content">{seatSelectTxt}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const saveForFuture = () => {
    const isFuture = isAuthenticated
      && !!paxFutureBookingData.length
      && !modificationFlow
      && !isSMEUser
      && !isAgentUser;
    if (isFuture) {
      return (
        <div className={hideCardDetails ? 'd-none' : ''}>
          {paxFutureBookingData.map((pax) => {
            return !pax.isFromFavList ? (
              <FormCheckBox
                key={pax.id}
                id={pax.id}
                containerClass="w-100 d-flex
            flex-row-reverse justify-content-between align-items-center align-items-center
            text-primary body-medium-regular mb-6 mb-md-12 save-for-future-check"
                register={register}
                registerKey={pax.name}
              >
                <div className="link-small">{saveForFutureLabel}</div>
              </FormCheckBox>
            ) : null;
          })}
        </div>
      );
    }
    return null;
  };

  const getInfantDescWithPrice = (note) => {
    if (note?.html) {
      note.html = note?.html?.replace('{amount}', infantPrice?.toLocaleString());
    }
    return note;
  };

  const onChangeHandler = (val) => {
    SetIsMinorConsent(val);
    onEveryInputChange(`userFields.${cardIndex}.minorConsent`, val);
  };

  React.useEffect(() => {
    let isMinoConsent = false;
    if (getPrivacyPolicyData && !getPrivacyPolicyData?.errors) {
      isMinoConsent = getPrivacyPolicyData?.some((x) => (x.MinorConsent === true || x.InfantConsent === true) || x.PassengerKey === passengerKey);
      onEveryInputChange(`userFields.${cardIndex}.minorConsent`, isMinoConsent);
    }
    SetIsMinorConsent(isMinoConsent);
  }, []);

  const isChild = paxTypeCode === PASSENGER_TYPE.CHILD || paxTypeCode === PASSENGER_TYPE.INFANT;

  return (
    <div
      className={
        hideCardDetails
          ? ''
          : 'accordion-body p-6 py-md-10 px-md-12 rounded-bottom bg-white paxinputs-wrapper'
      }
    >
      <div className={hideCardDetails ? 'd-none' : ''}>
        {paxTypeCode === PASSENGER_TYPE.INFANT
        && <LoyaltyNote note={noteLabel} description={getInfantDescWithPrice(infantNote)} />}
      </div>
      {isSliderOpen && (
        <OffCanvas
          onClose={onSliderPopUpTipCloseHandler}
        >
          <TipsCodeShare popupData={singleCharacterNamePopup} />
        </OffCanvas>
      )}

      {paxRadioData.map((pax) => {
        return (
          <div className={hideCardDetails ? 'd-none' : ''}>
            <GenderRadios
              errors={errors}
              register={register}
              cardIndex={cardIndex}
              onEveryInputChange={onEveryInputChange}
              {...pax}
            />
          </div>
        );
      })}
      { paxData?.bookingDetails?.carrierCode
        ? (
          <div className={hideCardDetails ? 'd-none' : ''}>
            <div className="passenger-form__singlechar-info rounded my-8 h0 p-6 body-small-regular">
              <p><b>{noteLabel}:</b></p>
              {nameDescription && <p>*{nameDescription}</p>}
              {nameDescriptionForTK && <p>*{nameDescriptionForTK}</p>}
              {forDetailedInfoText
              && (
              <p>{forDetailedInfoText}
                {clickHerePopUpText
                  && (
                  <button
                    className="passenger-form__clickBtn"
                    type="button"
                    onClick={openSliderPopup}
                  >{clickHerePopUpText}
                  </button>
                  )}
              </p>
              )}
            </div>
          </div>
        )
        : (
          <div>
            {!hideCardDetails ? <Heading headingSubTitle={nameDescription} /> : null}
          </div>
        )}

      {paxFieldData.length ? (
        <div
          className={
            hideCardDetails ? 'd-none' : 'd-flex flex-column flex-md-row'
          }
        >
          {paxFieldData
            .filter((pax) => pax.type === 'text' && pax.firstThree)
            .map((pax) => (
              <PaxInput
                pax={pax}
                key={pax.paxKey}
                cardIndex={cardIndex}
                onEveryInputChange={onEveryInputChange}
                duplicateNameValidation={duplicateNameValidation}
                nameGuidelineValidation={nameGuidelineValidation}
              />
            ))}
        </div>
      ) : null}
      {!!paxSpecialFareData.length && (
        <div
          className={
            hideCardDetails ? 'd-none' : 'd-flex flex-column flex-md-row'
          }
        >
          {paxSpecialFareData
            .filter(
              (pax) => pax.isDOB
                || (pax.type === 'text'
                  && !pax.firstThree
                  && !pax.specialFareCode),
            )
            .map((pax) => {
              return pax.isDOB ? (
                <PaxDobInput
                  pax={pax}
                  key={pax.paxKey}
                  cardIndex={cardIndex}
                  onEveryInputChange={onEveryInputChange}
                  errorMsgs={errorMsgs}
                  specialFareCode={specialFareCode}
                />
              ) : (
                <PaxInput
                  pax={pax}
                  specialFares
                  key={pax.paxKey}
                  onEveryInputChange={onEveryInputChange}
                />
              );
            })}
        </div>

      )}
      {!!paxStudentData.length && (
        <div className={hideCardDetails ? 'd-none' : ''}>
          <Heading
            headingSubTitle={heading}
            subHeadingClass="mt-8"
          />
          <div className="d-flex flex-column flex-md-row">
            {paxStudentData.map((pax) => {
              if (
                pax.type === 'text'
                && !pax.firstThree
                && pax.specialFareCode
              ) {
                return (
                  <PaxInput
                    pax={pax}
                    key={pax.paxKey}
                    onEveryInputChange={onEveryInputChange}
                    duplicateSrctIdErrorMsg={duplicateSrctIdErrorMsg}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
      {!!adultExtraSeatsData.length && (
        <>
          {!hideCardDetails ? (
            <Heading
              headingSubTitle={specialSeatLabel}
              subHeadingClass="mt-8"
            />
          ) : null}
          {adultExtraSeatsData.map((pax) => {
            const value = !isEmpty(fieldValue)
              ? fieldValue
              : pax?.selectedValue;
            return (
              <RadiosGroup
                isAdultPaxType
                errors={errors}
                fieldValue={value}
                register={register}
                cardIndex={cardIndex}
                paxName={paxName}
                disabled={modificationFlow}
                paxAllData={pax.paxAllAdults}
                setFieldValue={setFieldValue}
                paxType={PASSENGER_TYPE.ADULT}
                hideCardDetails={hideCardDetails}
                onEveryInputChange={onEveryInputChange}
                {...pax}
              />
            );
          })}
        </>
      )}
      {!!srctExtraSeatsData.length && (
        <>
          {!hideCardDetails ? (
            <Heading
              headingSubTitle={specialSeatLabel}
              subHeadingClass="mt-8"
            />
          ) : null}
          {srctExtraSeatsData.map((pax) => {
            const value = !isEmpty(fieldValue)
              ? fieldValue
              : pax?.selectedValue;
            return (
              <RadiosGroup
                isSRCTPaxType
                errors={errors}
                fieldValue={value}
                register={register}
                cardIndex={cardIndex}
                paxName={paxName}
                disabled={modificationFlow}
                paxAllData={pax.paxAllSRCT}
                setFieldValue={setFieldValue}
                paxType={PASSENGER_TYPE.SENIOUR}
                hideCardDetails={hideCardDetails}
                onEveryInputChange={onEveryInputChange}
                {...pax}
              />
            );
          })}
        </>
      )}
      {!!childExtraSeatsData.length && (
        <>
          {!hideCardDetails ? (
            <Heading
              headingSubTitle={specialSeatLabel}
              subHeadingClass="mt-8"
            />
          ) : null}
          {childExtraSeatsData.map((pax) => {
            const value = !isEmpty(fieldValue)
              ? fieldValue
              : pax?.selectedValue;
            return (
              <RadiosGroup
                isChildPaxType
                errors={errors}
                fieldValue={value}
                register={register}
                cardIndex={cardIndex}
                paxName={paxName}
                disabled={modificationFlow}
                paxAllData={pax.paxAllChild}
                setFieldValue={setFieldValue}
                paxType={PASSENGER_TYPE.CHILD}
                hideCardDetails={hideCardDetails}
                onEveryInputChange={onEveryInputChange}
                {...pax}
              />
            );
          })}
        </>
      )}
      {!!paxInfantTaggedData.length && (
        <div className={hideCardDetails ? 'd-none' : ''}>
          <Heading headingSubTitle={disclaimer} subHeadingClass="mt-8" />
          {paxInfantTaggedData.map((pax) => {
            return (
              <GenderRadios
                required=""
                errors={errors}
                register={register}
                cardIndex={cardIndex}
                disabled={modificationFlow}
                onEveryInputChange={() => { }}
                {...pax}
              />
            );
          })}
        </div>
      )}
      {(isChild && !isFirstAdultOrSeniorPassenger)
        && (
        <div className={hideCardDetails ? 'd-none' : ''}>
          <CheckBoxV2
            name="concent"
            id="minor-concent"
            checked={isMinorConsent}
            onChangeHandler={(e) => onChangeHandler(e, cardIndex)}
            description={authorisationconsent?.description?.html}
            descClass="body-small-regular"
            containerClass="mb-8 mb-md-6"
          />
        </div>
        )}

      {isChildPolicy()}
      {!hideCardDetails ? (
        <SpecialFareBanner
          specialFareCode={specialFareCode}
          description={description}
        />
      ) : null}

      {saveForFuture()}

      {!!paxSpecialAssistanceData.length && (
        <div className={hideCardDetails ? 'd-none' : ''}>
          {paxSpecialAssistanceData.map((pax) => (
            (modificationFlow && props?.isWheelChairDisable) ? '' : <SpecialAssistance key={pax.name} {...pax} />
          ))}
        </div>
      )}

      <div className={hideCardDetails || paxFFNumberData.hidden ? 'd-none' : ''}>
        <FFNumber
          duplicateFFValidation={duplicateFFValidation}
          loyaltySignupName={loyaltySignupData.loyaltySignupName}
          cardIndex={cardIndex}
          onEveryInputChange={onEveryInputChange}
          {...paxFFNumberData}
        />
      </div>

      {isFirstAdultOrSeniorPassenger
        && (
        <LoyaltySignupCheckbox
          cardIndex={cardIndex}
          hideCardDetails={hideCardDetails}
          ffName={paxFFNumberData.ffName}
          onEveryInputChange={onEveryInputChange}
          {...loyaltySignupData}
        />
        )}

      {checkIfMinorIsSelected(minorCheckboxData, passengerKey) && !hideCardDetails
        ? (
          <div className="special-fare-banner rounded my-8 h0 p-6 body-small-regular">
            <div>{parse(authorisationconsent?.description?.html ? authorisationconsent?.description?.html : '')}
            </div>
            <div className="minor-edit-button">
              <button onClick={() => setisMinorSliderOpen(true)} className={modificationFlow ? 'btn disabled' : 'btn'} type="button" disabled={modificationFlow}>
                <i className="icon-edit" /> {editSelectionLabel}
              </button>
            </div>
          </div>
        )
        : ''}
    </div>
  );
};

PassengerForm.propTypes = {
  passengerKey: PropTypes.string,
  paxName: PropTypes.string,
  paxTypeCode: PropTypes.string,
  cardIndex: PropTypes.any,
  setValidateThisCard: PropTypes.func,
  fieldValue: PropTypes.shape({}),
  setFieldValue: PropTypes.func,
  hideCardDetails: PropTypes.bool,
  validateThisCard: PropTypes.func,
  setInputValues: PropTypes.func,
  PaxFields: PropTypes.shape({
    paxRadioData: [],
    paxFieldData: [],
    paxSpecialFareData: [],
    paxStudentData: [],
    adultExtraSeatsData: [],
    srctExtraSeatsData: [],
    childExtraSeatsData: [],
    paxInfantTaggedData: [],
    paxFutureBookingData: [],
    paxSpecialAssistanceData: [],
    paxFFNumberData: {},
    loyaltySignupData: {},
  }),
  isFirstAdultOrSeniorPassenger: PropTypes.any,
  infantPrice: PropTypes.number,
  setisMinorSliderOpen: PropTypes.func,
  minorCheckboxData: PropTypes.any,
  isWheelChairDisable: PropTypes.any,
};

export default PassengerForm;
