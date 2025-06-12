export const getDateComponents = (dateOfbirth) => {
  const date = new Date(dateOfbirth);

  const dob = date.getDate();
  const dom = date.getMonth() + 1;
  const doy = date.getFullYear();

  return { dob, dom, doy };
};
