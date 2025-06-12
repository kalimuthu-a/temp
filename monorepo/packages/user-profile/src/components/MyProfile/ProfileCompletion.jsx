import React from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';

const ProfileCompletion = () => {
  return (
    <div className="profile-completion">
      <Heading containerClass="title" heading="h0" mobileHeading="h1">
        Please complete <span>your profile</span>
      </Heading>
      <div className="content">
        <div>
          <div className="subtitle">Fill your Date of Birth and More...</div>
          <Heading containerClass="main-line" heading="h0" mobileHeading="h1">
            Complete your profile and <span>Earn 150 points</span>
          </Heading>
        </div>
        <div>
          83% Complete
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
