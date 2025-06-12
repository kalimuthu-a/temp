import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { getAemContent } from '../../../services';
import { AppContext } from '../../../context/AppContext';
import { visaServiceActions } from '../../../context/reducer';

const VisaSchedule = ({ data }) => {
  const {
    state: visaPlanDetailsByPath,
    dispatch,
  } = React.useContext(AppContext);

  useEffect(() => {
    if (!visaPlanDetailsByPath) {
      const aemApiCalling = async () => {
        const response = await getAemContent();
        dispatch({
          type: visaServiceActions.SET_PLAN_DETAILS_AEM_CONTETN,
          payload: response?.data?.visaPlanDetailsByPath,
        });
      };
      aemApiCalling();
    }
  }, [visaPlanDetailsByPath]);

  const {
    embassyLabel,
  } = visaPlanDetailsByPath.visaPlanDetailsByPath || {};

  const TimelineRenderer = () => {
    return data?.map((objData) => {
      return (
        <div key={objData?.sequence}>
          <div className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <span className="timeline-content__date">{objData?.date} </span>
              <span className="timeline-content__text"> {objData?.stepName}</span>
            </div>
          </div>
          {objData?.sequence === 3 ? (
            <div className="timeline-item button-item">{embassyLabel}</div>
          ) : null}
        </div>
      );
    });
  };

  return (
    <div className="timeline">
      <TimelineRenderer />
    </div>
  );
};

VisaSchedule.propTypes = {
  data: PropTypes.array,
};

export default VisaSchedule;
