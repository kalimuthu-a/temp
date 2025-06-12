import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';

const NotValidResponseModal = ({
  children,
  heading,
  continueLabel,
  cancelLabel,
  onClickCancel,
  onClickContinue,
}) => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return createPortal(
    <div className="skyplus-modal">
      <div className="skyplus-modal-content undoWebcheckinModal">
        <Heading heading="h4">
          <HtmlBlock html={heading} />
        </Heading>
        <div className="skyplus-modal-content-body">{children}</div>
        <div className="skyplus-modal-content-footer d-flex gap-8">
          <Button onClick={onClickCancel}>{cancelLabel}</Button>
          <Button onClick={onClickContinue} variant="outline">
            {continueLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default NotValidResponseModal;
