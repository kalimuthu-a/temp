import { lazy } from 'react';

const AsyncComponent = ({ loader }) => lazy(loader);

export default AsyncComponent;
