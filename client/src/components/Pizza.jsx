import React from 'react';

function Pizza({ pizza }) {
  return (
    <div key={pizza.id} className="card mb-3">
      <div className="card-body">
        <h3 className="card-title">{pizza.name}</h3>
        <p className="card-text">
          <em>{pizza.ingredients}</em>
        </p>
      </div>
    </div>
  );
}

export default Pizza;
