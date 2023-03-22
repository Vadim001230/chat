import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseUrl from '../constants/baseURL';

export const messageApi = createApi({
  reducerPath: 'messageApi',
  tagTypes: ['Messages'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getMessages: build.query({
      query: ({ limit, offset }: { limit: number; offset: number }) =>
        `messages?${limit && `limit=${limit}`}${offset && `&offset=${offset}`}`,
      providesTags: ['Messages'],
    }),
    updateMessage: build.mutation({
      query: (body) => ({
        url: `messages`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Messages'],
    }),
    deleteMessage: build.mutation({
      query: ({ id }: { id: number }) => ({
        url: `messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messageApi;
