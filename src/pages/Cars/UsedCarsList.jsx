import React from "react";

const cars = [
  {
    brand: "Toyota",
    model: "Corolla",
    year: 2018,
    color: "White",
    price: 8500,
    km: 75000,
    location: "Cairo",
    email: "seller1@example.com",
    image: "https://via.placeholder.com/400x200?text=Toyota+Corolla"
  },
  {
    brand: "Hyundai",
    model: "Elantra",
    year: 2020,
    color: "Blue",
    price: 10500,
    km: 50000,
    location: "Giza",
    email: "seller2@example.com",
    image: "https://via.placeholder.com/400x200?text=Hyundai+Elantra"
  },
  {
    brand: "Nissan",
    model: "Sunny",
    year: 2017,
    color: "Silver",
    price: 6500,
    km: 98000,
    location: "Alexandria",
    email: "seller3@example.com",
    image: "https://via.placeholder.com/400x200?text=Nissan+Sunny"
  }
];

const UsedCarsList = () => {
  return (
    <div className="max-w-6xl mt-20 mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car, index) => (
        <div key={index} className="bg-white shadow-md rounded-xl overflow-hidden">
          <img src={car.image} alt={car.model} className="w-full h-48 object-cover" />
          <div className="p-4 space-y-2">
            <h3 className="text-xl font-bold">{car.brand} {car.model} ({car.year})</h3>
            <p className="text-gray-600">Color: {car.color}</p>
            <p className="text-gray-600">KM: {car.km}</p>
            <p className="text-gray-800 font-semibold">Price: ${car.price}</p>
            <p className="text-sm text-gray-500">{car.location}</p>
            <p className="text-sm text-gray-500">Email: {car.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsedCarsList;
