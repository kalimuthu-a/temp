import React, { useState, useEffect, useMemo } from 'react';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

import DangerousGood from '../../components/DangerousGood/DangerousGood';
import InfoAlert from '../../components/common/Alerts/InfoAlert';
import useAppContext from '../../hooks/useAppContext';
import { getJournies, postManualCheckin } from '../../services';
import { webcheckinActions } from '../../context/reducer';
import LocalStorage from '../../utils/LocalStorage';
import {
  XSAT_STRING,
  localStorageKeys,
  ANALTYTICS,
  GTM_ANALTYTICS,
} from '../../constants';
import WithPageLoader from '../../hoc/withPageLoader';
import analyticsEvent from '../../utils/analyticsEvent';
import gtmEvent from '../../utils/gtmEvents';
import { setAnaltyicsContext } from '../../utils/analytics/webcheckin-home';
import usePageTitle from '../../hooks/usePageTitle';

const { TRIGGER_EVENTS } = ANALTYTICS;

const DangerousGoods = () => {
  const {
    dispatch,
    aemLabel,
    state: { analyticsContext },
  } = useAppContext();

  const [checked, setChecked] = useState(false);
  const [response, setResponse] = useState(null);

  const manualCheckinRequestPayload = LocalStorage.getAsJson(
    localStorageKeys.m_c_r,
  );

  const { passengerkeys = [], journeyKey } =
    manualCheckinRequestPayload?.manualCheckinRequest?.[0] ?? {};

  useEffect(() => {
    const getApiData = async () => {
      try {
        const apiResponse = await getJournies();

        if (apiResponse.errors) {
          dispatch({
            type: webcheckinActions.SET_TOAST,
            payload: {
              variation: 'Error',
              show: true,
              description: apiResponse?.aemError?.message,
            },
          });
        } else {
          const _analyticContext = setAnaltyicsContext(apiResponse, journeyKey);

          const productInfo = _analyticContext?.productInfo;

          delete productInfo?.isCheckinClosed;

          analyticsEvent({
            event: TRIGGER_EVENTS.DANGEROUS_GOODS_PAGELOAD,
            data: {
              productInfo: _analyticContext.productInfo,
              bookingChannel: _analyticContext.bookingChannel,
            },
          });

          gtmEvent({
            event: GTM_ANALTYTICS.EVENTS.DANGEROUS_GOODS_PAGE_LOAD,
            data: {
              PNR: _analyticContext?.productInfo?.pnr,
              days_until_departure:
                _analyticContext?.productInfo?.daysUntilDeparture,
              flight_sector: _analyticContext?.productInfo?.sector,
              special_fare: _analyticContext?.productInfo?.specialFare,
              departure_date: _analyticContext?.productInfo?.departureDates,
              pax_details: _analyticContext?.gtmData?.pax_details,
              trip_type: _analyticContext?.productInfo?.tripType,
              OD: _analyticContext?.gtmData?.OD,
            },
          });

          dispatch({
            type: webcheckinActions.SET_ANALYTICS_CONTEXT,
            payload: _analyticContext,
          });
          const journies = [
            ...(apiResponse?.data?.journeysDetail ?? []),
            ...(apiResponse?.data?.smartCheckinJourneysDetail ?? []),
          ];
          setResponse({
            journery: journies.find((journey) => {
              return journey.journeyKey === journeyKey;
            }),
            ...apiResponse.data,
          });
        }

        dispatch({
          type: webcheckinActions.SET_API_DATA,
          payload: {},
        });
      } catch (err) {
        // Error Handling
      }
    };

    getApiData();
  }, []);

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  usePageTitle('dangerousGoods.headingTitle');

  const labels = useMemo(() => {
    return {
      checkboxLabel: aemLabel('dangerousGoods.termsAndConditions.0.title'),
      dangerousGoodsTitle: aemLabel('dangerousGoods.restrictedGoodsTitle.html'),
      webcheckinhomeurl: aemLabel('dangerousGoods.webCheckInHomeUrl'),
      restrictedGoodsDescription: aemLabel(
        'dangerousGoods.restrictedGoodsDescription.html',
      ),
      restrictedItemList: aemLabel('dangerousGoods.restrictedItemList', []),
      noticeTitle: aemLabel('dangerousGoods.noticeTitle'),
      noticeDescription: aemLabel('dangerousGoods.noticeDescription.html'),
      agreeAndContinueCTA: aemLabel('dangerousGoods.agreeAndContinueCTA'),
      agreeAndContinueCTALink: aemLabel(
        'dangerousGoods.agreeAndContinueCTALink',
      ),
      backToPassengerDetailsLabel: aemLabel(
        'dangerousGoods.backToPassengerDetailsLabel',
      ),
      backToPassengerDetailsLink: aemLabel(
        'dangerousGoods.backToPassengerDetailsLink',
      ),
    };
  }, [aemLabel]);

  const onClickNextHandler = async () => {
    gtmEvent({
      event: GTM_ANALTYTICS.EVENTS.DANGEROUS_GOODS_AGREE_CONTINUE,
      data: {
        PNR: analyticsContext?.productInfo?.pnr,
        days_until_departure: analyticsContext?.productInfo?.daysUntilDeparture,
        flight_sector: analyticsContext?.productInfo?.sector,
        special_fare: analyticsContext?.productInfo?.specialFare,
        departure_date: analyticsContext?.productInfo?.departureDates,
        pax_details: analyticsContext?.gtmData?.pax_details,
        trip_type: analyticsContext?.productInfo?.tripType,
        OD: analyticsContext?.gtmData?.OD,
        click_text: 'Agree and Continue',
      },
    });

    analyticsEvent({
      event: TRIGGER_EVENTS.DANGEROUS_GOODS_AGREE_CONTINUE,
      data: {},
    });

    dispatch({ type: webcheckinActions.SHOW_LOADER, payload: true });

    try {
      const checkinAPIResponse = await postManualCheckin(
        manualCheckinRequestPayload,
      );

      if (checkinAPIResponse?.data?.success) {
        if (checkinAPIResponse.data?.message === XSAT_STRING) {
          analyticsEvent({
            event: TRIGGER_EVENTS.AUTO_CHECK_SUCCESS,
            data: {
              productInfo: analyticsContext.productInfo,
              user: {
                nationality: '',
                journeyID: '',
                passengerID: '',
              },
            },
          });

          gtmEvent({
            event: GTM_ANALTYTICS.EVENTS.AUTO_CHECKIN_COMPLETE,
            data: {
              PNR: analyticsContext?.productInfo?.pnr,
              days_until_departure:
                analyticsContext?.productInfo?.daysUntilDeparture,
              flight_sector: analyticsContext?.productInfo?.sector,
              special_fare: analyticsContext?.productInfo?.specialFare,
              departure_date: analyticsContext?.productInfo?.departureDates,
              pax_details: analyticsContext?.gtmData?.pax_details,
              trip_type: analyticsContext?.productInfo?.tripType,
              OD: analyticsContext?.gtmData?.OD,
              page_name: 'Auto CheckIn',
            },
          });

          window.location.href = labels.webcheckinhomeurl;
        } else {
          LocalStorage.set(localStorageKeys.b_d_p, {
            passengerKeys: passengerkeys?.map(
              ({ passengerKey }) => passengerKey,
            ),
            segmentKeys: [],
            journeyKey,
          });
          window.location.href = labels.agreeAndContinueCTALink;
        }
      }
      if (checkinAPIResponse?.errors) {
        dispatch({
          type: webcheckinActions.SET_TOAST,
          payload: {
            variation: 'Error',
            show: true,
            description: checkinAPIResponse?.aemError?.message,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: webcheckinActions.SET_TOAST,
        payload: {
          variation: 'Error',
          show: true,
          description: 'Something went Wrong',
        },
      });
      // Error handling
    } finally {
      dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
    }
  };

  return (
    <div className="wc">
      <div className="wc-webcheckin-link mt-2">
        <i className="sky-icons icon-accordion-left-simple me-2 mt-0.5 sm" />
        <a href={labels.backToPassengerDetailsLink}>
          {labels.backToPassengerDetailsLabel}
        </a>
      </div>
      {response && (
        <div className="wc-dangerous-goods">
          <div className="col-9 wc-dangerous-goods-left">
            <DangerousGood
              title={labels.dangerousGoodsTitle}
              subTitle={labels.restrictedGoodsDescription}
              items={labels.restrictedItemList}
            />

            <Checkbox
              checked={checked}
              onChangeHandler={handleCheckboxChange}
              containerClass="terms"
            >
              {labels.checkboxLabel}
            </Checkbox>
          </div>
          <div className="col-3 wc-dangerous-goods-right">
            <InfoAlert containerClassName="important-block">
              <p className="title">{labels.noticeTitle}</p>
              <HtmlBlock
                html={labels.noticeDescription}
                className="description"
              />
              <Checkbox
                checked={checked}
                onChangeHandler={handleCheckboxChange}
                containerClass="terms mobile"
              >
                {labels.checkboxLabel}
              </Checkbox>
            </InfoAlert>
          </div>
        </div>
      )}

      <div className="wc-footer">
        <div className="wc-footer-wrapper">
          <Button onClick={onClickNextHandler} disabled={!checked}>
            {labels.agreeAndContinueCTA}
            <Icon className="icon-accordion-left-24 icon" size="sm" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithPageLoader(DangerousGoods);
