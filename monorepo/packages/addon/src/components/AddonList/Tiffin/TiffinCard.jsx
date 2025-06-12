import React from 'react';
import PropTypes from 'prop-types';
import TiffinSlidePane from './TiffinSlidePane';
import { AppContext } from '../../../context/AppContext';

function TiffinCard(props) {
  const { setOpenSlider, addonData, uptoLabel, addInfoLableText, sliderPaneConfigData, selectedAddOnName } = props;
  const { state } = React.useContext(AppContext);

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpenSlider();
    }
  };

  const {
    description,
  } = sliderPaneConfigData?.deptTimePopup || {};

  const uptoLabelText = uptoLabel && uptoLabel();

  return (
    <div className="skyplus-tiffin-main-card">
      <div className="skyplus-tiffin-main-card__header">
        <h3 className="skyplus-addon-mf__addon-group-title">{addonData?.title || '6E Eat'}
          { addonData?.subtitle && <span className='skyplus-addon-mf__addon-group-subtitle'>{addonData?.subtitle}</span>}
        </h3>
        {!state.underTwelveHourFlight && !addInfoLableText && (
        <div
          onClick={setOpenSlider}
          className="skyplus-tiffin-main-card__header-btn link"
          tabIndex={0}
          role="button"
          aria-label={addonData?.viewMenuLabel}
          onKeyDown={onKeyDown}
        >{addonData?.viewMenuLabel}
        </div>
        )}
      </div>
      {addInfoLableText && (<h4 className="mb-5">{addInfoLableText}</h4>)}
      {addInfoLableText && selectedAddOnName && (<p className="body-small-regular">{selectedAddOnName}</p>)}
      {state.underTwelveHourFlight && (
        <>
          <h4 className="mb-5">{uptoLabelText}</h4>
          <div
            className="body-small-regular"
            dangerouslySetInnerHTML={{
              __html: description.html,
            }}
          />
        </>
      )}
      {!state.underTwelveHourFlight && !addInfoLableText && <TiffinSlidePane {...props} />}
    </div>
  );
}

TiffinCard.propTypes = {
  setOpenSlider: PropTypes.func,
  addonData: PropTypes.object,
  uptoLabel: PropTypes.string,
  addInfoLableText: PropTypes.string,
  sliderPaneConfigData: PropTypes.object,
  selectedAddOnName: PropTypes.func,
};
export default TiffinCard;
