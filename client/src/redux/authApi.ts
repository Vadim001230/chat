import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseUrl from '../constants/baseURL';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    registration: build.mutation({
      query: (body) => ({
        url: `registration`,
        method: 'POST',
        body,
      }),
    }),
    signin: build.mutation({
      query: (body) => ({
        url: `login`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useRegistrationMutation, useSigninMutation } = authApi;
