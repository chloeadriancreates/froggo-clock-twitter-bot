# Froggo'clock Twitter bot - V3

Hello! I am on a bot-making kick! This one tweets a frog picture from [Unsplash](https://unsplash.com/) every four hours, because many of my friends love frogs and I wanted to spread a little joy. The account is [@froggoclock](https://twitter.com/froggoclock), if you want to give it a look! 

## Now, for the tech stack! 
This version of the bot was made using Javascript, the twitter-api-v2, node-fetch and cron packages, and Firebase. 
You can find the previous version on the v1 branch – the core is the same, but I switched from using Heroku Scheduler to another hosting service and the cron package. 

### Unsplash
I used node-fetch to be able to fetch from the Unsplash API from node itself. Once I got the url for a random frog picture, I used image-downloader to download the image, to then be able to tweet it.

### Firebase
I used a Realtime Database, because I only needed a small place to store the IDs of the photos that have already been tweeted. Since tweets made through a program have to be unique, the bot stores the already tweeted IDs and generates a new frog if its ID is in the list.

I really love making these bots, and even though having to switch from Heroku (who are sadly cancelling their free plan from November onwards) was a bummer, I really think the code for this version is cleaner, and I'm ultimately very happy about it. I think next on my list is learning how to make a Discord bot – it will probably take me a little while to figure out, but stay tuned!

Thanks for reading, and happy coding! I hope you have a great day.
Chloé x