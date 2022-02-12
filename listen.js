const client = require("./client");
const handler = require("./handler");

const parameters = {
  track: '#radioheadbot,@bot4radiohead,#bot4radiohead,#Radioheadbot'
}

module.exports.stream = async () =>
  client
    .stream('statuses/filter', parameters)
    .on('start', (response) => {
      console.log('start response', response)
    })
    .on('data', ({ text, user, id_str, retweeted, is_quote_status }) => {
      console.log(
        'origin tweet text:',
        text,
        '\n',
        'origin userName:',
        user.name,
        '\n',
        'origin decription:',
        user.description,
        '\n',
        id_str,
        '\n',
        'retweeted:',
        retweeted,
        '\n',
        'quote:',
        is_quote_status
      )
      if (retweeted || is_quote_status || text.startsWith('RT')) return
      // const thomYorkeParams = {
      //   limit: 20,
      //   artist: 'thomyorke',
      //   copyright: '\n\n \u00A9 @thomyorke',
      //   artistId: '4CvTDPKA6W06DRfBnZKrau',
      //   tweetId: id_str
      // }
      const radioheadParams = {
        artist: 'radiohead',
        artistId: '4Z8W4fKeB5YxbusRsdQVPb',
        limit: 38,
        copyright: '\n\n \u00A9 @Radiohead',
        tweetId: id_str
      }

      handler.bot(radioheadParams)
    })
    .on('error', (error) => console.log('error', error))
    .on('end', (response) => console.log('end', response))
