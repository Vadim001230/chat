import { configureStore } from '@reduxjs/toolkit';
import { messageApi } from './messageApi';
import { authApi } from './authApi';

const store = configureStore({
  reducer: {
    [messageApi.reducerPath]: messageApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware().concat(messageApi.middleware, authApi.middleware),
});
export default store;
