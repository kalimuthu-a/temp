import PropTypes from 'prop-types';
import React from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

import DangerousGoodsItem from './DangerousGoodsItem';

const DangerousGood = ({ items = [], title, subTitle }) => {
  return (
    <div className="dangerous-good-block">
      <HtmlBlock html={title} className="h3" />
      <div
        className="mt-8 body-medium-regular text-secondary"
        dangerouslySetInnerHTML={{ __html: subTitle }}
      />
      <div className="mt-6 dangerous-goods-container">
        {items.map((item) => {
          return (
            <DangerousGoodsItem
              key={item.title}
              itemName={item.title}
              icon={item.icon}
            />
          );
        })}
      </div>
    </div>
  );
};

DangerousGood.propTypes = {
  items: PropTypes.array,
  subTitle: PropTypes.any,
  title: PropTypes.any,
};

export default DangerousGood;
