import { configureStore } from '@reduxjs/toolkit';
import practiceReducer from './practiceSlice';

const store = configureStore({
  reducer: {
    practice: practiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;