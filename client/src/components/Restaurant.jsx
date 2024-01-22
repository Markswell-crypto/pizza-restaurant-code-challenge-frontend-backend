import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PizzaForm from './PizzaForm';
import Pizza from './Pizza';

function Restaurant() {
  const [{ data: restaurant, error, status }, setRestaurant] = useState({
    data: { pizzas: [] },
    error: null,
    status: 'pending',
  });
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5555/restaurants/${id}`)
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
    <section className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">{restaurant.name}</h1>
          <p className="card-text">{restaurant.address}</p>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="card-title">Pizza Menu</h2>
          {restaurant.pizzas.map((pizza) => (
            <Pizza key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h3 className="card-title">Add New Pizza</h3>
          <PizzaForm restaurantId={restaurant.id} onAddPizza={handleAddPizza} />
        </div>
      </div>
    </section>
  );
}

export default Restaurant;
