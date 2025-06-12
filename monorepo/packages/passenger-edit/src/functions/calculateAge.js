function formatDate(date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

const calculateAge = (dateOfBirth) => {
  const dateFormat = formatDate(dateOfBirth);
  const dob = new Date(dateFormat);
  const now = new Date();

  // Calculate the difference in milliseconds between the current date and DOB
  const ageDiffMs = now - dob;

  // Convert the age difference from milliseconds to years
  const ageDate = new Date(ageDiffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default calculateAge;
