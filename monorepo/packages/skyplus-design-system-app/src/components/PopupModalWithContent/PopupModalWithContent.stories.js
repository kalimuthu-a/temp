import React, { useState } from 'react';
import PopupModalWithContent from './PopupModalWithContent';

export default {
  component: PopupModalWithContent,
  title: 'Skyplus/ Popup',
};

export const Default = (args) => {
  const [popupCloseHandler, setPopupCloseHandler] = useState(true);
  const onCloseHandler = (event) => {
    alert('popup closed');
  };

  return (
    popupCloseHandler && (
    <PopupModalWithContent
      className="className"
      onCloseHandler={onCloseHandler}
      modalTitle="Modal Title"
      customPopupContentClassName="customPopupContentClassName"
    >
      Children will be rendered
    </PopupModalWithContent>
    )
  );
};
