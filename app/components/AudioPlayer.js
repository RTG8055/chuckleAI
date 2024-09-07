import { useRef } from 'react';

const AudioPlayer = ({ audioSrc }) => {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div className="mt-6">
      <audio ref={audioRef} src={audioSrc} controls className="w-full">
        Your browser does not support the audio element.
      </audio>

      <div className="flex space-x-4 justify-center mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={handlePlay}
        >
          Play
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          onClick={handlePause}
        >
          Pause
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
