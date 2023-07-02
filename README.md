# Future Pass Backend Challenge

## Description

[Link to test repo](https://github.com/holding-fpass/challenge-backend-fpass) 

## Architecture
The architecture on this project followed the design of Clean Architecture. I created different layers that have a single and exclusive responsibility, as suggested by the SOLID pattern, and separated the business rules from the application rules, with each layer responsible for solving only the proposed problem. The layers were:

- Controller: Layer responsible for receiving http calls and returning the response to the user, both positive and returning error cases if they occur.

- Use Case:
Responsible for orchestrating the actions of that route. For example, a create user use case will capture the actions of checking whether that user already exists in the database, if it exists, it will return an error message to the user, and if it does not exist, ask the responsible service to communicate with the bank. of data to actually create this user.

- Service: Layer responsible for communicating with the database

- Provider: Layer responsible for communicating with external environments and APIs, in this case it was the Marvel API.

- Domain: layer responsible for dealing with the business rule. * Particularly in this app, we only have the User domain, since all the business rules are related to the user, whether in creating the same, encrypting your password or checking that user's favorite hero. It is also worth noting that neither the Hero entity nor the UserHero entity has a specific domain layer to avoid the Anemic Domain anti-pattern, which you can read more about in this Martin Fowler article: https://martinfowler.com/bliki/AnemicDomainModel. html

## Considerations about technologies used:

All layers are covered by unit tests.

A caching strategy was used, using Nestjs' own cache manager, just to be able to return data more quickly in later calls, since the marvel api is paged, which means that we may have to make many calls to get a simple answer, which helps in that sense because it records for a certain time the data that was fetched in a previous call.

I insisted on distinguishing a public route from a private one, thus creating the need to create a user and login to access the private routes. Authentication was via JWT.

I used docker to facilitate the development of this app and make the tests simpler and faster

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
- How it works:

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

