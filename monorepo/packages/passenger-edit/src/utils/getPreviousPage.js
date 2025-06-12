const getPreviousPage = () => {
  let previousPage = '';
  const navigation = window?.navigation?.from;
  if (navigation?.url) {
    previousPage = navigation?.url?.split('/')?.pop()?.replace('html', '');
  }
  return previousPage;
};

export default getPreviousPage;
