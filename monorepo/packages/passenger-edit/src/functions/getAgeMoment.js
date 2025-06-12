import moment from 'moment';

const getAgeMoment = (dateString, travelDate) => {
  // Parse the date string using the specified format 'DD-MM-YYYY'
  const birthDate = moment(dateString, 'DD-MM-YYYY');

  // Parse the travelDate if provided, otherwise use the current date
  const referenceDate = travelDate ? moment(travelDate, 'YYYY-MM-DDTHH:mm:ss') : moment();

  // Calculate the age
  return referenceDate.diff(birthDate, 'years');
};

export default getAgeMoment;
