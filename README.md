# Fin

## Links

-   Front-end Repo: https://github.com/ND56/Fin_Client
-   Deployed Front-end: https://nd56.github.io/Fin_Client/

-   Back-end Repo: https://github.com/ND56/Fin_API
-   Deployed Back-end: https://fin-api.herokuapp.com/

## Overview

Fin is a conversational companion and personal assistant built using Google's natural language processing platform, Dialogflow, as well as an assortment of other technologies. Users are prompted to create a profile upon logging in, after which they are free to engage with Fin and edit or delete their profile as they see fit.

Interactions with Fin are processed through the use of web sockets and each client interaction is siloed from others, which is achieved through a combination of (1) having each client generate a unique Dialogflow session and (2) having the Fin API socket only broadcast Fin's responses to the client that prompted the response.

## Functionality

In it's current iteration, users can prompt Fin to do the following:

1. Tell jokes
2. Muse on the meaning of life
3. Engage in simple conversation
4. Provide a random fact
5. Send text messages
6. Report on the weather
7. Search the web
8. Provide playlist recommendations

## Technologies & Platforms

### Front-End

1. HTML/CSS/Bootstrap
2. JavaScript/jQuery/AJAX
3. Web Sockets - Socket.io
4. Google Custom Search Engine ('CSE') API

### Back-End

1. Node.js
2. Express
3. Mongoose
4. MongoDB
5. Web Sockets - Socket.io
6. Dialogflow API
7. World Weather Online API (via Web Hook)
8. Twilio (via Web Hook)
9. Spotify API

### Example Input/Output Path: Query for Weather

![alt text](https://imgur.com/4l2cVDO.jpg)

### API Routes

| Verb   | URI Pattern            | Controller#Action       |
|--------|------------------------|-------------------------|
| POST   | `/sign-up`             | `users#signup`          |
| POST   | `/sign-in`             | `users#signin`          |
| PATCH  | `/change-password/:id` | `users#changepw`        |
| GET    | `/users/:id`           | `users#show`            |
| GET    | `/users`               | `users#index`           |
| DELETE | `/sign-out/:id`        | `users#signout`         |
| GET    | `/profiles`            | `profiles#index`        |
| GET    | `/profiles/:id`        | `profiles#show`         |
| POST   | `/profiles`            | `profiles#create`       |
| PATCH  | `/profiles/:id`        | `profiles#update`       |
| DELETE | `/profiles/:id`        | `profiles#destroy`      |

**Users may only view/edit/destroy their own profiles*

## Improvements Anticipated in Future Iterations

The following are improvements that I hope to continue working on:

1. Broaden Fin's practical skill set
2. Implement a method for user's to request specific functionality or to report intent mis-matches.
3. Allow for vocal input/output
4. UI improvements
5. Improve Fin's conversational abilities and overall functionality

-   *This last one is both important and tricky. Fin operates in large part by matching user queries to pre-programmed user "intents." It's difficult to keep these intents separated because---due to the machine learning algorithms that power Dialogflow---Fin will often unpredictably place undue emphasis on key words in a user's query, which causes Fin to accidentally prioritize a mis-matched intent. I continue to test and re-test Fin's intents, but have not yet had the capacity to put Fin through the rigorous trials a production-ready AI would no doubt be subjected to. For now, bear with him! Every interaction helps to improve his functionality.*

## Planning

#### ERD

![alt text](https://imgur.com/eyt2Lng.jpg)

### User Stories

#### First Iteration

1. As a user, I want to be able to sign up to use this app.
2. As a user, I want to be able to sign in to use this app.
3. As a user, I will want to be able to change my password that I use for signing in to this app.
4. As a user, I want to be able to create a profile that will provide Fin with useful information about me.
5. As a user, I want to be able to have a username as part of my profile. (I will use this to speak with Fin)
6. As a user, I want to be able to have my telephone number saved as part of my profile. (In future iterations, this will allow Fin to set reminders for me)
7. As a user, I will want to be able to edit and delete my profile.
8. As a user, I want to be able to chat with Fin.
9. As a user, I want this experience to feel like I'm speaking with a human.

#### Future Iteratons: Epic User Story

10. As a user, I want Fin to be able to perform a wide variety of helpful functionality through the use of third-party API calls.

### Fin's First Words

![alt text](https://imgur.com/w8B4TaY.jpg)

### Planned Schedule For First Iteration (Established during early planning stages)

#### Friday, April 13, 2018
1. Wireframe
2. User Stories
3. ERD
4. Build resource (user profile) into database
5. curl CRUD all user and profile actions

#### Saturday, April 14, 2018
6. Build basic UI
7. CRUD user resource through UI
8. CRUD profile resource through UI

#### Sunday, April 15, 2018
9. Build out UI for chat
10. Implement chat functionality
11. Tailor API socket broadcast to only the emitting client
12. Implement unique session ID for each client interaction with Fin

#### Monday-Thursday, April 16-19, 2018
12. Improve AI generally (conversational skills, etc.)
13. Implement practical AI functionality
-   Weather API
-   Twilio API
-   Google API
-   Spotify API
14. Style
15. ReadME
16. Debug/Test
