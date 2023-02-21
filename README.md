( ᵔ ᴥ ᵔ )

# README

[Twitter Bot](https://twitter.com/r_adiohead_b)

## What is this?

- This is an experimental project to try and create a simply reply twitter bot. It is using [Lyrics AZ](https://www.azlyrics.com/) scraper script to get the lyrics of song for a specific artist and populate XATA DB with the lyrics, essentially create a discography with lyrics for an artist. Then it will use the XATA DB to generate a reply to a tweet that contains the artist name and song name.

- It also listens to twitter stream and likes/replies to tweets. More info in `src/listen.js` file.

- It posts a random åsong lyrics every hour. `src/sendTweet.js` file.

- I am running this bot locally on my Raspberry PI and it is not hosted anywhere.

- Only valuable piece of code is the scraper script that I wrote to scrape the lyrics from the website. It lives in `src/scrapeLyrics.js` file. Although it is not perfect, it works for the purpose of this project and alos AZ Lyrics constantly changes their website so it is not worth spending time on making it perfect.

- You can use `src/build.js` to build the XATA DB for discography for pretty much any artist from scratch. It will take a while to build the DB. You will need to have a `spotifyArtistId` for the artist. You also will need to setup Xata DB and have appropriate schema. You can fine more info in `src/xata.js` file.

- In case if you have any questions and would like to give it a try, feel free to reach out to me on [Twitter](https://twitter.com/metelskyi_a) or [Telegram](https://t.me/metelskyi_a)


