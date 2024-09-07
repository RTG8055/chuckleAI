'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleTextToSpeech = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Hello, how can I help you today?' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const arrayBuffer = await response.arrayBuffer();
      await playAudioBuffer(arrayBuffer);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate audio');
    } finally {
      setIsLoading(false);
    }
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={handleTextToSpeech}
        disabled={isLoading || isPlaying}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Loading...' : isPlaying ? 'Playing...' : 'Read Text'}
      </button>
    </main>
  );
}