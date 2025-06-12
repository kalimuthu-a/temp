/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Strip from 'skyplus-design-system-app/dist/des-system/Strip';
import userIdentity from 'skyplus-design-system-app/src/functions/UserIdentity';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';
import Modal from './Modal/Modal';
import { scratchCardAPIData, scratchCardAEMData, couponUseApi } from '../../services';
import { MFDATA_MOCKDATA_AEM_STRIP_DATA } from '../../mock/itineraryAEM';
import {
  getSessionUser,
  mapDataWithOfferId,
  mergeStatusIntoOffers,
  getSessionUserScratchCard,
  countPassengers,
} from '../../utils';
import { ANALTYTICS, CONSTANT } from '../../constants/scratchcardanalytic';
import { pushAnalytic } from '../../utils/analyticEvents';
import { CONSTANTS } from '../../constants';
import LocalStorage from '../../utils/LocalStorage';

const ScratchCardWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scratchApiData, setScratchApiData] = useState([]);
  const [scratchAEMData, setScratchAEMData] = useState([]);
  const [MembershipID, setMembershipID] = useState([]);
  const [isShimmer, setIsShimmer] = useState(false);
  const [userloginScratchCard, setuserloginScratchCard] = useState(() => getSessionUserScratchCard());
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const itineraryApiData = useSelector((state) => state.itinerary?.apiData) || {};
  const passenger = useSelector((state) => state.itinerary?.apiData?.passengers) || [];
  const graphQLAem = scratchAEMData?.data?.scratchCardPartnersByPath?.item;
  const fallback = MFDATA_MOCKDATA_AEM_STRIP_DATA.data;
  const stripTrip = mfData?.itineraryMainByPath?.item;
  const [isMealExist, setMealExist] = useState(false);
  const [isBaggageExist, setBaggageExist] = useState(false);
  const [isSeatExist, setSeatExist] = useState(false);
  const [unscratchedImage, setUnscratchedImage] = useState({});
  const [showCouponCode, setShowCouponCode] = useState(true);
  const [isScrateched, setIsScrateched] = useState(false);

  const userData = () => {
    let memID = getSessionUser();
    setMembershipID(memID);
    let userloginScratchCard = getSessionUserScratchCard();
    setuserloginScratchCard(userloginScratchCard);
  };

  const makeAEMCall = async () => {
    const scratchAEMresponse = await scratchCardAEMData();
    if (scratchAEMresponse) {
      setScratchAEMData(scratchAEMresponse);
    }
  };

  const checkSsrExist = () => {
    if (itineraryApiData?.ssrCategories?.[0]?.openSlider) {
      setBaggageExist(true);
    }
    passenger?.forEach((pax) => {
      pax?.seatsAndSsrs?.journeys.forEach((journey) => {
        journey.segments.forEach((segment) => {
          if (segment?.seats?.length) {
            setSeatExist(true);
          }
          if (segment?.ssrs.length > 0) {
            segment?.ssrs.forEach((ssr) => {
              if (ssr.ssrCategory === CONSTANTS?.NAVIGATION_MENU?.ADDONS_MEAL) {
                setMealExist(true);
              }
            });
          }
        });
      });
    });
  };

  useEffect(() => {
    userIdentity.subscribeToLogin(userData);
    makeAEMCall();
    checkSsrExist();
    return () => {
      userIdentity.unSubscribeToLogin(userData);
    };
  }, []);

  const brandName = graphQLAem?.brand_name;

  const LoginCustomer = () => {
    if (window.enableOldLogin) {
      userIdentity.dispatchLoginEvent();
    } else {
      userIdentity.dispatchSSOLoginEvent();
    }
  };

  const betterLuck = {
    unscratchedImage: graphQLAem?.betterLuckNextTimeImage?._path,
    image: {
      _publishUrl: graphQLAem?.image?._publishUrl,
    },
    buttonText: graphQLAem?.noScratchCardButtonText,
    unscratchedTitle: graphQLAem?.unscratchedTitle,
    unscratchedDescription: graphQLAem?.unscratchedDescription,
    offerDescription: graphQLAem?.offerDescription,
    confettiPath: {
      _publishUrl: graphQLAem?.betterLuckConfettiPath?._publishUrl,

    },
    redemptionLink: graphQLAem?.noScratchCardButtonLink,
  };

  let combinedData = {};

  const onRedeemClick = async () => {
    pushAnalytic({
      data: {
        _event: ANALTYTICS.DATA_CAPTURE_EVENTS.REDEEM_CLICK,
        _eventInfoName: 'Redeem',
      },
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.REDEEM_CLICK,
      error: {},
    });
    setScratchApiData([]);
    setUnscratchedImage({});
    setShowCouponCode(true);
    setIsShimmer(true);
    setIsModalOpen(true);
    const scratchAPIresponse = await scratchCardAPIData({});
    if (scratchAPIresponse?.couponDetailResponse?.code === CONSTANTS.NOCARD) {
      setScratchApiData(scratchAPIresponse);
      setUnscratchedImage(betterLuck);
      setIsShimmer(false);
      setShowCouponCode(false);
      setIsScrateched(false);
      if(scratchAPIresponse?.couponDetailResponse?.Values[0]?.coupon_status === CONSTANTS.SCRATCHED){
        setIsScrateched(true);
      }
    } else {
      if (scratchAPIresponse?.couponDetailResponse?.Values) {
        setScratchApiData(scratchAPIresponse);
        setIsShimmer(false);
        setShowCouponCode(true);
      } else {
        setIsShimmer(true);
        setScratchApiData([]);
      }
    }
  };

  const offerIdAPI = scratchApiData?.couponDetailResponse?.Values?.[0]?.offer_id;
  const barndId = scratchApiData?.couponDetailResponse?.Values?.[0]?.brand_id;

  if (scratchApiData && offerIdAPI) {
    const apiItem = scratchApiData?.couponDetailResponse?.Values?.[0];
    const cardObj = mapDataWithOfferId(graphQLAem, offerIdAPI);
    const data = cardObj?.filter((item) => item?.partnerId === barndId?.toString());
    combinedData = mergeStatusIntoOffers(data, apiItem);
  }

  const getLocalStorage = LocalStorage.getAsJson(
    CONSTANTS?.LOCALSTORAGEKEYS?.promo_val,
  );

  let couponCodeId;
  try {
    couponCodeId = JSON.parse(getLocalStorage?.Data);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
  if (couponCodeId?.objValidate?.couponCodeId) {
    const payload = { couponCodeId: couponCodeId?.objValidate?.couponCodeId };
    couponUseApi(payload);
  }

  const handleCloseClick = () => {
    pushAnalytic({
      data: {
        _event: ANALTYTICS.DATA_CAPTURE_EVENTS.CLOSE_ICON_CLICK,
        _eventInfoName: brandName,
        _customerid: encryptAESForLogin(getSessionUser()),
      },
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.CLOSE_ICON_CLICK,
    });
    setIsModalOpen(false);
  };

  const { scratchCardWidgetButtonText, scratchCardWidgetButtonTextGuest = 'Login' } = stripTrip || {};

  function getDataProp(combinedData, isShimmer, unscratchedImage) {
    return Object.keys(combinedData).length === 0
      ? (isShimmer ? combinedData : unscratchedImage)
      : combinedData;
  }

  return (
    <div>
      <Strip
        data={stripTrip || fallback}
        handleRedeem={userloginScratchCard.roleCode === CONSTANTS.LOGIN_TYPE.ANONYMOUS ? LoginCustomer : onRedeemClick}
        widgetText={userloginScratchCard.roleCode === CONSTANTS.LOGIN_TYPE.ANONYMOUS
          ? stripTrip?.scratchCardWidgetTextGuest?.html || '' : stripTrip?.scratchCardWidgetText?.html || ''}
      >
        {userloginScratchCard.roleCode === CONSTANTS.LOGIN_TYPE.ANONYMOUS
          ? scratchCardWidgetButtonTextGuest : scratchCardWidgetButtonText}
      </Strip>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseClick}
        dataProp={getDataProp(combinedData, isShimmer, unscratchedImage)}
        isShimmer={isShimmer}
        noScratched={isScrateched}
        showCouponCode={showCouponCode}
      />
    </div>
  );
};

export default ScratchCardWidget;
