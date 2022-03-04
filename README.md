# Google Authentication
An app to authenticate users using their Google account and save information on SQlite using Prisma ORM

## NGrok Settings
* For your app to receive the token back from Google after the authentication you will need a valid URL. I recommend using NGrok https://ngrok.com/.
* Just download it and execute it like this on your terminal
  * On Mac, you would execute the following command to run ngrok on your port 4000: 
  ```
    ./ngrok http 4000
  ```
* Copy the HTTPS url generated and replace the existing ngrok URL in your .env file under GOOGLE_REDIRECT_URI, but leave the /google/callback


## Google Settings
* Login into https://console.developers.google.com/
* Create a new Project
* Click on "Configure Consent Screen" and select "External"
* For this example fill out the form with any fake data.
* In the Authorized Domains field, add your NGrok URL
* On the next screen where you should inform the scopes, on non-sensitive scopes add:
  * /auth/userinfo.email
  * ./auth/userinfo.profile
  * openid
  * any other scope you need
* Open the Credentials menu
* Click on "CREATE CREDENTIALS" and select "OAuth Client ID"
* Select "Web application" as the "Application Type"
* Give it any name
* On Authorized redirect URIs add your your ngrok callback from .env
* On you save you will see on the screen a client_id and secret. Copy them to their respective keys in the .env file

## Installation
```
yarn
```

# Prisma Configuration
The file data/prisma/schema.prisma is the place where you should define your all your table schemas


# Create your tables using Prisma
Before running your app execute the following terminal command to generate your tables on SQLite. 
```
yarn prisma migrate dev
```

This should be done regardless of the DB you are using.

# Running the Application
```
yarn dev
```

# Routes

* http://localhost:4000/google/signin -> Route to signin using your Google account
* http://localhost:4000/google/callback -> Route that will receive Google's request with a code query parameter
* http://localhost:4000/google/user -> Route that expects the user email and returns it's data
