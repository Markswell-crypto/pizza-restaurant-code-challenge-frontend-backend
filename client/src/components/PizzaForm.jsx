import React, { useEffect, useState } from 'react';

function PizzaForm({ restaurantId, onAddPizza }) {
  const [pizzas, setPizzas] = useState([]);
  const [pizzaId, setPizzaId] = useState('');
  const [price, setPrice] = useState('');
  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5555/pizzas')
      .then((r) => r.json())
      .then(setPizzas);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = {
      pizza_id: pizzaId,
      restaurant_id: restaurantId,
      price: parseInt(price),
    };
    fetch('http://localhost:5555/restaurant_pizzas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.errors) {
          setFormErrors(data.errors);
        } else {
          onAddPizza(data);
          setFormErrors([]);
        }
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="pizza_id">Pizza:</label>
        <select
          className="form-control"
          id="pizza_id"
          name="pizza_id"
          value={pizzaId}
          onChange={(e) => setPizzaId(e.target.value)}
        >
          <option value="">Select a pizza</option>
          {pizzas.map((pizza) => (
            <option key={pizza.id} value={pizza.id}>
              {pizza.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          className="form-control"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      {formErrors.length > 0 ? (
        <div className="alert alert-danger">
          {formErrors.map((err, index) => (
            <p key={index}>{err}</p>
          ))}
        </div>
      ) : null}
      <button type="submit" className="btn btn-primary">
        Add To Restaurant
      </button>
    </form>
  );
}

export default PizzaForm;
