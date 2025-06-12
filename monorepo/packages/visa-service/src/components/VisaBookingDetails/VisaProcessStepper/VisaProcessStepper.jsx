/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { CONSTANTS, EmbassyOption, visa2flyOption, visaStatusProgress } from './utils';
import { formatDate, UTIL_CONSTANTS } from '../../../utils';

const getModifiedVisaJourney = (expectationJourneySteps) => {
  const journey = [];
  const visa2fly = visa2flyOption;
  for (let i = 0; i < expectationJourneySteps?.length; i += 1) {
    if (expectationJourneySteps[i].stepName === CONSTANTS.EMBASSY_STATUS) {
      const Embassy = EmbassyOption;
      journey.push(Embassy);
    } else if (expectationJourneySteps[i].stepName === CONSTANTS.APPLICATION_STATUS) {
      journey.push(visa2fly);
    }
    journey.push(expectationJourneySteps[i]);
  }
  return journey;
};

const getProcessStatus = (process) => {
  if (process?.endDate) {
    return 'completed';
  }
  if (!process?.endDate && process?.startDate) {
    return 'inprogress';
  }
  return 'default';
};

export default function VisaProcessTimeline({ visaJourney, visa2flyLabel, poweredByText, getVisaLabel }) {
  const modifyVisaJourney = getModifiedVisaJourney(visaJourney) || [];

  const approvedDate = modifyVisaJourney && modifyVisaJourney[modifyVisaJourney.length - 1];

  return (
    <div className="p-8 my-0 mx-sm-auto process-container bg-white">
      {modifyVisaJourney?.map((step, index) => (
        <div
          key={uniq()}
          className={`d-flex align-items-sm-start stepper
            position-relative step ${getProcessStatus(step) === CONSTANTS.COMPLETED
            ? 'completed-step' : 'progress-step'}
            ${modifyVisaJourney.length === index + 1 && 'last-stepper'}
            `}
        >
          {step?.type === 'section' ? (
            <div className={`section-wrapper position-relative 
              ${step?.section} ${getProcessStatus(step) === CONSTANTS.COMPLETED ? 'completed' : 'progress'}`}
            >{step?.title}
            </div>
          ) : (
            <>
              {index !== modifyVisaJourney.length - 1 && <div className="step-line" />}
              <div className={`step-marker d-flex align-items-center justify-content-center ${getProcessStatus(step)}`}>
                {getProcessStatus(step) === CONSTANTS.COMPLETED ? <Icon className="icon-tick" size="md" color="white" />
                  : <span className="circle-marker" />}
              </div>
              <div className="step-wrapper-section d-flex justify-content-between w-100">
                <div className="left-stepper">
                  <div className="step-content ms-10">
                    <div
                      className={`step-title ${getProcessStatus(step)}`}
                    >
                      {step?.stepName}
                    </div>
                    {step?.description && (
                      <div className="step-description">{step?.description}</div>
                    )}
                  </div>
                  {step?.delays?.map((delay, indexStep) => {
                    return (
                      (indexStep === step.delays.length - 1)
                      && (
                        <div className="step-content ms-10 mb-12 mt-4" key={delay?.createdAt}>
                          <div className="step-date">
                            {formatDate(
                              delay?.createdAt,
                              UTIL_CONSTANTS.DATE_SPACE_PRINTHEADER_PIPE,
                            )}
                          </div>
                          <div
                            className="step-title delay"
                          >
                            {delay?.reasonForDelay}
                          </div>
                        </div>
                      )
                    );
                  })}
                  {step?.activities?.map((activity) => {
                    return (
                      <div className="step-content ms-10 mb-12 mt-4" key={activity?.activityId}>
                        <div className="step-date">
                          {formatDate(
                            activity?.createdAt,
                            UTIL_CONSTANTS.DATE_SPACE_PRINTHEADER_PIPE,
                          )}
                        </div>
                        <div
                          className={`step-title activities ${!activity?.activityDetails && 'activities-details'}`}
                        >
                          {activity?.bookingState}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="right-stepper d-flex flex-column align-items-end">
                  <div className="step-date">
                    {!step?.endDate && formatDate(
                      step?.endDate
                      || step?.expectedDate || step?.startDate,
                      UTIL_CONSTANTS.DATE_SPACE_DDMMMMYYYY,
                    )}
                  </div>
                  <div className={`right-section-status mt-4 ${visaStatusProgress(step)?.toLowerCase()}`}>
                    {visaStatusProgress(step)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
      <div className={`d-flex ${approvedDate && !approvedDate?.endDate
        ? 'justify-content-between' : 'justify-content-end'}  bottom-container`}
      >
        {approvedDate && !approvedDate?.endDate && (
        <div>
          <span>{getVisaLabel}</span>
          <span className="approved-date">
            {formatDate(
              approvedDate?.startDate || approvedDate?.expectedDate,
              UTIL_CONSTANTS.DATE_SPACE_DDDMMMYYYY,
            )}
          </span>
          <span />
        </div>
        )}
        <div className="d-flex right-bottom-section">
          <div
            dangerouslySetInnerHTML={{
              __html: poweredByText?.html,
            }}
          /> <span>{visa2flyLabel}</span>
        </div>
      </div>
    </div>
  );
}

VisaProcessTimeline.propTypes = {
  visaJourney: PropTypes.array,
  visa2flyLabel: PropTypes.string,
  poweredByText: PropTypes.object,
  getVisaLabel: PropTypes.string,
};
