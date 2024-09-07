import { useState } from 'react';

const objectsList = ["Cat", "Dog", "Car", "Pizza", "Random Object"];

const ObjectSelection = ({ onSelect }) => {
  const [selectedObject, setSelectedObject] = useState('');
  const [customObject, setCustomObject] = useState('');

  const handleSelect = (object) => {
    setSelectedObject(object);
    setCustomObject('');
    console.log(object);
  };

  const handleSubmit = () => {
    if (customObject) {
      onSelect(customObject);
    } else if (selectedObject) {
      onSelect(selectedObject);
    } else {
      alert("Please select or enter an object.");
    }
  };

  const handleRandom = () => {
    const randomObject = objectsList[Math.floor(Math.random() * objectsList.length)];
    onSelect(randomObject);
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-gray-700">Select Object</h2>
        <div className="object-list flex flex-wrap">
          {objectsList.map((object, idx) => (
            <div
              key={idx}
              className={`object-item p-2 m-2 border rounded cursor-pointer ${selectedObject === object ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleSelect(object)}
            >
              {object}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ObjectSelection;
