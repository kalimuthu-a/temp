const breakpoints = {
  MWEB: 768,
  webLabel: 'Web',
  MwebLabel: 'MWeb',
};

const getDeviceBreakPoint = () => {
  const width = window?.innerWidth;
  if (width < breakpoints.MWEB) return breakpoints.MwebLabel;
  return breakpoints.webLabel;
};

export default getDeviceBreakPoint;
