// Restaurant.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PizzaForm from './PizzaForm';
import Pizza from './Pizza'; 

function Restaurant() {
  const [{ data: restaurant, error, status }, setRestaurant] = useState({
    data: { pizzas: [] }, // Initialize pizzas array
    error: null,
    status: 'pending',
  });
  const { id } = useParams();

  useEffect(() => {
    fetch(`/restaurants/${id}`)
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error('Restaurant not found');
        }
      })
      .then((restaurant) =>
        setRestaurant({ data: restaurant, error: null, status: 'resolved' })
      )
      .catch((err) =>
        setRestaurant({ data: null, error: err.message, status: 'rejected' })
      );
  }, [id]);

  function handleAddPizza(newPizza) {
    setRestaurant({
      data: {
        ...restaurant,
        pizzas: [...restaurant.pizzas, newPizza],
      },
      error: null,
      status: 'resolved',
    });
  }

  if (status === 'pending') return <h1>Loading...</h1>;
  if (status === 'rejected') return <h1>Error: {error}</h1>;

  return (
    <section className="container">
      <div className="card">
        <h1>{restaurant.name}</h1>
        <p>{restaurant.address}</p>
      </div>
      <div className="card">
        <h2>Pizza Menu</h2>
        {restaurant.pizzas.map((pizza) => (
          <Pizza key={pizza.id} pizza={pizza} />
        ))}
      </div>
      <div className="card">
        <h3>Add New Pizza</h3>
        <PizzaForm restaurantId={restaurant.id} onAddPizza={handleAddPizza} />
      </div>
    </section>
  );
}

export default Restaurant;