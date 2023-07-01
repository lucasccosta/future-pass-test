# Future Pass Backend Challenge

## Description

[Link to test repo](https://github.com/holding-fpass/challenge-backend-fpass) 

## Installation

```bash
$ npm install
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Running the container

```bash
$ sudo docker compose up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Routes
> The API has two types of route, Public and Private ones. To use the private routes you have to authenticate first on the Authenticate Route and pass an Authorization Header on the request, following the pattern:
```
{ 'Authorization': 'Bearer token' }
```

### Public
- Create Users
   ```
  POST http://localhost:3000/create/users
  body: {username, email, password}
  ```

- Authenticate
  ```
  POST http://localhost:3000/auth
  body: {email, password}
  ```

- Search Heros
  ```
  POST http://localhost:3000/search/heros
  body: {name}
  ```
. How it works:

.You can search for heros by using part of the name, but it could not be as effective, or search for an exact name.

.Example:

Search for "doo" will generate the following hero as result:

  ```
doo ->  hero: { "id": 1011090, "name": "Brother Voodoo" }
  ```

It's not an effective result, but you can try to search for "doom":

  ```
doom ->  hero: { "id": 1009281, "name": "Doctor Doom" }
  ```

If you are thinking on "Victor Doom" you found it, but if you are looking for "Doomsday Man" you need to search more properly:

  ```
dooms ->  hero: { "id": 1009278, "name": "Doomsday Man" }
  ```

But if you try "doomsday n" you will get the message "Hero not found" because the app will search for some specific Doomsday N... and it does not exists.

### Private

- Add or remove hero from favorites

  ```
  POST http://localhost:3000/hero/favorite
  body: { "userId", "heroId", "name", "description" }
  ```

> Params: heroId, name and description are related to the Hero

> Notes: If a Hero is not on the database, this route will create it. The usage is simple, if the hero is not one of the user's favorite, the route will set it, and if the hero already is one of the favorites, the route will unmark it as favorite. 

- Get user and his favorite heros

  ```
  GET http://localhost:3000/user/:id
  ```

## Stay in touch

- Author - [Lucas Costa](https://github.com/lucasccosta)
- [LinkedIn](https://www.linkedin.com/in/lucasccosta/)

