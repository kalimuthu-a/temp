export const visa2flyOption = {
  type: 'section',
  title: 'VISA2FLY',
  section: 'primary',
};

export const EmbassyOption = {
  type: 'section',
  title: 'EMBASSY',
  section: 'primary',
};

export const CONSTANTS = {
  EMBASSY_STATUS: 'Applied to embassy',
  APPLICATION_STATUS: 'Application status',
  COMPLETED: 'completed',
  PROGRESS: 'progress',
};

export const visaStatusProgress = (step) => {
  if (step && step?.delays) {
    return 'Delayed';
  }
  if (step?.endDate) {
    return 'Completed';
  }
  return '';
};
