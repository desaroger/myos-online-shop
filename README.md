# Myos online shop

Basic example of an online shop backend.

- NodeJS/Typescript with an apollo server
- typeorm and type-graphql
- jest tests and eslint
- postgres as db, eslint in memory for tests
- with docker and a minimalist github CI

## Getting started

### Run with docker

```sh
$ docker-compose up -d
```

Then go to http://localhost:3000.

### Tests

```sh
$ npm run test
```

(You will need to install dependencies with `npm ci` before running it)

### Lint

```sh
$ npm run lint
```

(You will need to install dependencies with `npm ci` before running it)

## Thoughts

### There is no user

I didn't add the User model to simplify the usage of the API and the complexity of
the tests. In a real world project there will be a User model with a oneToMany
relationship to Orders.

### We should use locks

In the method Order.setItem we are querying for the order item, modifying it or
creating a new one. This process can fail if multiple requests are managed for the
same order and product. All that process should be wrapped inside a lock to avoid it.

### Ids are numbers

I simply kept the ids as default, but a real world project should use UUID or something
similar.

### Prices caveats

- All prices should be treated as integers, representing the smallest division of the
currency in use (cents, penny, etc).
- There should be, along with every price, a currency identifier (probably ISO 4217).
- Prices are calculated "live" on the carts (so if for example a product changes the price, the cart also changes), but once you confirm the cart the price gets fixed.

### OrderItem shouldn't have ID

Currently OrderItem has ids, but it shouldn't. It has unique order/product combination, so
you only need to create a composite primary key with orderId and productId. I tried this
with typeorm but I got some issues, and I had no time to ditch into it to find why. Another
problem related with that forced me to add the OrderItem fields orderId and productId, which
are actually automatically added by the ManyToOne relationship, but I had problems with search
and with creating entities, and I have no more time to investigate it.

### Lack of pagination

I didn't implement pagination on products listing nor search. In a real world project there
should be some kind of pagination, probably a skip/limit or a bookmark.

### Order status is not an Enum

I started the project with Order.status being an enum, but the db we use for testing (sqlite)
does not support them, so I removed them and used string instead. Probably would be worth it
to investigate if there is a way to use enums again.

Also, all order status but "cart" are an example of a checkout process statuses, they are not
used in the backend right now.

### Entity creation in tests are awful

I didn't find a way to create entities with relations (like an Order with Items) in a one-step
operation. The only way it worked for me was to create the parent entity and then the child
entities. There must be a way to do it in typeorm, but I have no more time to investigate.
