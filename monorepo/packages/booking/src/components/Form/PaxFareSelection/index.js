import AsyncComponent from '../../common/AsyncComponent';

export default AsyncComponent({
  loader: () => import('./PaxFareSelection'),
});
