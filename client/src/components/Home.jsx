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
    <section className="container justify-content-center align-items-center mt-4">
      {restaurants.map((restaurant) => (
        <div key={restaurant.id} className="card mb-3">
          <div className="card-body">
            <h2 className="card-title">
              <Link to={`/restaurants/${restaurant.id}`} className="text-decoration-none">
                {restaurant.name}
              </Link>
            </h2>
            <p className="card-text">Address: {restaurant.address}</p>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(restaurant.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Home;
