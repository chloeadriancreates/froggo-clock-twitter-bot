import { rwClient } from './twitterClient.js';
import { firebaseConfig } from './config.js';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, push, update } from "firebase/database";

const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase());

const tweet = async (quotes, arrayLength, type) => {
    const random = Math.floor(Math.random() * arrayLength);
    const keyRandom = Object.keys(quotes)[random];
    console.log(quotes);
    console.log(quotes[keyRandom]);
    try {
        await rwClient.v2.tweet(quotes[keyRandom]);
        const newKey = push(child(dbRef, `reminders/tweeted/${type}`)).key;
        const updates = {};
        updates[`reminders/tweeted/${type}/${newKey}`] = quotes[keyRandom];
        updates[`reminders/not_tweeted/${type}/${keyRandom}`] = null;
        update(dbRef, updates);
    } catch(e) {
        console.error(e);
    }
}

function start() {
    get(child(dbRef, 'id_type')).then((snapshot) => {
        const idType = snapshot.val();
        console.log(idType);
        get(child(dbRef, 'counter')).then((snapshot) => {
            const currentCounter = snapshot.val();
            if(currentCounter == 2) {
                get(child(dbRef, 'reminders/not_tweeted')).then((snapshot) => {
                    const types = Object.keys(snapshot.val());
                    const type = types[idType];
                    console.log(type);
                    get(child(dbRef, `reminders/not_tweeted/${type}`)).then((snapshot) => {
                        if(snapshot.val()) {
                            const length = Object.keys(snapshot.val()).length;
                            tweet(snapshot.val(), length, type);
                            console.log(snapshot.val());
                        }
                        const updates = {};
                        const newCounter = 0;
                        let newIdType;
                        if(idType == types.length - 1) {
                            newIdType = 0;
                        } else {
                            newIdType = idType + 1;
                        }
                        updates['counter'] = newCounter;
                        updates['id_type'] = newIdType;
                        update(dbRef, updates);
                    }).catch((error) => {
                        console.error(error);
                    });
                })
            } else {
                const updates = {};
                const newCounter = snapshot.val() + 1;
                updates['counter'] = newCounter;
                update(dbRef, updates);
            }
        });
    });
}

start();
