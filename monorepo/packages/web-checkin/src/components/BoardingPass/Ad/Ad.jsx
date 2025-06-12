import PropTypes from 'prop-types';
import React from 'react';
import useAppContext from '../../../hooks/useAppContext';

const Ad = ({ destination }) => {
  const { aemLabel } = useAppContext();

  const image1Config = aemLabel(
    'boardingPass.advertisementBasedOnIATACodes',
    [],
  );
  const imageDefaultConfig = aemLabel('boardingPass.advertisementDefault', {});

  const image1 =
    image1Config.find((config) => config.iataCode === destination) ||
    imageDefaultConfig;

  const advertisement = image1?.advertisementPrintImage?._path;

  const aemLabels = {
    advertisementLabel: aemLabel(
      'boardingPass.advertisementLabel',
      'Advertisement',
    ),
    image2: aemLabel('boardingPass.banner1Image._path'),
    image3: aemLabel('boardingPass.banner2Image._path'),
  };

  return (
    <div className="ad-wrappers" style={{}}>
      <div className="title">{aemLabels.advertisementLabel}</div>
      <div className="d-grid gap-6">
        {advertisement && (
          <div className="a-1">
            <img src={advertisement} alt="ad" />
          </div>
        )}
        {aemLabels.image2 && (
          <div className="a-2">
            <img src={aemLabels.image2} alt="ad" />
          </div>
        )}
        {aemLabels.image3 && (
          <div className="a-3">
            <img src={aemLabels.image3} alt="ad" />
          </div>
        )}
      </div>
    </div>
  );
};

Ad.propTypes = {
  destination: PropTypes.string,
};

export default Ad;
