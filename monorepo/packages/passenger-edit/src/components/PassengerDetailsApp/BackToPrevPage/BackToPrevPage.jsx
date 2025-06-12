import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './BackToPrevPage.scss';
import { HEADER_CONTENT_UPDATE_EVENT, PASSENGER_LABEL } from '../../../constants/constants';

const BackToPrevPage = ({ backLinkLabel, backLinkPath }) => {
  useEffect(() => {
    const headerTitleUpdateEvent = (data) => new CustomEvent(HEADER_CONTENT_UPDATE_EVENT, data);
    document.dispatchEvent(
      headerTitleUpdateEvent({
        bubbles: true,
        detail: { title: PASSENGER_LABEL },
      }),
    );
  }, []);

  return backLinkPath ? (
    <div className="d-flex my-md-8 d-sm-none d-md-flex">
      <a className="back-link text-decoration-none d-flex align-items-center" href={backLinkPath}>
        <span className="icon-accordion-left-simple icon-size-md" />
        <span className="back-link-text text-primary-main link-small
        text-decoration-underline d-none d-md-block"
        >{backLinkLabel}
        </span>
      </a>
      <h5 className="h5 d-md-none mx-auto"><span className="ms-n6">{PASSENGER_LABEL}</span></h5>
    </div>
  ) : null;
};

BackToPrevPage.propTypes = {
  backLinkLabel: PropTypes.string,
  backLinkPath: PropTypes.string,
};

export default BackToPrevPage;
