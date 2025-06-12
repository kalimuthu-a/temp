import React from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';

const Footer = () => {
  return (
    <div className="wc-footer">
      <Button variant="outline" color="primary">
        Back to Check-in
      </Button>
      <Button>Continue</Button>
    </div>
  );
};

export default Footer;
