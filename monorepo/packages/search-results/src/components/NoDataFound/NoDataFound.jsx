import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import React from 'react';
import Modal from '../common/Modal';

const NoDataFound = () => {
  const onClickHandler = () => {
    const hrefLink = document.querySelector('.headerv2__logo-link')?.href;
    if (hrefLink) {
      window.location.href = hrefLink;
    } else {
      window.history.go(-1);
    }
  };

  return (
    <Modal
      heading="No Data Found"
      onClose={onClickHandler}
      containerClass="no-data-found"
    >
      <Text variation="sh5" containerClass="my-8">
        You will be redirected to home page, as there is no flight search data
        available.
      </Text>
      <div className="d-flex align-items-center justify-content-center">
        <Button onClick={onClickHandler}>Ok</Button>
      </div>
    </Modal>
  );
};

export default NoDataFound;
