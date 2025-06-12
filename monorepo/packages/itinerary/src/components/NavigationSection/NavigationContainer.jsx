import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from 'skyplus-design-system-app/dist/des-system/Tabs';
import { useSelector } from 'react-redux';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { CONSTANTS } from '../../constants';
// eslint-disable-next-line import/no-cycle
import NavButtonList from './NavButtonList';
import { pushAnalytic } from '../../utils/analyticEvents';
import { pushDataLayer } from '../../utils/dataLayerEvents';

const { TAB_KEYS } = CONSTANTS;

const ADDON_TAB_KEYS = [
  TAB_KEYS.ADDFASTFORWARD,
  TAB_KEYS.ADDSNACKSBAGS,
  TAB_KEYS.ADDLOUNGE,
  TAB_KEYS.ADDPRIME,
  TAB_KEYS.ADDQUICKBOARD,
  TAB_KEYS.ADD6EBAR,
  TAB_KEYS.ADDPRIME,
  TAB_KEYS.ADDSEATNEAT,
  TAB_KEYS.ADDDELAYEDNLOSTBAGGAGE,
  TAB_KEYS.ADDSPORTSEQUIPMENT,
  TAB_KEYS.ADDTA,
  TAB_KEYS.ADDGOODNIGHTKIT,
];

// eslint-disable-next-line sonarjs/cognitive-complexity
const NavigationContainer = ({ isBookingFlow, refreshData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabOptions, setTabOptions] = useState({});
  const itineraryApiData = useSelector((state) => state.itinerary?.apiData) || {};
  const apiNavigationMenu = itineraryApiData?.navigationMenu_Mb || {};
  const pnrValue = itineraryApiData?.bookingDetails?.recordLocator || '';
  const { bookingDetails } = itineraryApiData || [];
  const isPartialRedemption = bookingDetails.changeFlightValidation?.code === TAB_KEYS?.PARTIAL_REDEMPTION;
  const [pnrBookingStatus, setPnrBookingStatus] = useState('');
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const { itineraryMainByPath } = mfData;
  const { saveOrShareLabel, modifyLabel, quickActionsTitle,
    quickActions, modifyOptions, disableReasonCodeMap, redemptionPNR } = itineraryMainByPath?.item || {};
  const extraApiNavigationMenu = itineraryApiData?.checkinNavigationMenu || '';

  const constructNavOptions = () => {
    const modifyUnfilteredOptions = modifyOptions?.slice() || [];
    const saveUnfilteredOptions = quickActions?.slice() || [];
    const tabData = [
      {
        label: itineraryMainByPath?.item?.saveOrShareLabel,
        saveShareOptions: [],
      },
      {
        label: itineraryMainByPath?.item?.modifyLabel,
        modifyOptions: [],
      },
    ];
    const options = {};
    const optionsSave = {};
    apiNavigationMenu?.Modify?.forEach((navItem) => {
      const disableAEMReasonObj = disableReasonCodeMap?.find((it) => {
        return it?.key?.toLowerCase() === navItem?.disbaleReason?.toLowerCase();
      }) || {};
      const isDisabledConfigPresent = disableAEMReasonObj?.value
       || CONSTANTS.DISABLE_REASON_CODE[navItem.disbaleReason];
      if (!navItem.isDisabled || (navItem.isDisabled && navItem.disbaleReason && isDisabledConfigPresent)) {
        options[navItem?.buttonCode?.toLowerCase()] = navItem;
      }
    });
    apiNavigationMenu?.Saver?.forEach((navItem) => {
      const disableAEMReasonObj = disableReasonCodeMap?.find((it) => {
        return it?.key?.toLowerCase() === navItem?.disbaleReason?.toLowerCase();
      }) || {};
      const isDisabledConfigPresent = disableAEMReasonObj?.value
       || CONSTANTS.DISABLE_REASON_CODE[navItem.disbaleReason];
      if (!navItem.isDisabled || (navItem.isDisabled && navItem.disbaleReason && isDisabledConfigPresent)) {
        optionsSave[navItem?.buttonCode?.toLowerCase()] = navItem;
      }
    });

    extraApiNavigationMenu?.forEach((navItem) => {
      if (!navItem.isDisabled || (navItem.isDisabled && navItem.disbaleReason)) {
        options[navItem?.buttonCode?.toLowerCase()] = navItem;
      }
    });

    // Show only enable CTA's for Modification option
    Object.values(options).forEach((apiItem) => {
      if (!apiItem.isDisabled || (apiItem.isDisabled && apiItem.disbaleReason)) {
        modifyUnfilteredOptions?.find((modifyItem) => { // NOSONAR
          const apiText = apiItem?.buttonCode?.replace(/\s/g, '')?.toLowerCase();
          const modifyOptionCode = modifyItem?.buttonCode
            ?.replace(/\s/g, '')
            ?.toLowerCase();
          if (apiText === modifyOptionCode) {
            tabData[1].modifyOptions?.push({
              ...apiItem,
              label: modifyItem?.buttonValue,
              code: apiText,
              iconClass: modifyItem?.icon,
              link: modifyItem?.path || modifyItem?.buttonLink,
              buttonCode: apiText,
            });
          }
          return null;
        });
      }
    });
    // Show only enable CTA for Save option
    Object.values(optionsSave).forEach((apiItem) => {
      if (!apiItem.isDisabled || (apiItem.isDisabled && apiItem.disbaleReason)) {
        saveUnfilteredOptions?.find((modifyItem) => { // NOSONAR
          const apiText = apiItem?.buttonCode?.replace(/\s/g, '')?.toLowerCase();
          const modifyOptionCode = modifyItem?.buttonCode
            ?.replace(/\s/g, '')
            ?.toLowerCase();
          if (apiText === modifyOptionCode) {
            tabData[0].saveShareOptions?.push({
              ...apiItem,
              label: modifyItem?.buttonValue,
              code: apiItem?.buttonCode,
              iconClass: modifyItem?.icon,
              link: modifyItem?.path || modifyItem?.buttonLink,
            });
          }
          return null;
        });
      }
    });

    // addon options validation -START
    const addonOptionAEM = modifyUnfilteredOptions?.find(
      (mItem) => mItem.buttonCode === 'editAddons',
    );
    const apiAddoEnabledCodeList = Object.values(options).filter(
      (opItem) => ADDON_TAB_KEYS.includes(opItem.buttonCode?.toUpperCase())
        && !opItem.isDisabled,
    );
    if (apiAddoEnabledCodeList.length > 0) {
      tabData[1].modifyOptions?.push({
        label: addonOptionAEM?.buttonValue,
        code: addonOptionAEM?.buttonCode,
        iconClass: addonOptionAEM?.icon,
        link: addonOptionAEM?.path,
      });
    }
    // addon options validation -END
    setTabOptions(tabData);
  };

  useEffect(() => {
    if (pnrValue !== '' && (pnrBookingStatus !== pnrValue)) {
      constructNavOptions();
      setPnrBookingStatus(pnrValue);
    }
  }, [pnrBookingStatus, pnrValue]);

  const renderTabContent = (item) => {
    return <div key={uniq()}>{item?.label}</div>;
  };

  const onTabClick = (tab, index) => {
    setActiveIndex(index);
    // Adobe Analytics
    pushAnalytic({
      data: {
        _event: 'itineraryButtonAction',
        _componentName: index === 0 ? saveOrShareLabel : modifyLabel,
      },
      event: 'click',
      error: {},
      page: {
        eventInfo: {
          component: index === 0 ? saveOrShareLabel : modifyLabel,
        },
      },
    });
    // Google Analytics
    pushDataLayer({
      data: {
        _event: 'link_click',
        pnrResponse: { ...itineraryApiData },
      },
      event: 'link_click',
      props: {
        clickText: index === 0 ? saveOrShareLabel : modifyLabel,
        clickNav: index === 0 ? saveOrShareLabel : modifyLabel,
      },
    });
  };

  return (
    <div className={`navigation-cta ${isBookingFlow ? 'confirmation-cta' : ''}`}>
      {!isBookingFlow ? (
        <div className="navigation-cta__container">
          <Tabs
            tabs={tabOptions}
            onTabClick={onTabClick}
            activeIndex={activeIndex}
            renderTabContent={renderTabContent}
          />
          <div className="navigation-cta__content">
            {tabOptions[activeIndex]?.saveShareOptions && (
            <div className="navigation-cta__content-wrapper save-share">
              <NavButtonList
                list={tabOptions[activeIndex]?.saveShareOptions}
                refreshData={refreshData}
                parentTabName={activeIndex === 0 ? saveOrShareLabel : modifyLabel}
              />
            </div>
            )}
            {tabOptions[activeIndex]?.modifyOptions && (
              <>
              {isPartialRedemption && redemptionPNR ? (
                <div className="payment-transaction__container__transaction__note hold redemption-pnr">
                  <Icon
                    className="icon-info-filled"
                    role="button"
                    aria-label="close note text"
                  />
                  <div
                    className="description"
                    dangerouslySetInnerHTML={
                    { __html: redemptionPNR }
                    }
                  />
                </div>
              ) : ''}
              <div className="navigation-cta__content-wrapper modify">
                <NavButtonList
                  list={tabOptions[activeIndex]?.modifyOptions}
                  refreshData={refreshData}
                  parentTabName={activeIndex === 0 ? saveOrShareLabel : modifyLabel}
                />
              </div>
            </>)}
          </div>
        </div>
      )
        : (
          <div className={`navigation-cta__container ${isBookingFlow ? 'quick-action' : ''}`}>
            {
              (bookingDetails?.recordLocators?.length > 0 && tabOptions[activeIndex]?.saveShareOptions) ? (
                <>
                  <HtmlBlock html={quickActionsTitle?.html} className="quick-action--title" />
                  <div className="navigation-cta__content-wrapper save-share">
                    <NavButtonList
                      list={tabOptions[activeIndex]?.saveShareOptions}
                      refreshData={refreshData}
                      parentTabName={activeIndex === 0 ? saveOrShareLabel : modifyLabel}
                    />
                  </div>
                </>
              )
                : quickActions && (
                  <>
                    <HtmlBlock html={quickActionsTitle?.html} className="quick-action--title" />
                    <div className="navigation-cta__content-wrapper save-share">
                      <NavButtonList
                        list={quickActions}
                        refreshData={refreshData}
                        parentTabName={saveOrShareLabel}
                      />
                    </div>
                  </>
                )
            }
          </div>
        )}
    </div>
  );
};

NavigationContainer.propTypes = {
  isBookingFlow: PropTypes.any,
  refreshData: PropTypes.any,
};

export default NavigationContainer;
