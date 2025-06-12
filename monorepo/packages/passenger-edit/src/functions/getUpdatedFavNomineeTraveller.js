import { getTravellerWithLoggedInFirst } from './getTravellerWithLoggedInFirst';

const getUpdatedFavNomineeTraveller = ({
  loggedInUserData,
  favoriteTraveller,
  nomineeTraveller,
  isBurnflow,
  disableLoyalty,
}) => {
  if (disableLoyalty) {
    return favoriteTraveller ? [...favoriteTraveller] : [];
  }
  if (loggedInUserData) {
    if (favoriteTraveller || nomineeTraveller) {
      const nomineeTravellers = nomineeTraveller ? [...nomineeTraveller] : [];
      const favoriteTravellers = !isBurnflow && favoriteTraveller ? [...favoriteTraveller] : [];
      const allTravellers = [...nomineeTravellers, ...favoriteTravellers];
      return getTravellerWithLoggedInFirst({
        travellers: [...allTravellers],
        loggedInUserData,
      });
    }

    return [loggedInUserData];
  }
  return [];
};

export default getUpdatedFavNomineeTraveller;
