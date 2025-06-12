import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import TimingHoliday from '../TimingHoliday/TimingHoliday';
import VisaSchedule from './VisaSchedule';
import VisaScheduleModal from './visaScheduleModal/VisaScheduleModal';
import { AppContext } from '../../../context/AppContext';
import { visaServiceActions } from '../../../context/reducer';
import { getAemContent } from '../../../services';
import { pushAnalytic } from '../../../utils/analyticEvents';
import { AA_CONSTANTS, EVENTS_NAME } from '../../../utils/analytic';

const VisaScheduleHolidays = ({
  visaSheduleData,
  timeHolidaysData,
  heading,
  timingsHolidaysLabel,
  setIsFooterShow,
}) => {
  const [isOpenVisaScheduleModal, setIsOpenVisaScheduleModal] = useState(false);

  const { state: visaMainByPath, dispatch } = React.useContext(AppContext);

  useEffect(() => {
    if (!visaMainByPath) {
      const aemApiCalling = async () => {
        const response = await getAemContent();
        dispatch({
          type: visaServiceActions.SET_PLAN_DETAILS_AEM_CONTETN,
          payload: response?.data?.visaMainByPath,
        });
      };
      aemApiCalling();
    }
  }, [visaMainByPath]);

  const { viewMoreLabel, visaSchedulePopUp } = visaMainByPath.visaPlanDetailsByPath || {};

  const handleModal = () => {
    // hide footer
    setIsFooterShow(false);
    const obj = {
      event: AA_CONSTANTS.visaClick,
      data: {
        interactionType: 'Pop Up Shown',
        _event: EVENTS_NAME.CTA_CLICK_NO_PRODUCT,
        _eventInfoName: 'Schedule',
        position: visaMainByPath?.visaPlanDetailsByPath?.embassyLabel,
        _componentName: 'Visa Service',
        pageName: AA_CONSTANTS.Visa_Details,
      },
    };
    pushAnalytic(obj);
    setIsOpenVisaScheduleModal(true);
  };

  const handleClose = (sendDataToAnalytic = false) => {
    // Show footer
    setIsFooterShow(true);
    setIsOpenVisaScheduleModal(false);
    if (sendDataToAnalytic) {
      const obj = {
        event: AA_CONSTANTS.visaClick,
        data: {
          _event: EVENTS_NAME.CTA_CLICK_NO_PRODUCT,
          _eventInfoName:
            visaMainByPath?.visaPlanDetailsByPath?.visaSchedulePopUp?.ctaLabel,
          position: visaMainByPath?.visaPlanDetailsByPath?.embassyLabel,
          _componentName: 'Visa Service',
          pageName: AA_CONSTANTS.Visa_Details,
        },
      };
      pushAnalytic(obj);
    }
  };

  return (
    <div className="visa-shedule-container">
      {isOpenVisaScheduleModal && (
        <VisaScheduleModal
          data={visaSheduleData}
          onClose={handleClose}
          title={visaSchedulePopUp?.subHeading?.html}
          buttonText={visaSchedulePopUp?.ctaLabel}
        />
      )}
      <div>
        <div className="visa-shedlue-heading">
          <div className="doc-heading">
            <HtmlBlock html={heading?.[1]?.description?.html} />
          </div>
        </div>
        <VisaSchedule data={visaSheduleData} />

        <div className="visa-shedule-container__view-more-btn-container">
          <HtmlBlock
            className="btn-view-more"
            onClick={(e) => {
              e.preventDefault();
              handleModal();
            }}
            html={viewMoreLabel?.html}
          />
        </div>
      </div>

      <div className="visa-shedlue-heading">
        <div className="timing-heading">
          <HtmlBlock html={timingsHolidaysLabel?.html} />
        </div>
        <div className="item timing-holidays">
          <TimingHoliday timeHolidaysData={timeHolidaysData} />
        </div>
      </div>
    </div>
  );
};

VisaScheduleHolidays.propTypes = {
  visaSheduleData: PropTypes.array,
  timeHolidaysData: PropTypes.array,
  heading: PropTypes.array,
  timingsHolidaysLabel: PropTypes.object,
  setIsFooterShow: PropTypes.any,
};

export default VisaScheduleHolidays;
