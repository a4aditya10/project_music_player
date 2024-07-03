import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Replace with your actual Spotify API base URL
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';
const SPOTIFY_ACCESS_TOKEN = 'YOUR_SPOTIFY_ACCESS_TOKEN'; // Use the token obtained from the above script

export const spotifyApi = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SPOTIFY_API_URL,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${SPOTIFY_ACCESS_TOKEN}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: () => 'browse/new-releases',
    }),
    getSongsByGenre: builder.query({
      query: (genreId) => `recommendations?seed_genres=${genreId}`,
    }),
    getSongsBySearch: builder.query({
      query: (searchTerm) => `search?q=${searchTerm}&type=track`,
    }),
    getArtistDetails: builder.query({
      query: (artistId) => `artists/${artistId}`,
    }),
    getSongDetails: builder.query({
      query: (trackId) => `tracks/${trackId}`,
    }),
    getSongRelated: builder.query({
      query: (trackId) => `tracks/${trackId}/related`,
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongsByGenreQuery,
  useGetSongsBySearchQuery,
  useGetArtistDetailsQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
} = spotifyApi;
