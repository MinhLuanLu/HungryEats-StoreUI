import React from "react";
import "../styles/menu.css";

const menuData = [
  {
    name: "Breakfast",
    foods: [
      { name: "Scrambled Eggs", quantity: 5, image: "/images/scrambled-eggs.jpg" },
      { name: "Pancakes", quantity: 3, image: "/images/pancakes.jpg" },
      { name: "Fruit Salad", quantity: 7, image: "/images/fruit-salad.jpg" },
    ],
  },
  {
    name: "Lunch",
    foods: [
      { name: "Grilled Chicken", quantity: 4, image: "/images/grilled-chicken.jpg" },
      { name: "Caesar Salad", quantity: 6, image: "/images/caesar-salad.jpg" },
      { name: "Spaghetti Bolognese", quantity: 3, image: "/images/spaghetti.jpg" },
    ],
  },
  {
    name: "Dinner",
    foods: [
      { name: "Steak", quantity: 2, image: "/images/steak.jpg" },
      { name: "Roasted Vegetables", quantity: 5, image: "/images/roasted-veggies.jpg" },
      { name: "Chicken Curry", quantity: 4, image: "/images/chicken-curry.jpg" },
    ],
  },
];

function MenuPage() {
  return (
    <div className="menu-container">
      <h1 className="menu-title">Our Menu</h1>
      <input type="text" placeholder="Search menu..."/>
      {menuData.map((menu) => (
        <div key={menu.name} className="menu-section">
          <h2 className="menu-category">{menu.name}</h2>
          <div className="food-list">
            {menu.foods.map((food) => (
              <div key={food.name} className="food-item">
                <img src={food.image} alt={food.name} className="food-image" />
                <div className="food-details">
                  <p className="food-name">{food.name}</p>
                  <span className="food-quantity">({food.quantity})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuPage;
