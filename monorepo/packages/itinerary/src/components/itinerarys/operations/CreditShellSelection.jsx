import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import RadioBox from 'skyplus-design-system-app/dist/des-system/RadioBox';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const creditShellOptions = {
  backToSource: 'AutoReversal',
  creditShell: 'CSRefund',
};

const ShellCredit = ({ onChange, activeModule = 'text', selected }) => {
  const renderContent = () => {
    const mfAdditionalData = useSelector( // NOSONAR
      (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
    )
       || {};
    const { refundDetails, selectRefundText } = mfAdditionalData;
    return (
      <div className="change-booking-details__container">
        <p className="sub-header">
          {selectRefundText}
        </p>
        {refundDetails.map((item) => {
          const refundTitle = item?.title;
          const refundDescription = item?.description;
          return (
            <div key={uniq()}>
              {refundTitle === 'Back to source' ? (
                <div
                  aria-hidden="true"
                  className="radio-div"
                  onClick={() => onChange(creditShellOptions?.backToSource)}
                >
                  <RadioBox
                    onChange={() => onChange(creditShellOptions?.backToSource)}
                    value={creditShellOptions.backToSource}
                    name={creditShellOptions.backToSource}
                    id={`reason-${1}-${activeModule}`}
                    className="radio"
                    checked={selected === creditShellOptions?.backToSource}
                  >
                    <p className="label">{refundTitle}</p>
                  </RadioBox>
                  <HtmlBlock html={refundDescription?.html} className="sub" />
                </div>
              ) : (
                <div
                  aria-hidden="true"
                  className="radio-div"
                  onClick={() => onChange(creditShellOptions?.creditShell)}
                >
                  <RadioBox
                    onChange={() => onChange(creditShellOptions?.creditShell)}
                    value={creditShellOptions?.creditShell}
                    name={creditShellOptions?.creditShell}
                    id={`reason-${2}-${activeModule}`}
                    className="radio"
                    checked={selected === creditShellOptions?.creditShell}
                  >
                    <p className="label">{refundTitle}</p>
                  </RadioBox>
                  <HtmlBlock html={refundDescription.html} className="sub" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return renderContent();
};

ShellCredit.propTypes = {
  onClose: PropTypes.func,
  activeModule: PropTypes.string,
  selected: PropTypes.string,
};

export default ShellCredit;
