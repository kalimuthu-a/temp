import React from 'react';
import PropTypes from 'prop-types';
import './ImgLinkCard.scss';

const ImgLinkCard = ({ link, img, imgAlt, title, description }) => {
  return (
    <div className="img-link-card w-100">
      <a href={link || '#'} title={title}>
        <div className="rounded-3 overflow-hidden position-relative img-link-card__wrapper">
          <div className="img-link-card__flight bg-primary rounded-circle bg-white p-5 position-absolute top-0 end-0">
            <span className="sky-icons icon-arrow-top-right sm" />
          </div>
          <img
            src={img}
            alt={imgAlt}
            className="w-100 rounded-3"
          />
          <div className="img-link-card__gradient position-absolute start-0 bottom-0 text-white p-6 w-100">
            <p className="body-medium-medium pb-2">
              {title}
            </p>
            <p className="body-small-light">
              {description}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
};

ImgLinkCard.propTypes = {};

export default ImgLinkCard;
