import React, { useState, useContext, useEffect } from 'react';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import find from 'lodash/find';
import ModalComponent from 'skyplus-design-system-app/dist/des-system/ModalComponent';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import {
  getCorpConnectAemData,
  getCorpConnectData,
} from '../../../services/corpConnect.service';
import { corpConnectActions } from './CorpConnectReducer';
import CorpConnectContext from './CorpConnectContext';
import { objectOfKeys } from '../../../utils/utilFunctions';
import { getCountryList } from '../../../services/myProfile.service';
import ModalContent from './ModalContent';
import Loader from '../../../components/common/Loader/Loader';

const CorpConnect = () => {
  const {
    state: {
      loader,
      userDetails: { name = {} } = {},
      countryList,
      corpConnectData,
      corpConnectAemData: {
        title = '',
        organisationDetailsLabel = '',
        nameOfOrganisationLabel = '',
        registerAddressLabel = '',
        contactNumberLabel = '',
        cityLabel = '',
        pinCodeLabel = '',
        countryLabel = '',
        webSiteLabel = '',
        numberOfEmployees = '',
        panNumber = '',
        companyDetailsLabel = '',
        saveChangesPopup = {},
        accountDetails: {
          gstNumber = '',
          stateLabel = '',
          // saveChangesLabel = '',
          stateGstDescription = '',
        } = {},
      } = {},
    },
    dispatch,
  } = useContext(CorpConnectContext);

  const nameKeys = objectOfKeys(corpConnectData);
  const [showModal, setShowModal] = useState(false);

  const setInitCorpConnectData = async () => {
    dispatch({
      type: corpConnectActions.SET_LOADER,
      payload: true,
    });

    const getCorpConnectApiData = await getCorpConnectData();
    dispatch({
      type: corpConnectActions.SET_CORP_CONNECT,
      payload: getCorpConnectApiData,
    });

    const getCorpConnectAemLabels = await getCorpConnectAemData();

    dispatch({
      type: corpConnectActions.SET_CORP_CONNECT_AEM_DATA,
      payload: getCorpConnectAemLabels,
    });

    dispatch({
      type: corpConnectActions.SET_LOADER,
      payload: false,
    });

    const countryListData = await getCountryList();
    dispatch({
      type: corpConnectActions.SET_COUNTRY_LIST,
      payload: countryListData,
    });
  };

  useEffect(() => {
    setInitCorpConnectData();
  }, []);

  const changeHandler = (e) => {
    dispatch({
      type: corpConnectActions.SET_VALUE,
      payload: {
        key: e.target.name,
        value: e.target.value,
      },
    });
  };

  // const onSaveChangeHandler = () => {
  //   setShowModal(true); // TODO - Update API Call needs to be added once we receive the details
  // };

  const onSaveHandler = () => {
    setShowModal(false);
  };

  const onCancelHandler = () => {
    setShowModal(false);
  };

  return (
    <div className="corp-connect">
      {loader ? <Loader /> : null}
      <div className="corp-connect-profile-form-header">
        <Heading heading="h4" mobileHeading="h4" containerClass="d-none d-md-block mb-16">
          {title}
        </Heading>
        <div className="d-md-flex mb-12 my-12 gap-8 revamp-user-profile-profile-form-avatar-container">
          <div className="revamp-user-profile-profile-form-initials-circle-container">
            <div className="revamp-user-profile-profile-form-initials-circle">
              {name?.first?.charAt(0)?.toUpperCase()}
              {name?.last?.charAt(0)?.toUpperCase()}
            </div>
            {/* <i className="icon-edit edit-icon" /> */}
          </div>
          <div className="d-flex flex-column align-items-start justify-content-center gap-4">
            <div className="sh3 text-primary revamp-user-profile-profile-form-mobile-heading">
              {startCase(
                toLower(`${name?.title} ${name?.first}
                ${name?.last}`),
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="shadow rounded mt-12 p-6 p-md-8 bg-white corp-connect-profile-form-body">
        <Heading containerClass="mb-8" heading="p">
          {organisationDetailsLabel}
        </Heading>
        <InputField
          type="text"
          name={nameKeys?.name}
          value={corpConnectData?.name || ''}
          placeholder={nameOfOrganisationLabel}
          onChangeHandler={changeHandler}
          inputWrapperClass="mb-8"
          customErrorMsg=""
          disabled
        />
        <InputField
          type="text"
          name={nameKeys?.registeredAddress}
          value={corpConnectData?.registeredAddress || ''}
          placeholder={registerAddressLabel}
          inputWrapperClass="mb-8"
          onChangeHandler={changeHandler}
          disabled
        />
        <div className="d-md-flex mb-2 gap-12">
          <InputField
            type="text"
            name={nameKeys?.city}
            value={corpConnectData?.city || ''}
            placeholder={cityLabel}
            inputWrapperClass="w-100"
            onChangeHandler={changeHandler}
            disabled
          />
          <InputField
            type="text"
            name={nameKeys?.pinCode}
            value={corpConnectData?.pinCode || ''}
            placeholder={pinCodeLabel}
            inputWrapperClass="w-100"
            onChangeHandler={changeHandler}
            disabled
          />
        </div>

        <InputField
          type="text"
          inputWrapperClass="mb-8"
          name={nameKeys?.state}
          value={corpConnectData?.state || ''}
          placeholder={stateLabel}
          onChangeHandler={changeHandler}
          disabled
        />
        <div className="body-extra-small-regular text-tertiary mb-6">
          <i className="icon-star" />
          {stateGstDescription}
        </div>
        <InputField
          type="text"
          name={nameKeys?.country}
          value={
            find(countryList?.countries, {
              countryCode: corpConnectData?.country,
            })?.name || ''
          }
          placeholder={countryLabel}
          onChangeHandler={changeHandler}
          disabled
        />
        <div className="body-extra-small-regular text-tertiary">
          <i className="icon-star" />
          {stateGstDescription}
        </div>
        <div className="bg-white d-flex w-100">
          <div className="border-divider my-12 w-100" />
        </div>
        <PhoneComponent
          phonePlaceholder={contactNumberLabel}
          className="pointer-none"
          initialCountryCode={91}
          name={nameKeys?.contactNo}
          maxLength={10}
          value={corpConnectData?.contactNo}
          sanitize
          isDisabled
          type="number"
        />
        <InputField
          type="text"
          name={nameKeys?.website}
          value={corpConnectData?.website || ''}
          placeholder={webSiteLabel}
          onChangeHandler={changeHandler}
          disabled
        />
        <div className="bg-white d-flex w-100">
          <div className="border-divider mt-8 mb-12 w-100" />
        </div>
        <Heading containerClass="mb-8" heading="p">
          {companyDetailsLabel}
        </Heading>
        <InputField
          type="text"
          inputWrapperClass="mb-8"
          name={nameKeys?.noOfEmployee}
          value={corpConnectData?.noOfEmployee || ''}
          placeholder={numberOfEmployees}
          onChangeHandler={changeHandler}
          disabled
        />
        <InputField
          type="text"
          inputWrapperClass="mb-8"
          name={nameKeys?.pAN}
          value={corpConnectData?.pAN || ''}
          placeholder={panNumber}
          onChangeHandler={changeHandler}
          disabled
        />
        <InputField
          type="text"
          inputWrapperClass="mb-8"
          name={nameKeys?.gST}
          value={corpConnectData?.gST?.[0] || ''}
          placeholder={gstNumber}
          onChangeHandler={changeHandler}
          disabled
        />
      </div>
      {showModal ? (
        <ModalComponent
          modalContent={() => {
            return (
              <ModalContent
                onSaveHandler={onSaveHandler}
                onCancelHandler={onCancelHandler}
                labels={saveChangesPopup}
              />
            );
          }}
        />
      ) : null}
      {/* TODO - Once update api ready enable and write this functinality */}
      {/* <Button block onClick={onSaveChangeHandler}>{saveChangesLabel}</Button> */}
    </div>
  );
};

export default CorpConnect;
