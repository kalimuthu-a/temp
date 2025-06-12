import React, { useEffect, useState } from 'react';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';

import userIdentity from 'skyplus-design-system-app/src/functions/UserIdentity';
import { encryptAESForLogin } from 'skyplus-design-system-app/src/functions/loginEncryption';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import Card from '../card/Card';
import { useTripSummaryContext } from '../../store/scratch-card-context';
import { scratchCardAEMData, scratchCardCouponAPIData } from '../../services/index';
import { mapDataWithOfferId, mergeStatusIntoOffers, getSessionUser, getSessionUserScratchCard } from '../../utils';
import ScratchCardFallback from '../ScratchCardFallback/ScratchCardFallback';
import { pushAnalytic } from '../../utils/analyticEvents';
import BROWSER_STORAGE_KEYS, { ANALTYTICS, LOGIN_TYPE } from '../../constants';

const CardStacker = () => {
  const [mergedOffers, setMergedOffers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [dataObj, setDataObj] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [MembershipID, setMembershipID] = useState([]);
  const [userloginScratchCard, setuserloginScratchCard] = useState(() => getSessionUserScratchCard());

  const {
    scratchCardApiData,
    aemData,
    updateScratchCardApiData,
    updateAemData,
  } = useTripSummaryContext();

  const updateContextWithApiData = () => {
    Promise.all([scratchCardAEMData(), scratchCardCouponAPIData()])
      .then(([aemDataRes, APIRes]) => {
        updateScratchCardApiData({ ...APIRes });
        updateAemData(aemDataRes);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  };
  useEffect(() => {
    if (MembershipID) {
      updateContextWithApiData();
    }
  }, [MembershipID]);

  useEffect(() => {
    setTimeout(() => {
      const tokenObj = Cookies.get(BROWSER_STORAGE_KEYS.ROLE_DETAILS, true) || '';
      if (tokenObj?.roleCode === LOGIN_TYPE.ANONYMOUS) {
        if (window.enableOldLogin) {
          userIdentity.dispatchLoginEvent();
        } else {
          userIdentity.dispatchSSOLoginEvent();
        }
      }
    }, 2000);
  }, [userloginScratchCard]);
  const graphQL = aemData?.data?.scratchCardPartnersByPath?.item;
  const expiredCoupon = aemData?.data?.scratchCardPartnersByPath?.item?.expiredText;

  useEffect(() => {
    if (scratchCardApiData && scratchCardApiData.status) {
      const offerIds = scratchCardApiData?.values?.coupon_list?.map((item) => item?.offer_id);
      const brandIds = scratchCardApiData?.values?.coupon_list?.map((item) => item?.brand_id);
      const apiItem = scratchCardApiData?.values?.coupon_list?.map((item) => item);
      const active = scratchCardApiData?.values?.coupon_list?.filter((item) => item?.coupon_status === 'ASSIGNED');
      const expiry = scratchCardApiData?.values?.coupon_list?.filter((item) => new Date(item.validity) < new Date());
      setStatuses(apiItem);
      const cardObj = mapDataWithOfferId(graphQL, brandIds, ...offerIds);
      setDataObj(cardObj);
      pushAnalytic({
        data: {
          _event: ANALTYTICS.DATA_CAPTURE_EVENTS.SCRATCH_CARD,
          _totalcard: `${scratchCardApiData?.values?.total_records} | ${active.length} | ${expiry.length}`,
          _customerid: encryptAESForLogin(getSessionUser()),

        },
        event: ANALTYTICS.DATA_CAPTURE_EVENTS.SCRATCH_CARD,
      });
    }
  }, [scratchCardApiData]);

  useEffect(() => {
    if (dataObj && statuses.length > 0) {
      const combinedData = mergeStatusIntoOffers(dataObj, statuses);

      setMergedOffers(combinedData);
    }
  }, [dataObj, statuses]);

  const userData = () => {
    // eslint-disable-next-line prefer-const
    let memID = getSessionUser();
    setMembershipID(memID);
    // eslint-disable-next-line no-shadow, prefer-const
    let userloginScratchCard = getSessionUserScratchCard();
    setuserloginScratchCard(userloginScratchCard);
  };
  useEffect(() => {
    userIdentity.subscribeToLogin(userData);
    return () => {
      userIdentity.unSubscribeToLogin(userData);
    };
  }, []);
  return (
    <div className="cardstacker">
      {mergedOffers?.length > 0 ? (
        mergedOffers.map((card) => (
          <Card
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(true)}
            key={uniq()}
            imageSrc={card.unscratchedImage}
            isScratched={card.coupon_status}
            card={card}
            isExpired={card.validity}
            expiredText={expiredCoupon}
          />
        ))
      ) : scratchCardApiData && !scratchCardApiData.status && (
        <ScratchCardFallback
          noScratchCardText={graphQL?.noScratchCardText}
          noScratchCardButtonText={graphQL?.noScratchCardButtonText}
          noScratchCardButtonLink={graphQL?.noScratchCardButtonLink}
        />
      )}
    </div>
  );
};

export default CardStacker;
