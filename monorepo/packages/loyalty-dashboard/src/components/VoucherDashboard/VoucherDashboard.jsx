import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './VoucherDashboard.scss';

import Tabs from './Tabs/Tabs';
import Vouchers from './Vouchers/Vouchers';
import VoucherHistory from './VoucherHistory/VoucherHistory';
import { getQueryStringByParameterName } from '../../utils';
import { useUserSummaryContext } from '../../store/user-summary-context';
import { QUERYPARAM_KEY,
  TIER_BENEFIT_UTLISATION_TAB,
  ANALYTICS_EVENTS,
  VOUCHER_CONSTANTS,
  INDIGO,
  PARTNER_HISTORY_ANALYTICS,
} from '../../constants';

import analyticEvents from '../../utils/analyticEvents';

const VoucherDashboard = () => {
  const { voucherAEMData, userData } = useUserSummaryContext();
  const couponDetail = userData?.couponDetail || [];
  const partnerVouchersDetails = userData?.partner_vouchers_details || [];

  const [filteredCouponData, setFilteredCouponData] = useState(null);
  const queryParamTab = getQueryStringByParameterName(QUERYPARAM_KEY.TABKEY);
  const [activeTab, setActiveTab] = useState(queryParamTab || voucherAEMData.voucherTypeTabs?.[0]?.key);

  const getPartnerVoucherCouponLeft = (partnerVoucher) => {
    let partnerExpiredVoucher = 0;
    let partnerActiveVoucher = 0;

    partnerVoucher?.forEach((item) => {
      if (item?.expiryDate && !item.redeemId) {
        const now = new Date();
        const expiry = new Date(item.expiryDate);
        if (now < expiry) {
          partnerActiveVoucher += 1;
        } else {
          partnerExpiredVoucher += 1;
        }
      }
    });
    return {
      partnerExpiredVoucher,
      partnerActiveVoucher,
    };
  };

  const getAnalyticsCall = (coupons) => {
    const { partnerExpiredVoucher, partnerActiveVoucher } = getPartnerVoucherCouponLeft(coupons);

    const analyticsObj = {
      data: {
        _event: ANALYTICS_EVENTS.PARTNER_HISTORY,
        interactionType: ANALYTICS_EVENTS.PARTNER_HISTORY,
        pageInfo: {
          pageName: VOUCHER_CONSTANTS.PAGE_NAME,
          searchResultCount:
              `${partnerActiveVoucher}~${partnerExpiredVoucher}`,
          siteSection: VOUCHER_CONSTANTS.SITE_SECTION,
          journeyFlow: VOUCHER_CONSTANTS.JOURNEY_FLOW,
        },
        eventInfo: {
          name: PARTNER_HISTORY_ANALYTICS,
        },
      },
      event: ANALYTICS_EVENTS.PARTNER_HISTORY,
    };
    analyticEvents(analyticsObj);
  };

  const onTabChange = (tab) => {
    setActiveTab(tab);
    const arr = {
      current: [],
      history: [],
      voucher: [],
      partner_voucher: [],
    };
    let coupons;
    if (tab === TIER_BENEFIT_UTLISATION_TAB.ALL_TRANSACTIONS) {
      coupons = [...couponDetail, ...partnerVouchersDetails];
    } else if (tab === TIER_BENEFIT_UTLISATION_TAB.LOYALTY) {
      const loyaltyCoupon = couponDetail?.filter((coupon) => [INDIGO].includes(coupon?.category?.toLowerCase()));
      coupons = [...loyaltyCoupon];
    } else if (tab === TIER_BENEFIT_UTLISATION_TAB.PARTNERS) {
      coupons = [...partnerVouchersDetails];
      getAnalyticsCall(coupons);
    }

    if (tab === TIER_BENEFIT_UTLISATION_TAB.PARTNERS) {
      coupons?.map((coupon) => {
        const partnerCoupons = { ...coupon };
        arr.voucher.push(coupon);
        if (!coupon?.redeemId) {
          partnerCoupons.isExpired = new Date(coupon?.expiryDate) < new Date();
          arr.partner_voucher.push(partnerCoupons);
        }
      });
    } else {
      coupons?.map((coupon) => {
        const currentCoupons = { ...coupon };
        arr.history.push(coupon);
        if (!coupon?.redeemId) {
          currentCoupons.isExpired = new Date(coupon?.expiryDate) < new Date();
          arr.current.push(currentCoupons);
        }
      });
    }
    setFilteredCouponData(arr);
  };

  const getAnalyticsCallonPageload = () => {
    const { partnerExpiredVoucher, partnerActiveVoucher } = getPartnerVoucherCouponLeft(partnerVouchersDetails);

    const AllactiveVoucher = [...couponDetail, ...partnerVouchersDetails]
      ?.filter((coupon) => coupon?.expiryDate && !coupon.redeemId && (new Date(coupon?.expiryDate) > new Date()));
    const AllexpiredVoucher = [...couponDetail, ...partnerVouchersDetails]
      ?.filter((coupon) => !coupon?.redeemId && new Date(coupon?.expiryDate) < new Date());
    const loyaltyExpiredVoucher = [...couponDetail]
      ?.filter((coupon) => coupon?.category.toLowerCase() === INDIGO && (new Date(coupon?.expiryDate) < new Date()));
    const loyaltyActiveVoucher = [...couponDetail]
      ?.filter((coupon) => coupon?.category.toLowerCase() === INDIGO
        && !coupon.redeemId && (new Date(coupon?.expiryDate) > new Date()));

    const analyticsObj = {
      data: {
        _event: ANALYTICS_EVENTS.PARTNERS_VOUCHER_LOAD,
        interactionType: 'Page load',
        pageInfo: {
          pageName: VOUCHER_CONSTANTS.PAGE_NAME,
          searchResultCount:
          `${AllactiveVoucher.length}~${AllexpiredVoucher?.length}|${loyaltyActiveVoucher?.length}~${loyaltyExpiredVoucher?.length}|${partnerActiveVoucher}~${partnerExpiredVoucher}`,
          siteSection: VOUCHER_CONSTANTS.SITE_SECTION,
          journeyFlow: VOUCHER_CONSTANTS.JOURNEY_FLOW,
        },
      },
      event: 'pageload',
    };
    analyticEvents(analyticsObj);
  };

  useEffect(() => {
    if (couponDetail) {
      getAnalyticsCallonPageload();
    }
    onTabChange(activeTab);
  }, [couponDetail]);

  return (
    <>
      <span className="voucher-dashboard-title">
        {voucherAEMData.loyaltyVouchersTitle}
      </span>
      <span
        className="voucher-dashboard-heading"
        dangerouslySetInnerHTML={{
          __html: `${voucherAEMData.loyaltyVouchersDescription?.html}`,
        }}
      />
      {(couponDetail?.length || partnerVouchersDetails?.length)
      && <Tabs voucherTabs={voucherAEMData.voucherTypeTabs} activeTab={activeTab} onTabChange={onTabChange} />}
      <Vouchers voucherAEMData={voucherAEMData} filteredCouponData={filteredCouponData} tab={activeTab} />
      <VoucherHistory voucherAEMData={voucherAEMData} filteredCouponData={filteredCouponData} activeTab={activeTab} />
    </>
  );
};

VoucherDashboard.propTypes = {
  apiData: PropTypes.object,
};

export default VoucherDashboard;
