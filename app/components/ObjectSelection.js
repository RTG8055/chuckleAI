import { useState } from "react";
import Image from "next/image";

const objectsList = [
  { name: "Toaster", image: "1.svg" },
  { name: "Clock", image: "2.svg" },
  { name: "Spoon", image: "3.svg" },
  { name: "Coffee mug", image: "4.svg" },
  { name: "Chair", image: "5.svg" },
  { name: "BathTub", image: "6.svg" },
  { name: "Lamp", image: "7.svg" },
  { name: "Book", image: "8.svg" },
];

const ObjectSelection = ({ onSelect }) => {
  const [selectedObject, setSelectedObject] = useState("");
  const [customObject, setCustomObject] = useState("");

  const handleSelect = (object) => {
    setSelectedObject(object);
    setCustomObject("");
    console.log(object);
    onSelect(object)
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
    const randomObject =
      objectsList[Math.floor(Math.random() * objectsList.length)];
    onSelect(randomObject);
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="object-list grid grid-cols-4">
          {objectsList.map((object, idx) => (
            <div
              key={idx}
              className={`object-item m-2 border rounded-lg cursor-pointer ${
                selectedObject === object
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleSelect(object.name)}
            >
              <Image
              src={object.image}
              alt="Picture of the Object"
              width={100}
              height={100}
              className="w-full h-full object-cover object-center"
            />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ObjectSelection;
