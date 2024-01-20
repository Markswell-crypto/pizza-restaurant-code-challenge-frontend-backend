#!/usr/bin/env python3

from flask import Flask, request, make_response
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, reqparse, fields, abort

from models import db, Restaurant, Pizza, RestaurantPizza

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JSON_SORT_KEYS"] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)
ma = Marshmallow(app)

api = Api(app)

class RestaurantSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Restaurant
        ordered = True

    id = ma.auto_field()
    name = ma.auto_field()
    address = ma.auto_field()

restaurant_schema = RestaurantSchema()
restaurants_schema = RestaurantSchema(many=True)

class PizzasSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Pizza
        ordered = True

    id = ma.auto_field()
    name = ma.auto_field()
    ingredients = ma.auto_field()

pizza_schema = PizzasSchema()
pizzas_schema = PizzasSchema(many=True)

class RestaurantPizzaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = RestaurantPizza
        ordered = True

    id = ma.auto_field()
    price = ma.auto_field()

restaurant_pizza_schema = RestaurantPizzaSchema()

# Restful input parser
restaurant_parser = reqparse.RequestParser()
restaurant_parser.add_argument('name', type=str, help='Restaurant name', required=True)
restaurant_parser.add_argument('address', type=str, help='Restaurant address', required=True)

pizza_parser = reqparse.RequestParser()
pizza_parser.add_argument('name', type=str, help='Pizza name', required=True)
pizza_parser.add_argument('ingredients', type=str, help='Pizza ingredients', required=True)

restaurant_pizza_parser = reqparse.RequestParser()
restaurant_pizza_parser.add_argument('price', type=int, help='Pizza price', required=True)
restaurant_pizza_parser.add_argument('restaurant_id', type=int, help='Restaurant ID', required=True)
restaurant_pizza_parser.add_argument('pizza_id', type=int, help='Pizza ID', required=True)

# RESTful Resources
class RestaurantsResource(Resource):
    def get(self):
        restaurants = Restaurant.query.all()

        if not restaurants:
            abort(404, message="This record does not exist in our database. Please try again.")
        
        return restaurants_schema.dump(restaurants), 200

    def post(self):
        args = restaurant_parser.parse_args()
        new_restaurant = Restaurant(name=args['name'], address=args['address'])

        db.session.add(new_restaurant)
        db.session.commit()

        return restaurant_schema.dump(new_restaurant), 201

class RestaurantByIDResource(Resource):
    def get(self, id):
        restaurant = Restaurant.query.get(id)

        if not restaurant:
            abort(404, message="Restaurant not found")

        pizzas = Pizza.query.join(RestaurantPizza).filter(RestaurantPizza.restaurant_id == id).all()

        response_body = {
            "id": restaurant.id,
            "name": restaurant.name,
            "address": restaurant.address,
            "pizzas": [{"id": pizza.id, "name": pizza.name, "ingredients": pizza.ingredients} for pizza in pizzas]
        }

        return response_body, 200

    def delete(self, id):
        restaurant = Restaurant.query.get(id)

        if not restaurant:
            abort(404, message="Restaurant not found.")

        db.session.delete(restaurant)
        db.session.commit()

        return {}, 204

    def patch(self, id):
        restaurant = Restaurant.query.get(id)

        if not restaurant:
            abort(404, message="Restaurant not found.")

        args = restaurant_parser.parse_args()
        restaurant.name = args['name']
        restaurant.address = args['address']

        db.session.commit()

        return restaurant_schema.dump(restaurant), 200

class PizzasResource(Resource):
    def get(self):
        pizzas = Pizza.query.all()

        if not pizzas:
            abort(404, message="Pizza not found.")

        return pizzas_schema.dump(pizzas), 200

    def post(self):
        args = pizza_parser.parse_args()
        new_pizza = Pizza(name=args['name'], ingredients=args['ingredients'])

        db.session.add(new_pizza)
        db.session.commit()

        return pizza_schema.dump(new_pizza), 201

class PizzaByIDResource(Resource):
    def get(self, id):
        pizza_exists = Pizza.query.get(id)

        if not pizza_exists:
            abort(404, message="Pizza not found.")

        return pizza_schema.dump(pizza_exists), 200

    def patch(self, id):
        pizza = Pizza.query.get(id)

        if not pizza:
            abort(404, message="Pizza not found.")

        args = pizza_parser.parse_args()
        pizza.name = args['name']
        pizza.ingredients = args['ingredients']

        db.session.commit()

        return pizza_schema.dump(pizza), 200

    def delete(self, id):
        pizza = Pizza.query.get(id)

        if not pizza:
            abort(404, message="Pizza not found.")

        db.session.delete(pizza)
        db.session.commit()

        return {"message": "Pizza deleted successfully."}, 204

class RestaurantPizzasResource(Resource):
    def post(self):
        args = restaurant_pizza_parser.parse_args()
        restaurant_pizza = RestaurantPizza(
            price=args["price"],
            restaurant_id=args["restaurant_id"],
            pizza_id=args["pizza_id"]
        )

        restaurant = Restaurant.query.get(args["restaurant_id"])
        pizza = Pizza.query.get(args["pizza_id"])

        if not pizza and not restaurant:
            abort(404, message="Restaurant and Pizza not found.")
        elif not restaurant:
            abort(404, message="Restaurant not found.")
        elif not pizza:
            abort(404, message="Pizza not found.")
        elif not (1 <= args["price"] <= 30):
            abort(422, message="Validation Error", errors={"message": "Price must be between 1 and 30"})

        db.session.add(restaurant_pizza)
        db.session.commit()

        return pizza_schema.dump(pizza), 201

# RESTful routes
api.add_resource(RestaurantsResource, '/api/restaurants')
api.add_resource(RestaurantByIDResource, '/api/restaurants/<int:id>')
api.add_resource(PizzasResource, '/api/pizzas')
api.add_resource(PizzaByIDResource, '/api/pizzas/<int:id>')
api.add_resource(RestaurantPizzasResource, '/api/restaurant_pizzas')
