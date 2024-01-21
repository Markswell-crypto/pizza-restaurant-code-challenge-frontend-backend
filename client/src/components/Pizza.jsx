// Pizza.jsx (Add this component)
import React from 'react';

function Pizza({ pizza }) {
  return (
    <div key={pizza.id}>
      <h3>{pizza.name}</h3>
      <p>
        <em>{pizza.ingredients}</em>
      </p>
    </div>
  );
}

export default Pizza;