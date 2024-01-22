// Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5555/restaurants')
      .then((r) => {
        if (!r.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        return r.json();
      })
      .then((data) => {
        setRestaurants(data);
      })
      .catch((error) => {
        console.error('Error fetching restaurants:', error);
        // Handle error as needed, e.g., set an error state
      });
  }, []);
  

  function handleDelete(id) {
    fetch(`http://localhost:5555/restaurants/${id}`, {
      method: 'DELETE',
    }).then((r) => {
      if (r.ok) {
        setRestaurants((restaurants) =>
          restaurants.filter((restaurant) => restaurant.id !== id)
        );
      }
    });
  }

  return (
    <section className="container">
      {restaurants.map((restaurant) => (
        <div key={restaurant.id} className="card">
          <h2>
            <Link to={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link>
          </h2>
          <p>Address: {restaurant.address}</p>
          <button onClick={() => handleDelete(restaurant.id)}>Delete</button>
        </div>
      ))}
    </section>
  );
}

export default Home;