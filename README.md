# COVinfo ![Build](https://github.com/ngregrichardson/COVinfo/workflows/Build/badge.svg)

Your own personal COVID-19 dashboard.

## Inspiration
In times like these, information is everywhere. This makes it easily accessible for most people around the world, as everything you need is a Google search away. However, this makes the spread of misinformation just as easy. COVinfo aims to bring up-to-date COVID-19 information to your fingertips, all in one place.

## What it does
COVinfo has six main pages. The News page has two sections: global news and local news. Global news gets the most recent COVID-19 news on a global scale, while local news shows you the most relevant news from your country (or the US, if you're not signed in). The Map page visualizes COVID-19's impact across the globe, updating daily so you can see the most recent impact across the world. In the Quarantine Chat, you can connect with people around the world and discuss anything from fun time-killing activities to just chatting about quarantine life. To make sure everyone stays healthy, the Hand Washing Music page allows users to submit songs with a starting timestamp that have a good 20 second span, perfect for washing your hands correctly. Finally, to raise the spirits of everyone trapped inside, and especially those who work non-essential jobs, the Meme page is available to give a humorous spin on this dim situation.

## What it's made of
The front-end of COVinfo is built with vanilla React.js and Bootstrap for UI design. We used Firebase for the authentication and database, with an Express server and sockets to send live messages to everyone in the Quarantine chat.

## What's next for COVinfo
- [ ] `About COVID-19` page
- [ ] `How To Help` page
- [ ] Add full testing with Jest
