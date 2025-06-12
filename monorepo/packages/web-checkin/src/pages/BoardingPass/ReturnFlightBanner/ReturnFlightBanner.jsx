/* eslint-disable max-len */
/* eslint-disable i18next/no-literal-string */
import React, { useMemo } from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

import useAppContext from '../../../hooks/useAppContext';

const ReturnFlightBanner = () => {
  const { aemLabel } = useAppContext();

  const aemLabels = useMemo(() => {
    return {
      heading: aemLabel('boardingPass.bookYourNextJourneyTitle.html'),
      img: aemLabel('boardingPass.bookYourNextJourney.image._publishUrl'),
      saveUpTo: aemLabel('boardingPass.bookYourNextJourney.title'),
      description: aemLabel(
        'boardingPass.bookYourNextJourney.description.html',
      ),
      redirectLink: aemLabel('boardingPass.bookYourNextJourney.path'),
    };
  }, [aemLabel]);

  return (
    <div className="return-flight-banner">
      <div className="return-flight-banner__title-block">
        <HtmlBlock className="sub-title" html={aemLabels.heading} />
      </div>
      <div className="return-flight-banner__card">
        <div className="return-flight-banner__card__img-container">
          <img
            src={aemLabels.img}
            alt="Book your Return Flight"
            loading="lazy"
          />
        </div>
        <div className="return-flight-banner__card__main-container">
          <div className="skyplus-heading title h0">{aemLabels.saveUpTo}</div>
          <div className="return-flight-banner__card__content">
            <div className="return-flight-banner__card__description">
              <HtmlBlock
                className="skyplus-heading return-flight-banner__card__subtitle h4"
                html={aemLabels.description}
              />
            </div>
            <div className="return-flight-banner__redirect">
              <a
                href={aemLabels.redirectLink}
                className="return-flight-banner__link"
                aria-label="save-link"
              >
                <span className="return-flight-banner__link__wrapper">
                  <i className="sky-icons icon-arrow-top-right sm" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReturnFlightBanner;
