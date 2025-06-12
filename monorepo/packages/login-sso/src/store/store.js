/* eslint-disable import/no-extraneous-dependencies */
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import auth from './auth';
import user from './user';

const rootReducer = combineReducers({ auth, user });

const store = configureStore({
  reducer: rootReducer,
});
export { rootReducer, store };
