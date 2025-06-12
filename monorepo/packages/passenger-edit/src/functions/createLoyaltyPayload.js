const createLoyaltyPayload = ({ data, privacyDescription }) => {
  const { name, info } = data?.userFields?.[0] || {};
  return {
    emailId: data.email,
    firstName: name?.first,
    lastName: name?.last,
    gender: info?.gender ? 'male' : 'female',
    mobileNumber: `+${data?.countryCode}${data?.primaryContact}`,
    countryCode: `+${data?.countryCode}`,
    dob: info?.dateOfBirth,
    isResidentEuropean: privacyDescription.find(
      (desc) => desc.key === 'europeanResident',
    )?.checked,
    IsTermsandConditionAgreed: privacyDescription.find(
      (desc) => desc.key === 'privacyPolicy',
    )?.checked,
    IsLoyaltyMember: true,
  };
};

export default createLoyaltyPayload;
