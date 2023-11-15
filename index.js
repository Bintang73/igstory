const fetch = require('node-fetch');
const fs = require('fs');
const colors = require("colors");
const readline = require("readline-sync");
const InstagramScraper = require('./lib/ig');
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const instagramScraper = new InstagramScraper(config["X-Ig-App-Id"], config["ds_user_id"], config["sessionid"]);

(async () => {
    const date = () => new Date().toLocaleTimeString({
        timeZone: "Asia/Jakarta",
    });

    const namaig = readline.question("[+] Instagram Username: ");

    const userID = await instagramScraper.getUserID(namaig);

    if (userID !== 0) {
        try {
            const elements = [];
            const storyJson = await instagramScraper.getStory(userID);

            if (storyJson.reels_media[0]?.items) {
                storyJson.reels_media[0].items.forEach(item => {
                    delete item.url;
                    delete item.video_dash_manifest;
                    if (item.video_versions) {
                        elements.push({
                            type: 'video',
                            data: item.video_versions[0]
                        });
                    } else {
                        elements.push({
                            type: 'image',
                            data: item.image_versions2.candidates[0]
                        });
                    }
                });
            }
            if (elements.length > 0) {
                try {
                    const foldername = './temp/story/' + namaig
                    if (!fs.existsSync(foldername)) {
                        fs.mkdirSync(foldername, { recursive: true });
                    }
                    console.log(`[+] [${date()}] ${colors.yellow(`Start Downloading story from ${namaig}...`)}`);
                    let i = 0;
                    for (let x of elements) {
                        const currentTime = new Date();
                        const datenow = currentTime.toLocaleDateString().replace(/\//g, '-');
                        const time = `${currentTime.getHours()}-${currentTime.getMinutes()}-${currentTime.getSeconds()}-${currentTime.getMilliseconds()}`;
                        const rnd = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
                        const filePath = `./${foldername}/${datenow}-${time}-${rnd}`;

                        if (x.type === 'video') {
                            fetch(x.data.url)
                                .then(response => response.buffer())
                                .then(buffer => {
                                    i++
                                    console.log(`[+] [${date()}] ${colors.green(`Downloading story ${colors.yellow('video')} from ${colors.cyan(namaig)} ${i} of ${elements.length}`)}`);
                                    fs.writeFileSync(`${filePath}.mp4`, buffer);
                                })
                                .catch(error => {
                                    console.log(`[+] [${date()}] ${colors.red(`Error fetching video content: ${error}`)}`);
                                });
                        } else {
                            fetch(x.data.url)
                                .then(response => response.buffer())
                                .then(buffer => {
                                    i++
                                    console.log(`[+] [${date()}] ${colors.green(`Downloading story ${colors.yellow('image')} from ${colors.cyan(namaig)} ${i} of ${elements.length}`)}`);
                                    fs.writeFileSync(`${filePath}.jpg`, buffer);
                                })
                                .catch(error => {
                                    console.log(`[+] [${date()}] ${colors.red(`Error fetching video content: ${error}`)}`);
                                });
                        }
                    }
                } catch (err) {
                    console.log(`[+] [${date()}] ${colors.red(`Error creating/checking folder: ${err}`)}`);
                }

            } else {
                console.log(`[+] [${date()}] ${colors.red(`Username of ${colors.yellow(namaig)} its not found or not have story or account its private.`)}`);
            }
        } catch (e) {
            console.log(`[+] [${date()}] ${colors.red(`Cookie its not valid, please check again your config.json file.`)}`);
        }
    }
})()