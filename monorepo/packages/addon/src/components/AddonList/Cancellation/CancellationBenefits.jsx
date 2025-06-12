import React from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import PropTypes from 'prop-types';
import ReadMore from './ReadMore';

/**
 * @type {React.FC<import("../../../../types/AddOnList").CancellationBenefitsProps>}
 * @returns {React.FunctionComponentElement}
 */
const CancellationBenefits = ({ onClose, AEMData, sliderPaneConfigData }) => {
  const viewDetailsProps = {
    overlayCustomClass: 'skyplus-cancellation-benefit-slider',
    modalCustomClass: '',
    title: `${AEMData?.benefitsLabel}`,
    containerClassName: 'skyplus-offcanvas__child',
    onClose: () => onClose(),
  };

  return (
    <OffCanvas {...viewDetailsProps}>
      <div className="skyplus-cancellation">
        <div className="skyplus-cancellation__title h0">{AEMData?.sliderTitle}</div>
        <div className="skyplus-cancellation__benefit">
          <div className="skyplus-cancellation__benefit-head">
            <p className="skyplus-cancellation__benefit-poweredby">
              {AEMData?.benefitsLabel}
            </p>
            <div
              className="skyplus-cancellation__benefit-information"
              dangerouslySetInnerHTML={{
                __html: AEMData?.benefitsText.html,
              }}
            />
            {/* Benifit path */}
            <div className="skyplus-cancellation__benefit-path-container">
              {AEMData?.benefitsPath?.map((benefitItem) => {
                return (
                  <div className="skyplus-cancellation__benefit-path-info" key={benefitItem.title}>
                    <div className="skyplus-cancellation__benefit-path-icon">
                      <i className={benefitItem.icon || 'icon-close-simple'} />
                    </div>
                    <div className="skyplus-cancellation__benefit-path-title">{benefitItem.title}</div>
                  </div>
                );
              })}
            </div>
            <div
              className="skyplus-cancellation__benefit-poweredByInformation"
              dangerouslySetInnerHTML={{
                __html: AEMData?.poweredByInformation.html,
              }}
            />
          </div>

          <div className="skyplus-cancellation__benefit-poweredbyname">
            <div className="skyplus-cancellation__benefit-poweredbycontainer">
              <p className="skyplus-cancellation__benefit-text">
                {AEMData?.poweredByCompanyName}
              </p>
              <img
                src={AEMData?.poweredByCompanyImage?._publishUrl}
                alt=""
                className="skyplus-cancellation__benefit-logo"
              />
            </div>
            <ReadMore
              html={AEMData?.poweredByCompanyInformation?.html}
              readLessLabel={sliderPaneConfigData?.readLessLabel}
              readMoreLabel={sliderPaneConfigData?.readMoreLabel}
            />
          </div>
        </div>
      </div>
    </OffCanvas>
  );
};

CancellationBenefits.propTypes = {
  onClose: PropTypes.func,
  AEMData: PropTypes.any,
  sliderPaneConfigData: PropTypes.object,
};

export default CancellationBenefits;
