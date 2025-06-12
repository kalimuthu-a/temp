/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useContext, useEffect, useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { COOKIE_KEYS } from 'skyplus-design-system-app/src/constants';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import { AEM_STATIC_DATA, ERROR_MESSAGE } from './constant';
import BasicDetails from './BasicDetails';
import ContactDetails from './ContactDetails';
import analyticEvents from '../../utils/analyticEvents';
import {
  getCountryList,
  getStateList,
  getMyProfileAemData,
  getMyProfileApi,
  updateMyProfileApi,
} from '../../services/myProfile.service';
import { ProfileContext } from './ProfileContext';
import { profileActions } from './ProfileReducer';
import {
  AGENT,
  MEMBER,
  SME_ADMIN,
  SME_USER,
  SOMETHING_WENT_WRONG,
} from '../../constants/common';
import regexConstant from '../../constants/regex';
import {
  dateToConvert,
  dobMinMaxDate,
  getLoyaltyTierLabel,
  isFutureDate,
  isHistoryDate,
  scrollToTop,
  capitalize,
} from '../../utils/utilFunctions';
import Loader from '../../components/common/Loader/Loader';
import { aaEvents, eventNames } from '../../utils/analyticsConstants';
import profileBtnClickAnalytics from '../../functions/profileBtnClickAnalytics';

export const MyProfile = () => {
  const { state, dispatch } = useContext(ProfileContext);
  const {
    profileData,
    initialName,
    userType,
    originalProfileData,
    myProfileAemData,
    isButtonDisabled,
    toast,
    apiError,
  } = state;

  const [loyaltyUiInfo, setLoyaltyUiInfo] = useState(null);
  const [loader, setLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [enableEditing, setEnableEditing] = useState(true);

  const USER_TYPES = {
    USER: MEMBER,
    AGENT,
    SME_USER,
    SME_ADMIN,
  };

  const isMember = userType === USER_TYPES.USER;
  const isAgent = userType === USER_TYPES.AGENT;

  // Assume you have access to dispatch and state
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const validateField = (field, subfield, value, index = undefined) => {
    let errorText = '';

    // Apply validation rules based on field and subfield
    if (field === 'details') {
      switch (subfield) {
        case 'dateOfBirth': {
          if (value || userType === USER_TYPES.SME_USER) {
            // Validate date format
            if (!value.match(regexConstant.DOB_FORMAT)) {
              errorText = `${capitalize(subfield)} ${myProfileAemData?.datePatternText}`;
            }
            // Validate date range
            const { minDate, maxDate } = dobMinMaxDate();
            const inputNewDate = new Date(value);
            if (
              inputNewDate < minDate
              || inputNewDate > maxDate
              || inputNewDate === ''
              || inputNewDate.toString() === 'Invalid Date'
            ) {
              errorText = `${myProfileAemData?.invalidDateLabel}`;
            }
          }
          break;
        }
        case 'state':
        case 'nationality':
          if (
            value
            && !value.match(regexConstant.NAME_ONLY_ALPHABET_SPACE_NEW)
          ) {
            errorText = `${capitalize(subfield)} ${myProfileAemData.alphabetsSpaces}`;
          }
          break;
        default:
          break;
      }
    } else if (field === 'travelDocuments') {
      switch (subfield) {
        case 'number':
          if (value && !value.match(regexConstant.ALPHA_NUMERIC)) {
            errorText = `${capitalize(subfield)} ${myProfileAemData?.alphanumericText
            }`;
          }
          break;
        case 'expirationDate':
          if (value && !regexConstant.DOB_FORMAT.test(value)) {
            // Assuming same date format
            errorText = `Expiration Date ${myProfileAemData?.datePatternText}`;
          } else if (isHistoryDate(value)) {
            errorText = `${myProfileAemData?.invalidDateLabel}`;
          }
          break;
        case 'issuedDate':
          if (value && !regexConstant.DOB_FORMAT.test(value)) {
            // Assuming same date format
            errorText = `Issued Date ${myProfileAemData?.datePatternText}`;
          } else if (isFutureDate(value)) {
            errorText = `${myProfileAemData?.invalidDateLabel}`;
          }
          break;
        case 'name':
          if (
            value
            && !value.match(regexConstant.NAME_ONLY_ALPHABET_SPACE_NEW)
          ) {
            errorText = `${capitalize(subfield)} ${myProfileAemData?.alphabetsSpaces
            }`;
          }
          break;
        default:
          break;
      }
    } else if (field === 'name') {
      switch (subfield) {
        case 'First':
        case 'Last':
          if (!value) {
            errorText = myProfileAemData?.fieldErrorValidationMessage || ERROR_MESSAGE.FIELD_MANDATORY;
          } else if (
            value
            && !value.match(regexConstant.NAME_ONLY_ALPHABET_SPACE_NEW)
          ) {
            errorText = `${capitalize(subfield)} ${myProfileAemData?.alphabetsSpaces
            }`;
          }
          break;
        default:
          break;
      }
    } else if (field === 'phoneNumbers') {
      if (subfield === 'number' && value === '') {
        errorText = '';
      } else if (subfield === 'number' && !value.match(regexConstant.PHONE)) {
        errorText = myProfileAemData.validPhoneNumber;
      }
    } else if (
      field === 'emailAddresses'
      && subfield === 'email'
      && value
      && !value.match(regexConstant.EMAIL)
    ) {
      errorText = myProfileAemData.validEmailAddress;
    }
    // Dispatch error with specific index for field
    if (index !== undefined) {
      dispatch({
        type: profileActions.SET_ERRORS,
        payload: {
          [subfield]: {
            ...state.error?.[subfield],
            [index]: errorText,
          },
        },
      });
    } else {
      dispatch({
        type: profileActions.SET_ERROR,
        payload: { [subfield]: errorText },
      });
    }

    return errorText;
  };

  const basicDetailsProps = { userType, USER_TYPES };
  const contactProps = { userType, USER_TYPES };
  const imagePresent = false;
  // eslint-disable-next-line default-param-last
  const getUpdatedFields = (original = {}, modified, isTopLevel = true) => {
    if (Array.isArray(modified)) {
      const changesExist = Object.keys(modified).some(
        (item, index) => Object.keys(getUpdatedFields(original?.[index] || {}, item, false))
          .length > 0,
      );
      return changesExist ? modified : [];
    }

    const changes = {};
    for (const key in modified) {
      if (modified[key] !== null && typeof modified[key] === 'object') {
        const nestedChanges = getUpdatedFields(
          original?.[key] || {},
          modified[key],
          false,
        );

        if (Object.keys(nestedChanges).length > 0) {
          changes[key] = nestedChanges;
        }
      } else if (modified[key] !== original?.[key]) {
        changes[key] = modified[key];
      }
    }

    if (
      (isTopLevel && changes.name !== undefined && changes.name !== null)
      || (changes.details !== undefined && changes.details !== null)
    ) {
      changes[AEM_STATIC_DATA.PERSON_DETAILS] = {
        type: modified?.type,
        status: modified?.status,
        notificationPreference: 0,
        details: modified?.details,
        name: modified?.name,
      };

      delete changes.details;
      delete changes.name;
      delete changes.type;
      delete changes.status;
    }

    return changes;
  };

  function processProfileData(data) {
    // Make a copy of the data
    const processedData = { ...data };

    // Process 'name' field in 'travelDocuments'
    if (
      processedData.travelDocuments
      && processedData.travelDocuments.length > 0
    ) {
      const travelDoc = processedData.travelDocuments[0];
      if (travelDoc.name && typeof travelDoc.name === 'object') {
        const fullName = `${travelDoc.name.First || ''} ${travelDoc.name.Last || ''
        }`.trim();
        processedData.travelDocuments[0] = {
          ...travelDoc,
          name: fullName,
          issuedDate: travelDoc.issuedDate
            ? travelDoc.issuedDate.split('T')[0]
            : null,
          expirationDate: travelDoc.expirationDate
            ? travelDoc.expirationDate.split('T')[0]
            : null,
        };
      }
    }

    // Process 'number' field in 'phoneNumbers'
    if (processedData.phoneNumbers && processedData.phoneNumbers.length > 0) {
      processedData.phoneNumbers = processedData.phoneNumbers.map((phone) => {
        if (phone.number && typeof phone.number === 'string') {
          // Extract country code and number
          const match = phone.number.match(/^(.+)\*(\d+)$/);
          let countryCode = match ? match[1] : null;
          const formattedNumber = match ? match[2] : phone.number;

          // Remove '+' from the beginning of the country code if it exists
          if (countryCode) {
            countryCode = countryCode.replace(/^\+/, '');
          }

          return {
            ...phone,
            number: formattedNumber,
            countryCode,
          };
        }
        return phone;
      });
    }

    return processedData;
  }

  const getMyProfileApiRequest = async () => {
    const data = await getMyProfileApi();
    if (data?.error && Object.keys(data?.error).length) {
      dispatch({
        type: profileActions.SET_API_ERROR,
        payload: true,
      });
    }
    const processedData = processProfileData(data?.data);
    dispatch({ type: profileActions.SET_PROFILE_DATA, payload: processedData });
    dispatch({
      type: profileActions.SET_INITIAL_NAME,
      payload: {
        first: processedData?.name?.First,
        last: processedData?.name?.Last,
        title: processedData?.name?.Title,
      },
    });
    dispatch({
      type: profileActions.SET_ORIGINAL_PROFILE_DATA,
      payload: processedData,
    });
  };

  const fetchProfileData = async () => {
    setLoader(true);
    await getMyProfileApiRequest();
    const countryList = await getCountryList();
    dispatch({ type: profileActions.SET_COUNTRY_LIST, payload: countryList });
    const stateList = await getStateList();
    dispatch({ type: profileActions.SET_STATE_LIST, payload: stateList });
    const userProfileAemData = await getMyProfileAemData();
    dispatch({
      type: profileActions.SET_MY_PROFILE_AEM_DATA,
      payload: userProfileAemData,
    });
    setLoader(false);
  };

  const getLoyaltyInfo = () => {
    if (window.disableLoyalty) return;

    const authUser = Cookies.get(COOKIE_KEYS.USER, true, true) || {};

    // Loyalty
    const userTier = authUser?.loyaltyMemberInfo?.tier
      || authUser?.loyaltyMemberInfo?.TierType
      || '';
    const isLoyaltyUser = authUser?.loyaltyMemberInfo?.FFN
      || authUser?.loyaltyMemberInfo?.ffn
      || '';
    if (!isLoyaltyUser) return; // for non-loyalty user, we dont have to show the UI
    const tierlbl = getLoyaltyTierLabel(userTier);
    const pointBalance = new Intl.NumberFormat('en-IN', {}).format(
      authUser?.loyaltyMemberInfo?.pointBalance,
    );
    setLoyaltyUiInfo({
      tierlbl,
      points: pointBalance,
    });
  };

  useEffect(() => {
    fetchProfileData();
    getLoyaltyInfo();

    // Write pageload analytics here
    const timeout = setTimeout(() => {
      analyticEvents({
        event: aaEvents.MY_PROFILE_PAGELOAD,
        data: {
          _event: eventNames.BOOKING_PAGELOAD,
        },
      });
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    // load component from top
    if (!loader) {
      scrollToTop(500);
    }
  }, [loader]);

  const handleChange = (keyInObject, key, value, index = null) => {
    const updatedData = { ...profileData };
    if (index !== undefined && index !== null) {
      if (!updatedData[keyInObject]) {
        updatedData[keyInObject] = [];
      }
      updatedData[keyInObject] = [...updatedData[keyInObject]];
      updatedData[keyInObject][index] = {
        ...updatedData[keyInObject][index],
        [key]: value,
      };
    } else {
      if (!updatedData[keyInObject]) {
        updatedData[keyInObject] = {};
      }
      updatedData[keyInObject] = {
        ...updatedData[keyInObject],
        [key]: value,
      };
    }
    // not enabling button when user clicks on add button, after valid validation button will
    // be enabled.
    if (keyInObject !== 'phoneNumbers') { dispatch({ type: profileActions.ENABLE_BUTTON }); }
    dispatch({ type: profileActions.SET_PROFILE_DATA, payload: updatedData });
    return updatedData;
  };

  function extractFirstAndLastName(fullName) {
    if (!fullName || typeof fullName !== 'string') {
      return { first: '', last: '' };
    }

    // Trim leading and trailing spaces and split the name by one or more spaces
    const words = fullName.trim().split(/\s+/);

    if (words.length === 0) {
      return { first: '', last: '' };
    }

    const first = words[0];
    const last = words.length > 1 ? words[words.length - 1] : '';

    return { first, last };
  }

  const formatDateToISO = (date) => {
    if (!date) return '';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toISOString();
  };

  const handleButtonClick = async () => {
    setButtonLoader(true);
    profileBtnClickAnalytics(myProfileAemData?.saveChangesLabel, 'My Profile');
    const changes = getUpdatedFields(originalProfileData, profileData);

    // Reduce payload size and remove unused objects
    if (changes?.FavoriteTraveler) delete changes.FavoriteTraveler;
    if (changes?.gstDetails) delete changes.gstDetails;
    // travelDocuments not need for SME admin | SME user | agent
    if (changes?.travelDocuments && !isMember) delete changes.travelDocuments;

    let updateData = '';
    if (parseInt(profileData?.details?.gender, 10) === 1) {
      updateData = handleChange('name', 'Title', 'Mr');
    } else {
      updateData = handleChange('name', 'Title', 'Mrs');
    }
    if (changes && changes.personDetails) {
      changes.personDetails.name = updateData?.name;
    }

    // Check for phone number updates and move to phoneDetails
    if (changes?.phoneNumbers && changes?.phoneNumbers.length > 0) {
      changes.phoneDetails = changes.phoneNumbers.map((phone) => {
        const { countryCode, number } = phone;
        const formattedPhone = {
          ...phone,
          number: number ? `+${countryCode || '91'}*${number}` : '', // Use '91' if countryCode is missing
        };
        delete formattedPhone.countryCode; // Remove countryCode key
        return formattedPhone;
      }).filter((item) => (item.number !== '' || item.personPhoneNumberKey));
      delete changes.phoneNumbers; // Remove phoneNumbers from changes
    }

    // Check for email updates, change type to "P", and move to emailDetails
    if (changes?.emailAddresses && changes?.emailAddresses.length > 0) {
      changes.emailDetails = changes.emailAddresses.map((email) => ({
        ...email,
        type: 'P', // Set type to "P"
      }));
      delete changes.emailAddresses; // Remove emailAddresses from changes
    }
    if (changes?.travelDocuments && changes.travelDocuments.length > 0 && isMember) {
      // Extract the full name string from the first travel document
      const fullName = changes.travelDocuments[0]?.name;

      // Use the extractFirstAndLastName function to parse the name
      const { first, last } = extractFirstAndLastName(fullName);
      const formattedExpirationDate = formatDateToISO(
        dateToConvert(changes.travelDocuments[0]?.expirationDate),
      );
      const formattedIssueDate = formatDateToISO(
        dateToConvert(changes.travelDocuments[0]?.issuedDate),
      );
      // Create the updated travel document

      const updatedTravelDocument = {
        ...changes.travelDocuments[0],
        name: {
          first, // Assign the extracted first name
          last, // Assign the extracted last name
        },
        expirationDate: formattedExpirationDate,
        documentTypeCode: myProfileAemData?.documentTypeCode,
        issuedDate: formattedIssueDate,
        dateOfBirth: profileData?.details?.dateOfBirth,
      };

      // Replace the first travel document with the updated one
      changes.travelDocuments = [updatedTravelDocument];
    }
    if ('addresses' in changes) {
      // Rename 'addresses' to 'personAddress'
      changes.personAddress = changes.addresses;
      delete changes.addresses;
    }
    if (changes && Object.keys(changes)?.length) {
      changes.otp = '';
      await updateMyProfileApi(changes).then(async (response) => {
        setEnableEditing(true);
        setButtonLoader(false);
        if (response?.data?.success) {
          dispatch({
            type: profileActions.SET_TOAST,
            payload: {
              show: true,
              description: myProfileAemData?.profileUpdated,
              variation: 'Success',
            },
          });
          setButtonLoader(false);
          dispatch({ type: profileActions.DISABLE_BUTTON });
          let authUser;
          try {
            authUser = Cookies.get(COOKIE_KEYS.USER, true, true);
          } catch (e) {
            authUser = Cookies.get(COOKIE_KEYS.USER);
          }

          const userDetails = {
            first: profileData?.name?.First,
            last: profileData?.name?.Last,
            title: profileData?.name?.Title,
            gender: Number(profileData?.details?.gender) - 1,
          };
          authUser.name = userDetails;

          const tokenObj = Cookies.get(COOKIE_KEYS.AUTH, true);
          const cookieExpiredTime = tokenObj?.expiresInMilliSeconds || 15 * 60 * 1000;
          const event = new CustomEvent('UPDATE_AUTH_USER_COOKIE', {
            bubbles: true,
            detail: { user: authUser, cookieExpiredTime },
          });
          document.dispatchEvent(event);
          await getMyProfileApiRequest();
        } else {
          setEnableEditing(false);
          dispatch({
            type: profileActions.SET_TOAST,
            payload: {
              show: true,
              description: myProfileAemData?.profileNotUpdated,
              variation: 'Error',
            },
          });
        }
      });
    } else {
      setButtonLoader(false);
      // eslint-disable-next-line no-console
      console.log(myProfileAemData?.noChangesInForm);
    }
  };

  return (
    <div className="revamp-user-profile-profile-form mb-md-20">
      {loader ? <Loader /> : null}
      {apiError ? (
        <Toast
          infoIconClass="icon-error"
          variation={`notifi-variation--${toast.variation}`}
          description={SOMETHING_WENT_WRONG}
          containerClass="bg-system-error-light"
          autoDismissTimeer={5000}
          onClose={() => {
            dispatch({
              type: profileActions.SET_API_ERROR,
              payload: false,
            });
          }}
        />
      ) : null}
      <div className="revamp-user-profile-profile-form-header mx-n10 mx-md-0">
        <h4 className="h4 mx-9 d-none d-md-block revamp-user-profile-profile-form-header-title">
          {myProfileAemData?.myAccountPreferencesLabel}
        </h4>
        <div className="d-md-flex mx-9 my-12 gap-8 revamp-user-profile-profile-form-avatar-container">
          {imagePresent ? (
            <div className="revamp-user-profile-profile-form-initials-circle-container">
              <div className="revamp-user-profile-profile-form-initials-circle">
                <img src="" alt="Profile" />
              </div>
              <i className="icon-edit edit-icon" />
            </div>
          ) : (
            <div className="revamp-user-profile-profile-form-initials-circle-container">
              <div className="revamp-user-profile-profile-form-initials-circle">
                {initialName?.first?.charAt(0).toUpperCase()}
                {initialName?.last?.charAt(0).toUpperCase()}
              </div>
              {!isMember && (
                <i
                  onClick={() => setEnableEditing(false)}
                  role="button"
                  tabIndex="0"
                  label="edit-icon"
                  className="icon-edit edit-icon"
                />
              )}
            </div>
          )}
          <div className="d-flex flex-column align-items-start justify-content-center gap-4">
            {initialName?.first && (
              <div className="sh3 text-primary revamp-user-profile-profile-form-mobile-heading">
                {/* {startCase(
                  toLower(`${initialName?.title} ${initialName?.first}
                ${initialName?.last}`),
                )} */}
                {initialName?.title
                  && startCase(toLower(`${initialName.title}`))}{' '}
                {initialName?.first} {initialName?.last}
              </div>
            )}
          </div>
          {!!loyaltyUiInfo && (
            <div className="revamp-user-profile-loyalty shadow bg-white">
              <div className="revamp-user-profile-loyalty-info">
                <span className="revamp-user-profile-loyalty-info-tier">
                  <i className="icon-star_filled star-outline-icon" />
                  {loyaltyUiInfo?.tierlbl}
                </span>
                <span className="revamp-user-profile-loyalty-info-point">
                  {loyaltyUiInfo?.points}
                </span>
                <span className="revamp-user-profile-loyalty-info-label">
                  {myProfileAemData?.rewardPoint}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {[
        USER_TYPES.USER,
        USER_TYPES.AGENT,
        USER_TYPES.SME_USER,
        USER_TYPES.SME_ADMIN,
      ]?.includes(userType) && (
      <div className={`revamp-user-profile-profile-form-overlap-basic-details ${loyaltyUiInfo && 'is-loyalty'}`}>
        <BasicDetails
          {...basicDetailsProps}
          data={profileData}
          onChange={handleChange}
          validateField={validateField}
          isMember={isMember}
          isAgent={isAgent}
          enableEditing={enableEditing}
        />
      </div>
      )}
      {[
        USER_TYPES.USER,
        USER_TYPES.AGENT,
        USER_TYPES.SME_USER,
        USER_TYPES.SME_ADMIN,
      ]?.includes(userType) && (
      <ContactDetails
        {...contactProps}
        data={profileData}
        onChange={handleChange}
        validateField={validateField}
        isMember={isMember}
        enableEditing={enableEditing}
      />
      )}
      <div className="mt-md-16 mx-n10 mx-md-0 mb-md-25 save-btn revamp-user-profile-profile-form-profile-button">
        {!isMember ? (
          <Button
            {...{ block: true }}
            disabled={isButtonDisabled}
            onClick={handleButtonClick}
            containerClass="revamp-user-profile-profile-form-button-container-class mb-md-25 mx-md-9"
            loading={buttonLoader}
          >
            {myProfileAemData?.saveChangesLabel}
          </Button>
        ) : null}
      </div>

      {toast.show && (
        <Toast
          infoIconClass="icon-info"
          variation={`notifi-variation--${toast.variation}`}
          description={toast.description}
          containerClass="toast-example"
          autoDismissTimeer={5000}
          onClose={() => {
            dispatch({
              type: profileActions.SET_TOAST,
              payload: { show: false, description: '', variation: null },
            });
          }}
        />
      )}
    </div>
  );
};

export default MyProfile;
