# Froggo'clock Twitter bot

Hello! I am on a bot-making kick! This one tweets a frog picture from [Unsplash](https://unsplash.com/) every four hours, because many of my friends love frogs and I wanted to spread a little joy. The account is [@froggoclock](https://twitter.com/froggoclock), if you want to give it a look! 

## Now, for the tech stack! 
This bot was made using Javascript, the twitter-api-v2, image-downloader and node-fetch packages, Firebase and Heroku. 

### Unsplash
I used node-fetch to be able to fetch from the Unsplash API from node itself. Once I got the url for a random frog picture, I used image-downloader to download the image, to then be able to tweet it.

### Firebase
I used a Realtime Database, because I only needed a small place to store the IDs of the photos that have already been tweeted, as well as a counter (you'll see why in the next part). Since tweets made through a program have to be unique, the bot stores the already tweeted IDs and generates a new frog if its ID is in the list.

### Heroku
Like for my previous bot, Heroku Scheduler starts the program every hour, and I added a counter that increments every hour, so it only tweets every four hours!

I, once again, had a lot of fun making this! It was a little different from my previous bots, since I used an external API and also tweeted pictures, so I learned a lot. I think next on my list is learning to make a Discord bot – it will probably take me a little while to figure out, but stay tuned!

Thanks for reading! I hope you have a great day.
Chloé x