import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SavedPayments.scss';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';

function SavedPayments() {
  const [accordionIndex, setAccordionIndex] = useState();
  const renderAccordionHeader = () => {
    return (
      <div className="revamp-user-saved-payments-card-header">
        <div className="revamp-user-saved-payments-card-header-img">
          <img src="https://aem-s6web-dev-skyplus6e.goindigo.in/content/dam/s6app/in/en/assets/offers2.jpg" />
        </div>
        <div className="revamp-user-saved-payments-card-header-content">
          <div className="d-flex align-items-center gap-6"> <Text variation="sh6">Paytm UPI</Text>
            <Chip
              variant="filled"
              size="xs"
              color="white"
              border="system-information"
              txtcol="system-information"
            >
              Default
            </Chip>
          </div>
          <div className="d-flex align-items-center gap-6">  <Text variation="sh7">7317****93@paytm </Text>
            <span className="skyplus-text  sh7">|</span>
            <Text variation="sh7">Aman Pal</Text>
          </div>
        </div>
      </div>
    );
  };
  const renderAccordionContent = () => {
    return <div>Accordion Body</div>;
  };

  const accordionData = [
    {
      renderAccordionHeader: renderAccordionHeader(),
      renderAccordionContent: renderAccordionContent(),
    },
    {
      renderAccordionHeader: renderAccordionHeader(),
      renderAccordionContent: renderAccordionContent(),
    },
    {
      renderAccordionHeader: renderAccordionHeader(),
      renderAccordionContent: renderAccordionContent(),
    },
  ];

  return (
    <div className="revamp-user-saved-payments">
      <Heading containerClass="revamp-user-saved-payments-primary-heading h4 text-center">
        Saved Payments
      </Heading>
      <Heading containerClass="revamp-user-saved-payments-secondary-heading h5">
        Preferred Methods
      </Heading>
      <div className="revamp-user-saved-payments-card">
        <Accordion
          activeIndex={accordionIndex}
          accordionData={accordionData}
          setActiveIndex={setAccordionIndex}
          isMultiOpen
          initalActiveIndexes={[0]}
        />
      </div>
    </div>
  );
}
SavedPayments.propTypes = {};
export default SavedPayments;
