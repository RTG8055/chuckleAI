"use client";

import { useEffect, useRef, useState } from "react";
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleObjectSelect = async (selectedObject: any) => {
    setLoading(true);
    setAudioSrc("");
    setError("");

    try {
      // API call to backend to get the audio stream of the joke
      const response = await axios.post("/api/generate", {
        object: selectedObject,
      });

      console.log(response)

      const audioResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: response.data.joke }),
      });

      if (!audioResponse.ok) {
        throw new Error('Failed to generate audio');
      }

      const arrayBuffer = await audioResponse.arrayBuffer();
      await playAudioBuffer(arrayBuffer);

    } catch (error) {
      setError("Failed to fetch the joke. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelection = (imageName: any) => {
    console.log(imageName)
    setCustomObject(imageName);
  }

  const handleCustomObjectChange = (e: any) => {
    setCustomObject(e.target.value);
  };

  const handleGenerateJoke = () => {
    console.log(customObject)
    if (customObject) {
      handleObjectSelect(customObject);
    }
  };

  const handleRandomObject = () => {
    const randomObjects = ["cat", "pizza"];
    const randomObject =
      randomObjects[Math.floor(Math.random() * randomObjects.length)];
    console.log(randomObject)
    setCustomObject(randomObject)
    handleObjectSelect(randomObject);
  };

  const playAudioBuffer = async (arrayBuffer: ArrayBuffer) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }

    sourceNodeRef.current = audioContextRef.current.createBufferSource();
    sourceNodeRef.current.buffer = audioBuffer;
    sourceNodeRef.current.connect(audioContextRef.current.destination);
    sourceNodeRef.current.start();
    setIsPlaying(true);

    sourceNodeRef.current.onended = () => {
      setIsPlaying(false);
    };
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center py-5 `}>
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat z-[-100] bg-black"></div>
      <div className="p-4 rounded-lg  w-[60%] max-w-7xl">
        <p className="text-5xl text-white text-center my-2 mb-8">Chuckle AI</p>
        <div className="flex flex-col gap-3 items-center">
          <h2 className="text-white text-md">Select an object</h2>
          <div className="flex">
            <ObjectSelection onSelect={handleImageSelection} />
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
