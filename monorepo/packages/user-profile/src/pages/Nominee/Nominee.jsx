import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import AddNominee from './Add/AddNominee';
import Footer from './Footer/Footer';
import PassengersContainer from './Passenger/PassengersContainer';
import ConfirmSelection from './Modal/ConfirmSelection';
import NomieeContext from './NomieeContext';
import { getNominee } from '../../services/nominee.service';
import { nomieeActions } from './NomieeReducer';
import aemService from '../../services';
import { URLS, CONSTANTS, BROWSER_STORAGE_KEYS } from '../../constants';
import AEMContext from '../../context/AEMContextProvider';
import analyticEvents from '../../utils/analyticEvents';
import { aaEvents } from '../../utils/analyticsConstants';
import SearchBar from '../../components/SearchBar/SearchBar';
import RecentQuery from '../../components/RecentQuery/RecentQuery';
import BannerSection from '../../components/BannerSection/BannerSection';
import PNRStatus from '../../components/PNRStatus/PNRStatus';
import TripPlan from '../../components/TripPlan/TripPlan';
import { getIataData } from '../../services/itinerary.service';
import RecentQueriesList from '../../components/RecentQuery/RecentQueriesList';
import { LOGIN_SUCCESS } from '../../constants/common';
import { handleCheckHealthStatusForChatbot } from '../../utils/utilFunctions';

const Nominee = () => {
  const [state, setState] = useState({
    showConfirmation: false,
  });
  const { setAEMData, aemLabel } = useContext(AEMContext);
  const [contactUsData, setContactUsData] = useState();
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [pnrStatus, setPnrStatus] = useState({
    pnr: '',
    lastName: '',
  });
  const [isToastMessage, setIsToastMessage] = useState(false);
  const [iataList,setIataList]=useState({});
  const handleIATAList= async()=>{
    try{
      const data= await getIataData();
       let iataList=data?.data?.iataDetailsList?.items;
      let finalIATAList=iataList?.reduce((acc,item)=>{
        acc[item.iata]=item?.confirmationImage?._publishUrl;
        return acc;
      },{});
      setIataList({...finalIATAList});
    }
    catch(err){
      console.log("Error in iata data - ",err)
    }
  }
  const {
    state: { toast, loading, showFooter, disableAdd, nominees },
    dispatchToast,
    dispatch,
  } = useContext(NomieeContext);
  const onClickRemoveHandler = () => {
    const analyticObj = {
      data: {
        _event: 'Remove_Nominee_Initated',
        eventInfo: {
          name: 'Remove Nominee',
          position: '',
          component: '',
        },
      },
      event: aaEvents.REMOVE_NOMINEE_INITIATED,
    };
    analyticEvents(analyticObj);
    setState((prev) => ({ ...prev, showConfirmation: true }));
  };

  const closeConfirmationHandler = () => {
    setState((prev) => ({ ...prev, showConfirmation: false }));
  };

  const onLoginSuccess = () => {
    const loggedInUserData = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true) || false;
    setLoggedInUser(loggedInUserData);
  };

  useEffect(() => {
    const analyticObj = {
      data: {
        _event: 'pageload',
      },
      event: aaEvents.NOMINEE_PAGELOAD,
    };
    analyticEvents(analyticObj);

    Promise.all([
      getNominee(),
      aemService(URLS.AEM_GET_NOMINEE, 'data.accountNomineesByPath.item'),
      aemService(
        URLS.AEM_GET_USER_PROFILE_DATA,
        'data.userProfileTripsByPath.item',
      ),
    ]).then((response) => {
      const [apiresponse, nomineeAEM, contactUsAemData] = response;
      setAEMData(nomineeAEM);
      setContactUsData(contactUsAemData);
      dispatch({
        type: nomieeActions.INIT,
        payload: {
          api: apiresponse,
        },
      });
    });

    document.addEventListener(LOGIN_SUCCESS, onLoginSuccess);
    handleIATAList();
    onLoginSuccess();
  }, []);

  const { showRemoveButton, saveEnabled } = useMemo(() => {
    let apiHasData = false;
    let isDataValid = true;

    nominees.forEach((nominee) => {
      isDataValid = nominee.isValid
        && isDataValid
        && !nominee?.duplicateNominee?.isDuplicateNominee;
      apiHasData = apiHasData || !nominee.isNew;
    });

    return {
      showRemoveButton: apiHasData,
      saveEnabled: isDataValid,
    };
  }, [nominees]);

  const aemData = useMemo(() => {
    return {
      addNomineeCtaLabel: aemLabel('addNomineeCtaLabel'),
      removeNomineeCtaLabel: aemLabel('removeNomineeCtaLabel'),
      nomineeLimitNote: aemLabel('nomineeLimitNote.html'),
      loaderImagePath: aemLabel(
        'loaderImagePath._publishUrl',
        '/content/dam/s6web/in/en/assets/payments-page-icon.gif',
      ),
      addNomineesTitle: aemLabel('addNomineesTitle.html'),
      addNomineesDescription: aemLabel('addNomineesDescription'),
      backToPreviousPageText: aemLabel('backToPreviousPageText'),
      backToPreviousPageLink: aemLabel('backToPreviousPageLink'),
    };
  }, [aemLabel]);

  const allSubmitted = nominees.filter((nominee) => nominee?.nomineeID).length === 5;
  const { pageType } = window;

  // chat
  const iframeRef = useRef();
  const isChatbotDownRef = useRef(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const handleSearch = (text = '', isInputField = false, lastName = '', recordLocator = '') => {
    if (text && isChatbotDownRef.current) {
      return setIsToastMessage(true);
    }
    if (text) {
      setIsChatBotOpen(true);
    }
    const reqData = {
      type:
      isInputField
        ? 'webform_input'
        : 'webform_button',
      value: text,
      ...(((lastName && recordLocator) || pnrStatus.lastName) && { lastname: lastName || pnrStatus?.lastName, pnr: recordLocator || pnrStatus?.pnr }),
    };
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(reqData, '*');
    }
  };

  useEffect(() => {
    const fetchChatbotStatus = async () => {
      const isHealthy = await handleCheckHealthStatusForChatbot();
      isChatbotDownRef.current = !isHealthy;
    };
    if (pageType === CONSTANTS?.CONTACTUS_PAGE_TYPE || pageType === CONSTANTS?.INFO_CONTACT_US_SUMMARY) {
      fetchChatbotStatus();
    }
  }, []);

  return (
    <div
      className={`user-profile__right user-profile__nominee pt-10 pb-10 ${pageType}`}
    >
      {pageType !== CONSTANTS?.CONTACTUS_PAGE_TYPE
        && pageType !== CONSTANTS?.INFO_CONTACT_US_SUMMARY
        && pageType !== CONSTANTS.INFO_CONTACT_US_RECENT_QUERY && (
          <>
            <div className="user-profile__nav-link">
              <i className="icon-accordion-left-simple" />
              <a
                href={aemData.backToPreviousPageLink || '/'}
                role="button"
                tabIndex={0}
                className="link"
              >{aemData.backToPreviousPageText}
              </a>
            </div>
            <div className="user-profile__nominee__header">
              <HtmlBlock
                className="user-profile__nominee__header__heading"
                html={aemData.addNomineesTitle}
              />
              <div className="user-profile__nominee__header__sub_heading">
                {aemData.addNomineesDescription}
              </div>
            </div>
            <PassengersContainer />
            <AddNominee addNomineeCtaLabel={aemData.addNomineeCtaLabel} />
            {disableAdd && allSubmitted && (
              <HtmlBlock
                className="user-profile__nominee__note"
                html={aemData.nomineeLimitNote}
              />
            )}
            {showRemoveButton && (
              <div className="user-profile__nominee__remove-btn">
                <Button variant="outline" onClick={onClickRemoveHandler}>
                  {aemData.removeNomineeCtaLabel}
                </Button>
              </div>
            )}
            {showFooter && <Footer disabled={!saveEnabled} />}
            {state.showConfirmation && (
              <ConfirmSelection
                closeConfirmationHandler={closeConfirmationHandler}
              />
            )}
            {toast.show && (
              <Toast
                infoIconClass="icon-info"
                variation={`notifi-variation--${toast.variation}`}
                description={toast.description}
                containerClass="toast-example"
                autoDismissTimeer={5000}
                onClose={() => {
                  dispatchToast({ show: false });
                }}
              />
            )}
            {loading && (
              <div className="skyplus-loader skyplus-loader-overlay">
                <div className="h-100 d-flex align-items-center">
                  <div className="payment-page-intermediate-orchestrator-dynamic__flight-animation">
                    <img src={aemData.loaderImagePath} alt="loader" />
                  </div>
                </div>
              </div>
            )}
          </>
      )}
      {pageType === CONSTANTS?.CONTACTUS_PAGE_TYPE
        && (loggedInUser ? (
          <>
            <span className={`${pageType}__sub_heading`}>
              {contactUsData?.quickSupportTitle}
            </span>
            <HtmlBlock
              className={`${pageType}__heading`}
              html={contactUsData?.recentTripsDescription?.html.replace(
                '{customer}',
                `${loggedInUser?.name?.first}`,
              )}
            />
            <TripPlan
              contactUsData={contactUsData}
              handleSearch={handleSearch}
              iataList={iataList}
            />
            <RecentQuery aemData={contactUsData} />
          </>
        ) : (
          <BannerSection aemData={contactUsData} />
        ))}
      {(pageType === CONSTANTS?.CONTACTUS_PAGE_TYPE
        || pageType === CONSTANTS?.INFO_CONTACT_US_SUMMARY) && (
        <>
          <div className={`${pageType}__card`}>
            {pageType === CONSTANTS?.INFO_CONTACT_US_SUMMARY && (
              <PNRStatus
                aemData={contactUsData}
                loaderImage={aemData?.loaderImagePath}
                setPnrStatus={setPnrStatus}
              />
            )}
            <SearchBar
              aemData={contactUsData}
              handleSearch={handleSearch}
              iframeRef={iframeRef}
              isChatBotOpen={isChatBotOpen}
              setIsChatBotOpen={setIsChatBotOpen}
            />
          </div>
          {isToastMessage && (
            <Toast
              mainToastWrapperClass="wc-toast"
              variation="notifi-variation--Information"
              description={contactUsData?.chatbotFallbackMessage}
              containerClass="wc-toast-container"
              onClose={() => setIsToastMessage(false)}
              infoIconClass="icon-info system-information"
              autoDismissTimeer={5000}
            />
          )}
        </>
      )}
      {pageType === CONSTANTS.INFO_CONTACT_US_RECENT_QUERY && (
        <RecentQueriesList loadingImage={aemData.loaderImagePath} />
      )}
    </div>
  );
};

export default Nominee;
