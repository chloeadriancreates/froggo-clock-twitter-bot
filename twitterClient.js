import { twitterConfig } from './config.js';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
    appKey: twitterConfig.APP_KEY,
    appSecret: twitterConfig.APP_SECRET,
    accessToken: twitterConfig.ACCESS_TOKEN,
    accessSecret: twitterConfig.ACCESS_SECRET
});

export const rwClient = client.readWrite;