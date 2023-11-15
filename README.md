# igstory
Download public and private ig stories anonymously

## INSTALL FOR TERMUX/UBUNTU/SSH USER

```bash
apt update && apt upgrade
apt install git -y
apt install nodejs -y
git clone https://github.com/Bintang73/igstory
cd igstoy
npm install
npm start
```

## INSTALL FOR WINDOWS/VPS/RDP USER

* Download And Install Git [`Click Here`](https://git-scm.com/downloads)
* Download And Install NodeJS [`Click Here`](https://nodejs.org/en/download)
  
```bash
git clone https://github.com/Bintang73/igstory
cd igstory
npm install
npm start
```

---------

## HOW TO GET COOKIE AND SET TO CONIG.JSON?
* Go to Instagram website (login via pc) [`Click Here`](https://instagram.com)
* Login with your account instagram
* Right click on the mouse and select inspect like image bellow
  ![3](https://github.com/Bintang73/igstory/assets/42708989/100550ac-26c8-467d-bcab-fbcfd03a2a91)

* Refresh the browser
* Search for "graphql" in the search field below
  ![4](https://github.com/Bintang73/igstory/assets/42708989/71135258-65cc-4dd0-850a-1426ee087631)
* Click on the one "graphql"
* Scroll down and find the "X-Ig-App-Id", copy the value and paste on config.json file
  ![5](https://github.com/Bintang73/igstory/assets/42708989/1b95367d-36c1-48d7-b82a-a785428e5a2d)
* Scroll up until cookie form, find the "ds_user_id" and "sessionid" copy value between "=" and ";" and paste on config.json file
  ![6](https://github.com/Bintang73/igstory/assets/42708989/aaf4ceb0-ed8c-4ebc-9dcc-0fccca90ba9d)
* Save file config.json
* And run the file "npm start"

