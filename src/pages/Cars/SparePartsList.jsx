import React from "react";

const parts = [
  {
    name: "Ahmed",
    email: "ahmed@example.com",
    image: "https://via.placeholder.com/400x200?text=Brake+Pads",
    brand: "Bosch",
    model: "BP123",
    desc: "High quality brake pads.",
    partCategory: "Brakes",
    price: 300,
    amount: 4
  },
  {
    name: "Sara",
    email: "sara@example.com",
    image: "https://via.placeholder.com/400x200?text=Oil+Filter",
    brand: "Mann",
    model: "OF987",
    desc: "Durable oil filter for long use.",
    partCategory: "Engine",
    price: 120,
    amount: 10
  },
  {
    name: "Mohamed",
    email: "mohamed@example.com",
    image: "https://via.placeholder.com/400x200?text=Air+Filter",
    brand: "ACDelco",
    model: "AF456",
    desc: "Efficient air filter.",
    partCategory: "Air System",
    price: 80,
    amount: 7
  }
];

const SparePartsList = () => {
  return (
    <div className="max-w-6xl mt-20 mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {parts.map((part, index) => (
        <div key={index} className="bg-white shadow-md rounded-xl overflow-hidden">
          <img src={part.image} alt={part.model} className="w-full h-48 object-cover" />
          <div className="p-4 space-y-2">
            <h3 className="text-xl font-bold">{part.brand} {part.model}</h3>
            <p className="text-gray-600">Category: {part.partCategory}</p>
            <p className="text-gray-600">Amount: {part.amount}</p>
            <p className="text-gray-800 font-semibold">Price: ${part.price}</p>
            <p className="text-sm text-gray-500">Seller: {part.name}</p>
            <p className="text-sm text-gray-500">Email: {part.email}</p>
            <p className="text-sm text-gray-500">{part.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SparePartsList;
