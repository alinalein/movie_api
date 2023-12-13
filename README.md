## Movie_API 🎬🍿
Hello to my Movie_API!

## Technology Stack 🛠️
- **Node.js** : Runtime for server-side JavaScript, designed for scalability
- **Express.js** : Web framework for Node.js, streamlining web app development
- **MongoDB** : NoSQL database, flexible and scalable with JSON-like documents
- **Mongoose** : MongoDB and Node.js ODM, simplifying data modeling
- **JWT (JSON Web Token)** : Compact, secure token for representing claims between parties
- **Postman** : API development platform, streamlining testing and debugging
- **Heroku** : Cloud platform for deploying and managing applications

## Getting started 😎

### Clone the repository:
```
git clone https://github.com/alinalein/movie_api.git
```

### Change the directory:
```
cd movie_api
```
### Install the dependencies
```
npm install
```
### Run the server
```
npm start
```

## API Endpoints 🔍

 [Documentation of Endpoints](https://movie-api-lina-834bc70d6952.herokuapp.com/documentation.html)
- `/movies` : Return a list of ALL movies
- `/movies/title/[Title]` : Return data about a single movie by title
- `/movies/genre/[Genre]` : Return data about a genre by name
- `/movies/director/[Director]` : Return data about a director by name
- `/users/register` : Allow new users to register
- `/users/update/[Username]` : Allow users to update their username
- `/users/[Username]/movies/add/[MovieID]` : Allow users to add a movie from their list of favorites
- `/users/[Username]/movies/remove/[MovieId]` : Allow users to remove a movie from their list of favorites
- `/users/deregister/[Username]` : Allow existing users to deregister
- `/users/login` : Allows the user to log in to their profile
 
 ## User Stories 💃 🕺
 As a user, I want to sign in/sign up to the application so I can save data about my favorite movies.
 
 As a user, I want to access details about movies, directors, and genres so that I will be able to see information about movies I am interessted in. 

## Link to the live API 🎞️
https://movie-api-lina-834bc70d6952.herokuapp.com/
