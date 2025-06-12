import { adobeAnalytic } from 'skyplus-design-system-app/dist/des-system/analyticUtils';

function AnalyticBuilder() {
  let interactionType = '';
  let event = {};
  let page = {};
  let product = {
    productViewed: {
      addons: '1',
    },
  };
  let pageInfo = {};
  const errorObj = {};
  let loyalty = null;

  return {
    setInteractionType(_interactionType) {
      interactionType = _interactionType;
      return this;
    },
    setEvent(_event) {
      event = _event;
      return this;
    },
    setPage(_page) {
      page = _page;
      return this;
    },
    setProduct(_product) {
      product = _product;
      return this;
    },
    setPageInfo(pageName, flow, platform) {
      pageInfo = {
        pageName,
        siteSection: flow,
        journeyFlow: flow,
        platform,
      };
      return this;
    },
    setErrorObj(_errorObj) {
      page.error = _errorObj;
      return this;
    },
    setLoyalty(_loyalty) {
      loyalty = _loyalty;
      return this;
    },
    send() {
      adobeAnalytic({
        state: {},
        commonInfo: {
          page: {
            pageInfo,
          },
        },
        eventProps: {
          event,
          interactionType,
          page,
          product,
          ...(loyalty && { loyalty }),
        },
        errorObj,
      });
    },
  };
}

export default AnalyticBuilder;
