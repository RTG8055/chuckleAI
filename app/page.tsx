"use client";

import { useState } from "react";
import axios from "axios";
import ObjectSelection from "./components/ObjectSelection";
import AudioPlayer from "./components/AudioPlayer";
import MovingButton from "./components/MovingButton";
import './globals.css'

export default function Home() {
  const [audioSrc, setAudioSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customObject, setCustomObject] = useState("");

  const handleObjectSelect = async (selectedObject: any) => {
    setLoading(true);
    setAudioSrc("");
    setError("");

    try {
      // API call to backend to get the audio stream of the joke
      const response = await axios.post("/api/generate", {
        object: customObject,
      });

      // Assuming the response contains an audio URL
      setAudioSrc(response.data.audioUrl);
    } catch (error) {
      setError("Failed to fetch the joke. Please try again.");
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
    const randomObjects = ["cat", "pizza"];
    const randomObject =
      randomObjects[Math.floor(Math.random() * randomObjects.length)];
    handleObjectSelect(randomObject);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center py-5 `}>
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat z-[-100] bg-black"></div>
      <div className="p-4 rounded-lg  w-[60%] max-w-7xl">
        <p className="text-5xl text-white text-center my-2 mb-8">Chuckle AI</p>
        <div className="flex flex-col gap-3 items-center">
          <h2 className="text-white text-md">Select an object</h2>
          <div className="flex">
            <ObjectSelection onSelect={handleObjectSelect} />
            {/* Repeat <ObjectSelection /> component as needed */}
          </div>
          <h2 className="text-white text-md">or</h2>
          <div className="mt-4 flex flex-col">
            <input
              type="text"
              placeholder="Type any object"
              value={customObject}
              onChange={handleCustomObjectChange}
              className="border p-2 rounded mb-2 w-full max-w-md text-black" // Added text-black class
            />
            <div className="mt-2 flex flex-row items-center gap-2">
          <MovingButton
            onClick={handleGenerateJoke}
            className="bg-blue-700 text-white px-4 py-2 rounded"
            maxMoves={1}
          >
            Generate Joke
          </MovingButton>
          <MovingButton
            onClick={handleRandomObject}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            maxMoves={1}
          >
            Use Random Object
          </MovingButton>
        </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        )}

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {audioSrc && <AudioPlayer audioSrc={audioSrc} />}
      </div>
    </div>
  );
}
