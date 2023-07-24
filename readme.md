# Discord Radio Bot
This is a discord bot that plays music on your channel and uses LLM to generate radio-like introductions before each song. Currently only polish language is supported for this funcitionality, but you can easily use this bot witout it, just like any other music bot.

## Commands
Discord Radio Bot implements following commands:

1. `/add` - Adds a song to queue and starts playing if it's the first song.
2. `/gpt-url` (admin only) - Sets the addres of your language model to send requests to.
3. `/gtts` - Converts text to speech, adds it to queue and starts reading it if nothing is currently playing. Right now only polish language is supported.
4. `/lyrics` - Displays lyrics of currently playing song.
5. `/queue` - Displays all tracks that are in queue.
6. `/quit` - Stops playing, clears queue and leaves the channel.
7. `/set-stream-volume` - Sets volume of streamed songs.
8. `/set-tts-volume`  - Sets volume of tts tracks and song introductions.
9. `/skip` - Skips currently plaing song.

## Setup
### Basic setup
1. Clone this repository.
2. Use this command to install all the required dependencies: 
```
npm install
```
3. Create your discord application on [this page](https://discord.com/developers/applications)
4. Create a `.env` file in the root directory of this project and set these variables accordingly:
```
TOKEN=
CLIENT_ID=
```
You can get your `TOKEN` in the `Bot` tab in your application and `CLIENT_ID` in `OAuth2` tab.

5. Register your bot's slash commands using:
```
npm run deploy
```

6. You can then start your bot using:
```
npm start
```

### AI-generated introductions
To generate introductions you need to take a few extra steps. If you have a reeeeally powerful PC (~10 GB of VRAM) you can host it locally, but I recommend using [Google Colab](https://colab.research.google.com), as it's free tier is just enough for the model that I used.

1. Go to [Google Colab](https://colab.research.google.com) and upload the [vicunaServer.ipnyb](vicunaServer.ipynb) file.
2. Go to [ngrok](https://dashboard.ngrok.com/get-started/your-authtoken), generate your token and set `NGROK_AUTH_TOKEN=` variable in section 4 on google colab.
3. On Google Colab in environment settings change the accelerator to GPU.
4. Run all cells on Google Colab (this takes a few minutes).
5. If all goes well you should get a message like:
```
* Running on http://xxx.ngrok-free.app
```
where `xxx` is some random part. Copy this url without `"http://"` and paste it in `/gpt-url` command in the running bot. And that's it! The bot will now generate an introduction after you add a song to queue. This takes a few seconds so don't use `/skip` right away.

### Last.fm API
If you've already tested the bot, you probably noticed that these introductions can be really random. The easiest way to improve them is to give the AI some more data to work with. I've implemented fetching the data from [Last.fm](last.fm) database that features info about artists and songs.

If you want to use this functionality, the only thing you need to do is to get the API key from [here](https://www.last.fm/api/account/create), create a variable in `.env` file called `LASTFM_KEY=` and paste the generated key. And that's it!

## Additional info
Keep in mind that Google Colab shuts down unused environments, so you need to keep your tab open while using the bot and after you're done remove the environment yourself, because Google can supposedly suspend your Colab account for some time if you've used a lot of resources for longer periods of time.

## Final thoughts
This project is mostly a `proof of concept`, as it could be vastly improved by having more resources to work with. The main thing to change would be to use a larger language model, preferably tuned with data about artists and their work. The other thing to change would be the TextToSpeech. I've used Google's TTS as it was the only free one with any polish language support.

## License
Discord Radio Bot is released under the [MIT License](LICENSE.txt).

## Disclaimer
I am not liable for any direct, indirect, consequential, incidental, or special damages arising out of or in any way connected with the use/misuse or inability to use this software.