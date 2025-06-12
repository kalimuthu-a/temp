// Returning empty array means all required fields are checked
const requiredTickSelected = (arr = []) => {
  return arr.filter((val) => {
    return val.required && !val.checked;
  });
};

export default requiredTickSelected;
