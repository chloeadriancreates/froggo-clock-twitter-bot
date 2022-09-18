import { rwClient } from './twitterClient.js';
import { firebaseConfig, unsplashConfig } from './config.js';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, push, update } from "firebase/database";
import fetch from "node-fetch";
import download from 'image-downloader';
import { CronJob } from 'cron';

const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase());

async function getPhotoFromID(id) {
    const response = await fetch(`https://api.unsplash.com/photos/${id}/?client_id=${unsplashConfig.ACCESS_KEY}`);
    console.log(response);
    const responseJSON = await response.json();
    return responseJSON;
}

async function getRandomFrogID() {
    const response = await fetch(`https://api.unsplash.com/photos/random/?client_id=${unsplashConfig.ACCESS_KEY}&query=frog`);
    const responseJSON = await response.json();
    return await responseJSON.id;
}

async function getTweetedIDs() {
    const response = await get(child(dbRef, 'frogs/tweeted'));
    const tweetedIDs = await response.val();
    return tweetedIDs;
}

async function getUniqueFrog(tweetedIDs) {
    let randomFrogID = await getRandomFrogID();
    while(tweetedIDs.includes(randomFrogID)) {
        randomFrogID = await getRandomFrogID();
    }
    const randomFrogPhoto = await getPhotoFromID(randomFrogID);
    return randomFrogPhoto;
}

async function startFrogs() {
    try {
        const tweetedIDs = await getTweetedIDs();
        const frog = await getUniqueFrog(tweetedIDs);
        const { id } = frog;
        const url = frog.urls.full;
        const displayUrl = frog.links.html;
        const username = frog.user.name;
        const twitterUsername = frog.user.twitter_username;
        let tweetText = "" 
        if (twitterUsername) {
            tweetText = `Photo by ${username} (@${twitterUsername})`;
        } else {
            tweetText = `Photo by ${username}`;
        }
        const options = {
            url: url,
            dest: `../../img/frog-${id}.jpg`,
        };
        download.image(options).then(image => {
            rwClient.v1.uploadMedia(`./img/frog-${id}.jpg`).then(mediaId => {
                rwClient.v2.tweet({ 
                    text: `${tweetText} 🐸 \n${displayUrl}`, 
                    media: { media_ids: [mediaId] }
                });
            })
        })
        const updates = {};
        updates[`frogs/tweeted`] = [...tweetedIDs, id];
        update(dbRef, updates);
    } catch(e) {
        console.error(e);
    }
}

const job = new CronJob(
	'30 */4 * * *',
	function() {
		startFrogs();
	},
	null,
	true,
	'America/Los_Angeles'
);