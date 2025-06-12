const checkIfAllGenderOpted = (objectsArray) => {
  for (const obj of objectsArray) {
    if (!Object.prototype.hasOwnProperty.call(obj, 'gender') || obj.gender === '') {
      return false;
    }
  }
  return true;
};

export default checkIfAllGenderOpted;
