import React from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import PropTypes from 'prop-types';
import ReadMore from './ReadMore';

/**
 *
 * @type {React.FC<import("../../../../types/AddOnList").TravelAssistanceBenefitsProps>}
 * @returns {React.FunctionComponentElement}
 */
const TravelAssistanceBenefits = ({ onClose, AEMData, sliderPaneConfigData }) => {
  const viewDetailsProps = {
    overlayCustomClass: 'travel-assitance-benefit-slider',
    modalCustomClass: '',
    title: `${AEMData?.benefitsLabel}`,
    containerClassName: 'skyplus-offcanvas__child',
    onClose: () => onClose(),
  };

  return (
    <OffCanvas {...viewDetailsProps}>
      <div className="skyplus-travel-assistance__heading-container">
        <div className="skyplus-travel-assistance__benefit">
          <div className="h0 skyplus-travel-assistance__title">{AEMData?.sliderTitle}</div>
          <div className="skyplus-travel-assistance__benefit-head">
            <div className="skyplus-travel-assistance__benefit-label">
              <p className="skyplus-travel-assistance__benefit-poweredby sh3">
                {AEMData?.poweredByLabel}
              </p>
              <img
                src={AEMData?.poweredByImage?._publishUrl}
                alt=""
                className="skyplus-travel-assistance__benefit-logo"
              />
            </div>

            <div
              className="skyplus-travel-assistance__benefit-information"
              dangerouslySetInnerHTML={{
                __html: AEMData?.poweredByInformation.html,
              }}
            />
          </div>

          <div className="skyplus-travel-assistance__benefit-poweredbyname">
            <div className="skyplus-travel-assistance__benefit-label">
              <p className="skyplus-travel-assistance__benefit-text sh3">
                {AEMData?.poweredByCompanyName}
              </p>
              <img
                src={AEMData?.poweredByCompanyImage?._publishUrl}
                alt=""
                className="skyplus-travel-assistance__benefit-logo"
              />
            </div>
            <div className="skyplus-travel-assistance__benefit-container">
              <ReadMore
                html={AEMData?.poweredByCompanyInformation?.html}
                readLessLabel={sliderPaneConfigData?.readLessLabel}
                readMoreLabel={sliderPaneConfigData?.readMoreLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </OffCanvas>
  );
};

TravelAssistanceBenefits.propTypes = {
  onClose: PropTypes.func,
  AEMData: PropTypes.any,
  sliderPaneConfigData: PropTypes.object,
};

export default TravelAssistanceBenefits;
