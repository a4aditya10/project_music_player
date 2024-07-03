import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';

const CountryTracks = () => {
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  useEffect(() => {
    // Step 1: Fetch the country code using geo IP API
    const fetchCountry = async () => {
      try {
        const res = await axios.get(`https://geo.ipify.org/api/v2/country?apiKey=${import.meta.env.VITE_GEO_API_KEY}`);
        setCountry(res.data?.location?.country);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Step 2: Get Spotify access token
    const fetchAccessToken = async () => {
      try {
        const res = await axios.post('https://accounts.spotify.com/api/token', null, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`).toString('base64'),
          },
          params: {
            'grant_type': 'client_credentials',
          },
        });
        return res.data.access_token;
      } catch (err) {
        console.error('Error fetching access token', err);
        return null;
      }
    };

    // Step 3: Fetch new releases from Spotify
    const fetchSongs = async (token) => {
      try {
        const res = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: {
            country: country, // Optional: Country code to get localized new releases
          },
        });
        setSongs(res.data.albums.items);
      } catch (err) {
        console.error('Error fetching new releases', err);
      }
    };

    // Main function to coordinate the fetching steps
    const loadSongs = async () => {
      setLoading(true);
      await fetchCountry();
      const token = await fetchAccessToken();
      if (token) {
        await fetchSongs(token);
      }
      setLoading(false);
    };

    loadSongs();
  }, [country]); // Re-run if country changes

  if (loading) return <Loader title="Loading Songs around you..." />;

  if (!loading && songs.length === 0) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Around you <span className="font-black">{country}</span>
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {songs.map((album, i) => (
          <SongCard
            key={album.id}
            song={{
              title: album.name,
              artist: album.artists[0].name,
              artwork: album.images[0].url,
              previewUrl: album.external_urls.spotify,
            }}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={songs}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default CountryTracks;
