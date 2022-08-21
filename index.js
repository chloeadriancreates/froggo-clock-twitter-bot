import { rwClient } from './twitterClient.js';
import { firebaseConfig } from './config.js';
import { unsplashConfig } from './config.js';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, push, update } from "firebase/database";
import fetch from "node-fetch";
import download from 'image-downloader';

const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase());

async function getPhotoFromID(id) {
    const response = await fetch(`https://api.unsplash.com/photos/${id}/?client_id=${unsplashConfig.ACCESS_KEY}`);
    const responseJSON = await response.json();
    return responseJSON;
}

async function getRandomFrogID() {
    const response = await fetch(`https://api.unsplash.com/photos/random/?client_id=${unsplashConfig.ACCESS_KEY}&query=frog`);
    const responseJSON = await response.json();
    return await responseJSON.id;
}

async function getTweetedIDs() {
    const response = await get(child(dbRef, 'tweeted'));
    const tweeted = await response.val();
    const tweetedIDs = Object.keys(tweeted).map((key) => {
        return tweeted[key];
    });
    return tweetedIDs;
}

async function getUniqueFrog() {
    let randomFrogID = await getRandomFrogID();
    const tweetedIDs = await getTweetedIDs();
    while(tweetedIDs.includes(randomFrogID)) {
        randomFrogID = await getRandomFrogID();
    }
    const randomFrogPhoto = await getPhotoFromID(randomFrogID);
    return randomFrogPhoto;
}

async function tweet() {
    try {
        const frog = await getUniqueFrog();
        const { id } = frog;
        const url = frog.urls.full;
        const displayUrl = frog.links.html;
        const username = frog.user.name;
        const twitterUsername = frog.user.twitter_username;
        let tweetText = "" 
        if (twitterUsername) {
            tweetText = `Frog by ${username} (@${twitterUsername})`;
        } else {
            tweetText = `Frog by ${username}`;
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
        const newKey = push(child(dbRef, `tweeted/`)).key;
        const updates = {};
        updates[`tweeted/${newKey}`] = id;
        update(dbRef, updates);
    } catch(e) {
        console.error(e);
    }
}

function updateCounter(value) {
    const updates = {};
    const newCounter = value;
    updates['counter'] = newCounter;
    update(dbRef, updates);
}

async function start() {
    const response = await get(child(dbRef, 'counter'));
    const currentCounter = await response.val();
    if(currentCounter == 1) {
        tweet();
        updateCounter(0);
    } else {
        updateCounter(currentCounter + 1);
    }
}

start();