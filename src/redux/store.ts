import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import cats from './reducers/cats';

export const store = configureStore({
  reducer: {
    cats,
  },
  devTools: true,
});

export const useStoreDispatch = () => useDispatch<typeof store.dispatch>();
export type RootState = ReturnType<typeof store.getState>;
