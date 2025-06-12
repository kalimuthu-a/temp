import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from '../../functions/utils';

const Progress = (props) => {
  const { titlePos, allSteps, currentStep, title, titlePrefix, customClass } = props;

  let stepsFlag = 'prev';
  const stepsStatusClass = (loopStep) => {
    let className = '';
    if (loopStep === currentStep) {
      stepsFlag = 'next';
      className = 'skyplus-progress-bar__active bg-primary-main';
    } else if (stepsFlag === 'prev') {
      className = 'skyplus-progress-bar__complete bg-accent-dark';
    } else if (stepsFlag === 'next') {
      className = 'skyplus-progress-bar__pending bg-action-disabled-stroke';
    }
    return className;
  };

  const nextStep = () => {
    const currentIndex = allSteps.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === allSteps.length - 1) {
      return null;
    }
    return allSteps[currentIndex + 1];
  };

  if (!allSteps || !allSteps.length || !currentStep) {
    return '';
  }

  return (
    <div className={`skyplus-progress-bar ${customClass}`}>
      {titlePos === 'top' ? (
        <p className="skyplus-progress-bar__title tags-small pb-4 pb-md-6 text-capitalize">
          {title || (nextStep() && `${titlePrefix} ${nextStep()}`)}
        </p>
      ) : null}
      <ul className="w-100 d-flex gap-4">
        {allSteps.map((el) => {
          return (
            <li
              className={`skyplus-progress-bar__step ${stepsStatusClass(
                el,
              )} pt-2 d-block rounded-2 bg-primary-main flex-grow-1`}
              key={uniq()}
            />
          );
        })}
      </ul>
      {titlePos === 'bottom' ? (
        <p className="skyplus-progress-bar__title text-tertiary tags-small pt-4 pt-md-6 text-capitalize">
          {title || (nextStep() && `${titlePrefix} ${nextStep()}`)}
        </p>
      ) : null}
    </div>
  );
};

Progress.defaultProps = {
  titlePos: 'top',
  titlePrefix: 'Next :',
};

Progress.propTypes = {
  titlePos: PropTypes.string,
  allSteps: PropTypes.array,
  currentStep: PropTypes.string,
  titlePrefix: PropTypes.string,
  title: PropTypes.string,
  customClass: PropTypes.string,
};

export default Progress;
