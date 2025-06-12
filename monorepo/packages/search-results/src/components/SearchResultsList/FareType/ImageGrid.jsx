import PropTypes from 'prop-types';
import React from 'react';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import classNames from 'classnames';

const ImageGrid = ({ fareItemsLength, items }) => {
  const [isMobile] = useIsMobile();

  const className = classNames('fare-details__single faretype-imagegrid', {
    column: isMobile || fareItemsLength >= 1,
  });

  return (
    <div className={className}>
      {items.map((item) => {
        const { title, image, path } = item;
        return (
          <div className="faretype-imagegrid--item" key={image?._publishUrl}>
            {path ? (
              <a href={path} target="_blank" rel="noopener noreferrer">
                <img src={image?._publishUrl} alt={title} />
              </a>
            ) : (
              <img src={image?._publishUrl} alt={title} />
            )}
            <h5>{title}</h5>
          </div>
        );
      })}
    </div>
  );
};

ImageGrid.propTypes = {
  items: PropTypes.array,
  fareItemsLength: PropTypes.number,
};

export default ImageGrid;
