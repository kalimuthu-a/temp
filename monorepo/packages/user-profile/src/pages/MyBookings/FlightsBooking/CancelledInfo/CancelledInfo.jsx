import React from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { replaceCurlyBraces } from '../../../../functions/utils';
import {
  formatDateTime,
  getButtonLabelObj,
} from '../../../../utils/utilFunctions';
import { btnKeys } from '../../../../constants/common';
import LinkHollow from '../../../../components/common/LinkButtons/LinkHollow';

const CancelledInfo = (props) => {
  const { labels, bookingData } = props;
  const btnLabels = labels?.buttonOptions;
  const btnObjBookAgain = getButtonLabelObj(btnKeys.BOOK_AGAIN, btnLabels);
  const btnObjNeedHelp = getButtonLabelObj(btnKeys.NEED_HELP, btnLabels);

  // console.log(props);
  return (
    <div className="bg-white bg-white p-6 p-md-10 my-bookings__card-info  rounded-3">
      <div className="my-bookings__card-divider mb-6 mb-md-8" />
      <div className="d-flex justify-content-between">
        <p className="body-small-medium text-secondary">
          {labels?.cancelledDate}{' '}
          {formatDateTime(bookingData?.cancelledDate)?.formattedDateShort}
        </p>
        <p className="d-none d-md-inline body-small-medium text-secondary">
          {replaceCurlyBraces(labels?.pnrLabel, '')} {bookingData?.pnr}
        </p>
      </div>
      <div className="my-bookings__card-divider pb-6 mb-6 mb-md-8 pb-md-8" />
      <a
        className="text-decoration-none py-6 px-12 py-md-8 px-md-14 bg-secondary-light rounded-pill
          border-0 w-100 d-flex justify-content-between align-items-center"
        href={btnObjBookAgain?.path}
      >
        <div className="text-start">
          <p className="text-primary-main body-small-medium">
            {btnObjBookAgain?.buttonValue}
          </p>
          <HtmlBlock
            html={labels?.bookReturnFlight?.note}
            className="text-secondary body-small-light"
          />
          {/* <p
          className="text-secondary body-small-light"
          dangerouslySetInnerHTML={{ __html: labels?.bookReturnFlight?.description }}
        /> */}
        </div>
        <div className="bg-primary rounded-circle bg-primary-main p-5 px-7">
          <span className="sky-icons icon-arrow-top-right sm" />
        </div>
      </a>
      <LinkHollow
        extraClasses="mt-8"
        label={btnObjNeedHelp?.buttonValue}
        link={btnObjNeedHelp?.path}
      />
    </div>
  );
};

CancelledInfo.propTypes = {
  labels: PropTypes.object,
  bookingData: PropTypes.object,
};

export default CancelledInfo;
