## Movie_API 🎬🍿
The API serves as the back end for [React](https://github.com/alinalein/myFlix-Angular-client) and [Angular](https://github.com/alinalein/myFlix-Angular-client) frontends, providing users access to details about various movies, directors, and genres. Users can sign up, update their personal information, delete their profile, and create a list of favorite movies.

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
npm dev
```

## API Endpoints 🔍
[Documentation for the API](https://movie-api-lina-834bc70d6952.herokuapp.com/documentation.html)

Additional documentation can be found in the 'docs' folder.
**JSDoc :**  Tool for documentaion of JavaScript code. Used to generate API documentation from code comments.

- `/movies` : Return a list of ALL movies
- `/movies/title/[Title]` : Return data about a single movie by title
- `/movies/genre/[Genre]` : Return data about a genre by name
- `/movies/director/[Director]` : Return data about a director by name
- `/users/signup` : Allow new users to signup
- `/users/update/[Username]` : Allow users to update their username
- `/users/[Username]` : Looks up info about a specific user by username
- `/users/[Username]/movies/add/[MovieID]` : Allow users to add a movie from their list of favorites
- `/users/[Username]/movies/remove/[MovieId]` : Allow users to remove a movie from their list of favorites
- `/users/deregister/[Username]` : Allow existing users to deregister
- `/users/login` : Allows the user to log in to their profile
 
## Test your API ⚙️
Postman was used for testing. To test your API, please open the postman-tests folder in the project and import the file into your Postman client. 

## Deploy your application
1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
2. Log in to your Heroku Account. Run in your terminal `heroku login`
3. From the application directory run `heroku create`, to create an empy project in Heroku
4. Commit all your changes to your main repository, run `git commit -m" reason for commit"`
5. Now push your application to the created Heroku folder, run `git push heroku main`
   
 ## User Stories 💃 🕺
 As a user, I want to sign in/sign up to the application so I can save data about my favorite movies.
 
 As a user, I want to access details about movies, directors, and genres so that I will be able to see information about movies I am interessted in. 

<!-- using two spaces at end of each line, forces markdown to start a new line -->
 ## Features ✅
- Provide a list of all movies.  
- Retrieve detailed information about a specific movie, genre, or director.  
- Allow new users to sign up and manage their account info.  
- Enable users to add or remove movies from their favorites.  
- Allow users to delete their account.  
 

## Link to the live API 🎞️
https://movie-api-lina-834bc70d6952.herokuapp.com/
