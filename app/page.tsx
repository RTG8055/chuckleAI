"use client";

import { useState } from 'react';
import axios from 'axios';
import ObjectSelection from './components/ObjectSelection';
import AudioPlayer from './components/AudioPlayer';

export default function Home() {
  const [audioSrc, setAudioSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customObject, setCustomObject] = useState('');

  const handleObjectSelect = async (selectedObject) => {
    setLoading(true);
    setAudioSrc('');
    setError('');
    
    try {
      // API call to backend to get the audio stream of the joke
      const response = await axios.post('/api/v1/generate', {
        object: selectedObject,
      });

      // Assuming the response contains an audio URL
      setAudioSrc(response.data.audioUrl);
    } catch (error) {
      setError('Failed to fetch the joke. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomObjectChange = (e) => {
    setCustomObject(e.target.value);
  };

  const handleGenerateJoke = () => {
    if (customObject) {
      handleObjectSelect(customObject);
    }
  };

  const handleRandomObject = () => {
    const randomObjects = ['cat', 'pizza'];
    const randomObject = randomObjects[Math.floor(Math.random() * randomObjects.length)];
    handleObjectSelect(randomObject);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          AI Standup App
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <ObjectSelection onSelect={handleObjectSelect} />
          {/* Repeat <ObjectSelection /> component as needed */}
        </div>

        <div className="mt-4 flex flex-col items-center">
          <input
            type="text"
            placeholder="Type any object"
            value={customObject}
            onChange={handleCustomObjectChange}
            className="border p-2 rounded mb-4 w-full max-w-md text-black" // Added text-black class
          />
          <div className="flex space-x-4">
            <button
              onClick={handleGenerateJoke}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Generate Joke
            </button>
            <button
              onClick={handleRandomObject}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Use Random Object
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}

        {audioSrc && <AudioPlayer audioSrc={audioSrc} />}
      </div>
    </div>
  );
}
