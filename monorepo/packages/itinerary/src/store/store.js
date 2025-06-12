import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import user from './user';
import itinerary from './itinerary';
import configData from './configData';

const rootReducer = combineReducers({ user, itinerary, configData });

const store = configureStore({
  reducer: rootReducer,
});
export { rootReducer, store };
