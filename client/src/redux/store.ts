import { configureStore } from '@reduxjs/toolkit';
import { messageApi } from './messageApi';

const store = configureStore({
  reducer: {
    [messageApi.reducerPath]: messageApi.reducer,
  },
  middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat(messageApi.middleware),
});
export default store;
