import React, { useState, useCallback } from 'react';

interface MovingButtonProps {
  onClick: () => void;
  className: string;
  children: React.ReactNode;
  maxMoves: number;
}

const MovingButton: React.FC<MovingButtonProps> = ({ onClick, className, children, maxMoves }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);

  const moveButton = useCallback(() => {
    if (moves < maxMoves) {
      const newX = Math.random() * 400 - 150; // Random value between -50 and 50
      const newY = Math.random() * 100 - 50; // Random value between -50 and 50
      setPosition({ x: newX, y: newY });
      setMoves(moves + 1);
    }
  }, [moves, maxMoves]);

  const handleMouseEnter = () => {
    if (moves < maxMoves) {
      moveButton();
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${className} transition-transform duration-200 ease-in-out`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </button>
  );
};

export default MovingButton;