import { CUSTOM_EVENTS } from '../constants/constants';

const nextButtonStateUtil = (flag) => {
  const fareSummaryLoaderButtonEvent = (data) => new CustomEvent(CUSTOM_EVENTS.EVENT_FARE_SUMMARY_DATA_TRANSFER, data);
  document.dispatchEvent(
    fareSummaryLoaderButtonEvent({
      bubbles: true,
      detail: { isDisable: flag },
    }),
  );
};

export const nextButtonLoadingStateUtil = (flag) => {
  const fareSummaryLoaderButtonEvent = (data) => new CustomEvent(CUSTOM_EVENTS.EVENT_FARE_SUMMARY_DATA_TRANSFER, data);
  document.dispatchEvent(
    fareSummaryLoaderButtonEvent({
      bubbles: true,
      detail: { isLoading: flag },
    }),
  );
};

export default nextButtonStateUtil;
