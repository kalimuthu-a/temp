import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

const DangerousGoodsItem = ({ icon, itemName }) => {
  return (
    <div className="dg-item p-8 d-flex flex-column align-items-center box-shadow-card-soft rounded dangerous-good-item">
      <div>
        <Icon className={icon} size="lg" />
      </div>
      <div className="body-medium-regular text-secondary text-center">
        {itemName}
      </div>
    </div>
  );
};

DangerousGoodsItem.propTypes = {
  itemName: PropTypes.string,
  icon: PropTypes.string,
};

export default DangerousGoodsItem;
