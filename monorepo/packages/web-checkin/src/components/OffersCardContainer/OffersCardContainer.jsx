import React from 'react';
import OffersCard from './OffersCard';
import useAppContext from '../../hooks/useAppContext';

function OffersCardContainer() {
  const {
    state: { aemModel },
  } = useAppContext();
  const aemLabels = aemModel?.boardingPass;
  return (
    <div className="offers-card-container">
      <OffersCard
        className="offer-card-1"
        title={aemLabels?.banner1Title}
        description={aemLabels?.banner1Description?.html}
        imgSrc={aemLabels?.banner1Image?._path}
      />
      <OffersCard
        className="offer-card-2"
        title={aemLabels?.banner2Title}
        description={aemLabels?.banner2Description?.html}
        validity={aemLabels?.banner2ValidityMessage}
        imgSrc={aemLabels?.banner2Image?._path}
      />
      <OffersCard
        className="offer-card-3"
        title={aemLabels?.banner2Title}
        description={aemLabels?.banner2Description?.html}
        validity={aemLabels?.banner2ValidityMessage}
        imgSrc={aemLabels?.banner2Image?._path}
      />
    </div>
  );
}

export default OffersCardContainer;
