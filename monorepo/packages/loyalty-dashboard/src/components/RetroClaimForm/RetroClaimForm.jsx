import { useState, useEffect } from 'react';
import './RetroClaimForm.scss';

import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';

import { UTIL_CONSTANTS, validateForm, formatNumber, localStorageKeys, getPointsToUpdateCookie } from '../../utils';
import { retroClaimPost } from '../../services';
import { useUserSummaryContext } from '../../store/user-summary-context';

import { BROWSER_STORAGE_KEYS, USER_CARD, ANALYTICS_EVENTS, AA_CONSTANTS } from '../../constants';
import { formatDate } from '../../utils/date';
import analyticEvents from '../../utils/analyticEvents';

const RetroClaimForm = () => {
  const { userData, retroClaimData } = useUserSummaryContext();
  const authUser = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
  const [isMobile] = useIsMobile();
  const [active, setActive] = useState(false);
  const [showPointAccordion, setShowPointAccordion] = useState(false);
  const [accordionData, setAccordionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    pnr: '',
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    errors: {
      pnr: true,
      firstName: false,
      lastName: false,
    },
    isLoading: false,
  });

  const [alert, setAlert] = useState({ type: 'error', msg: '' });
  const currentDate = formatDate(new Date(), UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY);
  const [genericErrorMessage, setGenericErrorMessage] = useState('');

  useEffect(() => {
    //  Page load datalayer
    const analyticsObj = {
      data: {
        _event: ANALYTICS_EVENTS.RETRO_PAGE_LOAD,
        interactionType: 'Page load',
        pageInfo: {
          pageName: AA_CONSTANTS.PAGE_NAME,
          siteSection: AA_CONSTANTS.SITE_SECTION,
          projectName: AA_CONSTANTS.PROJECT_NAME,
          platform: isMobile ? 'Mweb' : 'Web',
          journeyFlow: AA_CONSTANTS.JOURNEY_FLOW,
        },
      },
      event: 'pageload',
    };
    analyticEvents(analyticsObj);
  }, []);

  useEffect(() => {
    let localStorageObj = null;
    try {
      localStorageObj = JSON.parse(localStorage.getItem(localStorageKeys.GENERIC_DATA));

      setGenericErrorMessage(
        localStorageObj?.info_errorMessageItemListByPath?.items
          ?.retroClaimGenericErrorMessage?.message
        || retroClaimData?.genericErrorMessage,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [retroClaimData]);

  const onChangeForm = (key, value) => {
    const formTemp = { ...formData, [key]: value };
    const errors = validateForm(formTemp);

    setFormData({
      ...formTemp,
      errors,
    });
  };

  const getDynamicBindedMsg = (responseError, message = '') => {
    const dynamicData = responseError?.error?.dynamicData || {};
    return message.replace(/{claimSector}/g, dynamicData.claimSector || '')
      .replace(/{points}/g, dynamicData.claimPoint || '')
      .replace(/{errorSector}/g, dynamicData.errorSector || '');
  };

  const onClickSubmit = async () => {
    if (Object.keys(formData.errors).length > 0) {
      return;
    }
    // CTA click datalayer
    let analyticsObj = {
      data: {
        _event: ANALYTICS_EVENTS.RETRO_CTA_CLICK,
        interactionType: 'Link /Button Click',
        pageInfo: {
          pageName: AA_CONSTANTS.PAGE_NAME,
          siteSection: AA_CONSTANTS.SITE_SECTION,
          projectName: AA_CONSTANTS.PROJECT_NAME,
          platform: isMobile ? 'Mweb' : 'Web',
          journeyFlow: AA_CONSTANTS.JOURNEY_FLOW,
        },
        eventInfo: {
          name: 'Claim Points',
          position: '',
          component: '',
        },
        productInfo: {
          pnr: formData.pnr,
        },
        loyaltyInfo: {
          dateToReview: userData?.tierRetain?.tierPoint?.targetdate,
        },
      },
      event: 'Points_Claim_Initated',
    };
    analyticEvents(analyticsObj);
    setAlert({ type: 'error', msg: '' });
    setShowPointAccordion(false);
    setAccordionData(null);
    setIsLoading(true);
    setFormData((prev) => ({ ...prev, isLoading: true }));
    const pnrDetails = await retroClaimPost(
      formData.pnr,
      authUser?.loyaltyMemberInfo?.FFN,
      formData.firstName,
      formData.lastName,
    );
    if (pnrDetails?.responseError) {
      const error = getErrorMsgForCode(pnrDetails?.responseError?.error?.errorcode);
      const updatedErrorMsg = getDynamicBindedMsg(pnrDetails?.responseError, error?.message);
      setAlert({
        type: 'error',
        msg: updatedErrorMsg,
      });
      getPointsToUpdateCookie();
    } else if (pnrDetails?.responseSuccess?.error?.[0]?.code === '604') {
      setAlert({
        type: 'error',
        msg: retroClaimData?.pointsAlreadyAddedInfo,
      });
    } else if (
      pnrDetails?.responseSuccess?.success
      && pnrDetails?.booking?.info?.owningCarrierCode !== USER_CARD.CARRIER_CODE
    ) {
      setAlert({
        type: 'error',
        msg: retroClaimData?.partnerFlightsClaimInfo,
      });
    } else if (
      pnrDetails?.responseSuccess?.success
      && pnrDetails?.responseSuccess?.result?.totalEarnPoints > 0
    ) {
      setAlert({
        type: 'success',
        msg: retroClaimData.successMessage,
      });
      setAccordionData(pnrDetails);
      setShowPointAccordion(true);
      getPointsToUpdateCookie();
      // success analytics
      analyticsObj = {
        data: {
          _event: ANALYTICS_EVENTS.RETRO_POINTS_CLAIMED,
          interactionType: 'Response',
          pageInfo: {
            pageName: AA_CONSTANTS.PAGE_NAME,
            siteSection: AA_CONSTANTS.SITE_SECTION,
            projectName: AA_CONSTANTS.PROJECT_NAME,
          },
          eventInfo: {
            name: 'Points Claimed',
          },
          loyalty: {
            pointsEarned: pnrDetails?.responseSuccess?.result?.totalEarnPoints,
            pointsAvailable: userData?.loyaltyPoints,
            passAvailable: userData?.couponDetail?.filter((f) => f.redeemId === null).length,
            Spent: userData?.lIfeTimePurchase,
          },
        },
        event: 'Points_Claimed',
      };
      analyticEvents(analyticsObj);
    } else {
      setAlert({ type: 'error', msg: genericErrorMessage });
    }
    setFormData((prev) => ({ ...prev, isLoading: false }));
    setIsLoading(false);
  };

  const onCloseAlert = () => {
    setAlert({ type: 'error', msg: '' });
  };

  return (
    <div>
      {retroClaimData ? (
        <div className="retro-claim">
          {isMobile ? (
            <>
              <h2
                className="retro-claim--title"
                dangerouslySetInnerHTML={{
                  __html: `${retroClaimData?.claimPointsTitle?.html}`,
                }}
              />
              <p
                className="retro-claim--description"
                dangerouslySetInnerHTML={{
                  __html: `${retroClaimData?.claimPointsDescription?.html}`,
                }}
              />
            </>
          ) : null}

          <div className="retro-claim--container">
            <div className="retro-claim--left">
              {!isMobile ? (
                <>
                  <h2
                    className="retro-claim--title"
                    dangerouslySetInnerHTML={{
                      __html: `${retroClaimData?.claimPointsTitle?.html}`,
                    }}
                  />
                  <p
                    className="retro-claim--description"
                    dangerouslySetInnerHTML={{
                      __html: `${retroClaimData?.claimPointsDescription?.html}`,
                    }}
                  />
                </>
              ) : null}

              <div className="retro-claim--form-section">
                <Input
                  placeholder={retroClaimData.pnrLabel}
                  name="pnr-booking-ref"
                  onChange={(e) => onChangeForm('pnr', e.target.value.toUpperCase())}
                  inputWrapperClass="mb-0"
                  value={formData.pnr}
                  maxLength={6}
                />
                <div className="form-group">
                  <Input
                    placeholder={retroClaimData.firstNamePlaceholder}
                    name="first-name-ref"
                    onChange={(e) => onChangeForm('firstName', e.target.value)}
                    disabled="true"
                    inputWrapperClass="mb-0"
                    value={formData.firstName}
                  />
                  <Input
                    placeholder={retroClaimData.lastNamePlaceholder}
                    name="last-name-ref"
                    onChange={(e) => onChangeForm('lastName', e.target.value)}
                    disabled="true"
                    inputWrapperClass="mb-0"
                    value={formData.lastName}
                  />
                </div>
                <div className="d-block ">
                  <Button
                    key="Claim Points"
                    onClick={onClickSubmit}
                    disabled={Object.keys(formData.errors).length > 0}
                    block
                    type="submit"
                    loading={isLoading}
                  >
                    {retroClaimData.claimsPointsCtaLabel}
                  </Button>
                </div>
              </div>
            </div>
            <div className="retro-claim--image-section">
              <img
                src={retroClaimData.BannerImage._publishUrl}
                alt={retroClaimData.bannerImageAltText}
                className="retro-claim-img"
              />
            </div>
          </div>
          {showPointAccordion ? (
            <div
              className="retro-claim--card"
              onClick={() => setActive(!active)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActive(!active);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className={`acc-data ${active ? 'active' : ''}`}>
                <div className="top-content">
                  <div className="left-container">
                    <span className="retro-claim--card--title">
                      {retroClaimData.pointsCreditedLabel}
                    </span>
                    <div className="retro-claim--card--date">{currentDate}</div>
                  </div>
                  <div className="right-container">
                    <span className="retro-claim--card--points earned">
                      +
                      {formatNumber(
                        accordionData?.responseSuccess?.result?.totalEarnPoints,
                      )}
                    </span>
                    <span className="icon-accordion-down-simple icon-size-sm p-4 headerv2__login__wrapper-icon" />
                  </div>
                </div>
              </div>
              {active ? (
                <div className="active-data">
                  <div className="content">
                    <div className="title">{retroClaimData.pnrLabel}: </div>
                    <div className="desc">
                      {accordionData?.booking?.recordLocator}
                    </div>
                  </div>
                  {/* <div className="content">
                    <div className="title">
                      {retroClaimData.transactionChannelLabel}:
                    </div>
                    <div className="desc">Indigo</div>
                  </div> */}
                  <div className="booking-details">
                    <div className="booking-card">
                      {/* <div className="booking-date">10 Oct, 24</div> */}
                      {/* <div className="divider" /> */}
                      <div className="booking-detail-container">
                        <div className="left">
                          {/* <p className="sm-txt">07:00</p> */}
                          <p className="lg-txt">
                            {
                              accordionData?.booking?.journeys[0]?.designator
                                ?.origin
                            }
                          </p>
                          {/* <p className="md-txt">Mumbai</p> */}
                        </div>
                        <div className="center">
                          {!isMobile && (
                            <div className="transaction-accordion-tabcontent-booking-info-flight-icon">
                              <span className="icon icon-Flight" />
                              <span className="dotted-line" />
                              <span className="circle" />
                            </div>
                          )}
                        </div>
                        <div className="right">
                          {/* <p className="sm-txt">11:15</p> */}
                          <p className="lg-txt">
                            {
                              accordionData?.booking?.journeys[0]?.designator
                                ?.destination
                            }
                          </p>
                          {/* <p className="md-txt">Delhi</p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="point-summary">
                    <div className="sect-title">
                      {retroClaimData.pointSummaryLabel}
                    </div>
                    <div className="divider" />
                    <div className="content">
                      <div className="title">
                        {retroClaimData?.basePointsLabel}
                      </div>
                      <div className="desc">
                        +
                        {formatNumber(
                          accordionData?.responseSuccess?.result?.breakup
                            ?.baseEarnPoint,
                        )}
                      </div>
                    </div>
                    <div className="content">
                      <div className="title">
                        {retroClaimData?.onlineBonusPointsLabel}
                      </div>
                      <div className="desc">
                        +
                        {formatNumber(
                          accordionData?.responseSuccess?.result?.breakup
                            ?.bonusEarnPoint,
                        )}
                      </div>
                    </div>
                    <div className="content">
                      <div className="title">
                        {retroClaimData?.tierPointsLabel}
                      </div>
                      <div className="desc">
                        +
                        {formatNumber(
                          accordionData?.responseSuccess?.result?.breakup
                            ?.tierEarnPoint,
                        )}
                      </div>
                    </div>
                    <div className="content">
                      <div className="title">
                        {retroClaimData?.pointsOnAncillariesLabel}
                      </div>
                      <div className="desc">
                        +
                        {formatNumber(
                          accordionData?.responseSuccess?.result?.breakup
                            ?.ancillaryEarnPoint,
                        )}
                      </div>
                    </div>
                    <div className="divider" />
                    <div className="total-content">
                      <div className="total-points">
                        {retroClaimData.totalPonitsLabel}
                      </div>
                      <div className="desc">
                        +
                        {formatNumber(
                          accordionData?.responseSuccess?.result
                            ?.totalEarnPoints,
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
          {alert.msg !== '' && (
            <div className={`alert ${alert.type}`}>
              <span className="alert-icon">
                <i
                  className={
                    alert.type === 'error' ? 'icon-info' : 'icon-success'
                  }
                />
              </span>
              <span className="msg">{alert.msg}</span>
              <a
                className="close-alert"
                onClick={onCloseAlert}
                role="button"
                tabIndex={0}
              >
                <i className="sky-icons icon-close-simple sm" />
              </a>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

RetroClaimForm.propTypes = {
};

export default RetroClaimForm;
