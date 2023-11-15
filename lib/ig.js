const fetch = require('node-fetch');

class InstagramScraper {
    constructor(appId, userId, sessionId) {
        this.headers = {
            accept: '*/*',
            'content-type': 'application/x-www-form-urlencoded',
            'sec-fetch-site': 'same-site',
            'x-ig-app-id': appId,
            cookie: `ds_user_id=${userId}; sessionid=${sessionId};`,
        };
        this.instagramApiBaseUrl = 'https://i.instagram.com/api/v1';
    }

    async getUserID(username) {
        try {
            const response = await fetch(this.instagramApiBaseUrl + '/users/web_profile_info/?username=' + username, { headers: this.headers });
            const json = await response.json();
            if (json.status === 'ok') {
                return json.data.user.id;
            } else {
                console.log(`[+] Failed to get User-ID for ${username}`);
                return 0;
            }
        } catch (error) {
            console.log(`[+] Error in loading user-id from ${username}. Maybe the user doesn't exist!`);
            return 0;
        }
    }

    async getStory(userID) {
        try {
            const response = await fetch(`https://www.instagram.com/api/v1/feed/reels_media/?reel_ids=${userID}`, { headers: this.headers });
            return await response.json();
        } catch (error) {
            console.log(`[+] Error in fetching story for user with ID ${userID}`);
            throw error;
        }
    }
}

module.exports = InstagramScraper;