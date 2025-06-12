import React from 'react';
import PropTypes from 'prop-types';
import AddonSlider from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import {
  CLASS_PREFIX,
} from '../../../constants/index';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';

const FastForwardSlidePane = (props) => {
  const { onClose, addonData, onSelectHandler, currencyCode, fastforwardPrice, sliderPaneConfigData } = props;
  const { availableSlidePaneData } = addonData;

  const buttonProps = {
    title: sliderPaneConfigData.totalPriceLabel,
    subTitle: '', // sliderPaneConfigData.saveRecommendationLabel.replace('{amount}', 735), TD: - API changes
    buttonTitle: availableSlidePaneData[0].sliderButtonLabel,
  };
  return (
    <AddonSlider
      onClose={onClose}
      containerClassName="skyplus-offcanvas__addon-mf"
    >
      <div className={`${CLASS_PREFIX}-ff-slidepane`}>
        <div className={`${CLASS_PREFIX}-ff-slidepane__title1 h0 mt-12`}>{availableSlidePaneData[0].sliderTitle}</div>
        <Heading heading="h5" mobileHeading="h5" containerClass="mt-6">
          <div
            dangerouslySetInnerHTML={{
              __html: availableSlidePaneData[0].sliderDescription.html,
            }}
          />
        </Heading>
        <div
          className={`${CLASS_PREFIX}-ff-slidepane__description mt-6 body-small-regular`}
          dangerouslySetInnerHTML={{
            __html: availableSlidePaneData[0].disclaimer.html,
          }}
        />
        <OffCanvasFooter
          {...buttonProps}
          titleData={fastforwardPrice}
          currencycode={currencyCode}
          onSubmit={onSelectHandler}
          postButtonIcon="icon-accordion-left-24"
        />
      </div>

    </AddonSlider>
  );
};

FastForwardSlidePane.propTypes = {
  onClose: PropTypes.func,
  addonData: PropTypes.shape({
    availableSlidePaneData: PropTypes.arrayOf(PropTypes.shape({
      sliderTitle: PropTypes.string,
      sliderDescription: PropTypes.object,
      disclaimer: PropTypes.object,
      sliderButtonLabel: PropTypes.string,
    })),
  }),
  onSelectHandler: PropTypes.func,
  currencyCode: PropTypes.string,
  fastforwardPrice: PropTypes.number,
  sliderPaneConfigData: PropTypes.object,
};

export default FastForwardSlidePane;
