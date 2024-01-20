#!/usr/bin/env python3

from flask import Flask, request, make_response
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_restx import Api, Resource, Namespace, fields

from server.models import db, Restaurant, Pizza, RestaurantPizza

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JSON_SORT_KEYS"] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)
ma = Marshmallow(app)

api = Api()
api.init_app(app)

ns = Namespace("api")
api.add_namespace(ns)

class RestaurantSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Restaurant
        ordered=True

    id = ma.auto_field()
    name = ma.auto_field()
    address = ma.auto_field()

restaurant_schema = RestaurantSchema()
restaurants_schema = RestaurantSchema(many=True)


class PizzasSchema(ma.SQLAlchemySchema):

    class Meta:
        model = Pizza
        ordered=True
    
    id = ma.auto_field()
    name = ma.auto_field()
    ingredients = ma.auto_field()

pizza_schema = PizzasSchema()
pizzas_schema = PizzasSchema(many=True)

class RestaurantPizzaSchema(ma.SQLAlchemySchema):

    class Meta:
        model = RestaurantPizza
        ordered=True
    
    id = ma.auto_field()
    price = ma.auto_field()

restaurant_pizza_schema = RestaurantPizzaSchema()


