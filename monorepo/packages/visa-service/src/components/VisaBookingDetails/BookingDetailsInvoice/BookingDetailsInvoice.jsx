/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable i18next/no-literal-string */
import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import PropTypes from 'prop-types';
import { downloadInvoice } from '../../../services';
import { pushAnalytic } from '../../../utils/analyticEvents';
import { EVENTS_NAME } from '../../../utils/analytic';

const BookingDetailsInvoice = ({ list, bookingId, sector }) => {
  const List = () => {
    const handleAnalytic = (eventInfo) => {
      pushAnalytic({
        event: 'visaClick',
        data: {
          _eventInfoName: eventInfo,
          _event: EVENTS_NAME.VISA_SUCCESS,
          component: 'Visa Service',
          pageName: 'Visa Status',
          productInfo: {
            bookingID: bookingId,
            sector,
          },
        },
      });
    };

    return list && list.map((options) => (
      <div
        className="invoice-container d-flex bg-white
    align-items-center flex-sm-column gap-4 mx-md-0 p-8 my-12 mb-16 text-sm-center"
        onClick={() => handleAnalytic(options.buttonValue)}
      >
        <Icon className="icon-download" size="md" />
        <Text
          variation="body-small-regular"
          containerClass="title"
          onClick={() => { downloadInvoice('bookingId'); }}
        >
          {options?.buttonValue}
        </Text>
      </div>
    ));
  };
  return (
    <div className="d-flex gap-10">
      <List />
    </div>
  );
};

BookingDetailsInvoice.propTypes = {
  list: PropTypes.array,
  bookingId: PropTypes.string,
  sector: PropTypes.string,
};

export default BookingDetailsInvoice;
