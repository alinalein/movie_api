## Movie_API 🎬🍿
The API serves as the back end for [React](https://github.com/alinalein/myFlix-Angular-client) and [Angular](https://github.com/alinalein/myFlix-Angular-client) frontends, providing users access to details about various movies, directors, and genres. Users can sign up, update their personal information, delete their profile, and create a list of favorite movies.

## Technology Stack 🛠️
- **Node.js** : Runtime for server-side JavaScript, designed for scalability  
- **Express.js** : Web framework for Node.js, streamlining web app development  
- **MongoDB** : NoSQL database, flexible and scalable with JSON-like documents  
- **MongoDB Atlas** : Cloud-hosted NoSQL database with managed operations, backups, and automatic scaling 
- **Mongoose** : MongoDB and Node.js ODM, simplifying data modeling  
- **JWT (JSON Web Token)** : Compact, secure token for representing claims between parties  
- **Postman** : API development platform, streamlining testing and debugging
- **Render** : Cloud platform for deploying and managing applications  

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
### Run the server in dev mode with nodemon
```
npm run dev
```

## API Endpoints 🔍
[Documentation for the API](https://movie-api-92eb.onrender.com/documentation.html)

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
- `/users/[Username]/movies/remove/[MovieID]` : Allow users to remove a movie from their list of favorites
- `/users/deregister/[Username]` : Allow existing users to deregister
- `/users/login` : Allows the user to log in to their profile
 
## Test your API ⚙️
Postman was used for testing. To test your API, please open the postman-tests folder in the project and import the file into your Postman client. 

## Deploy your application to Google Cloud
1. Make sure the Google Cloud SDK is installed
Download & install: [Google SKD](https://cloud.google.com/sdk/docs/install)
Then log in
```bash
gcloud auth login
```

2. Set your Google Cloud project
 <br/>
Replace <PROJECT_ID> with your own project ID:

```bash
gcloud config set project <PROJECT_ID>
```

3. Build your Docker image
 <br/>

**REGION** → e.g. europe-north1<br/>
**PROJECT_ID** → your GCP project<br/>
**REPO_NAME** → your Artifact Registry repo<br/>
**IMAGE_NAME** → name for your container image<br/>

From the root of your project:
```bash
docker build -t <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPO_NAME>/<IMAGE_NAME>:latest -f Dockerfile .
```

4. Push the image to Artifact Registry
```bash
docker push <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPO_NAME>/<IMAGE_NAME>:latest
```
5. Deploy to Cloud Run
<br/>

**SERVICE_NAME** → the name of your Cloud Run service<br/>

```bash
gcloud run deploy <SERVICE_NAME> \
  --image <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPO_NAME>/<IMAGE_NAME>:latest \
  --region <REGION> \
  --platform managed \
  --allow-unauthenticated
```
6. After deployment, Google Cloud will give you a public URL for your API.

## Deploy your application to Render
1. Push your code to GitHub (make sure you have a `package.json` and valid code)
2. Go to [render.com](https://render.com) and sign up with GitHub
3. Click **"New"** → **"Web Service"**
4. Connect your GitHub repository 
5. Configure:
   - **Language:** Node
   - **Build Command:**    

   ```bash
   npm install
   ```

   - **Start Command:**

   ```bash
   node src/app.js
   ```

   - **Environment Variables:** Add `CONNECTION_URI` with your MongoDB Atlas connection string
6. Click **"Create Web Service"**
7. Render automatically deploys on every `git push` to main

Your API will be live at: `https://movie-api-XXXX.onrender.com`

   
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
[https://movie-api-92eb.onrender.com](https://movie-api-92eb.onrender.com)
