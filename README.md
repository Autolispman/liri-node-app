# liri-node-app
Run all commands from a terminal

1. Retrieve last 20 tweets in a twitter account.
   Example sytax:
     node liri my-tweets

2. Retrieve the following information from a song
    * Artist(s)     
    * The song's name     
    * A preview link of the song from Spotify     
    * The album that the song is from
    * If no song is provided the default is "The Sign" by Ace of Base.
   Example syntax:
     node spotify-this-song Ring of Fire

3. Retrieve information about a movie.
    * Title of the movie.
    * Year the movie came out.
    * IMDB Rating of the movie.
    * Rotten Tomatoes Rating of the movie.
    * Country where the movie was produced.
    * Language of the movie.
    * Plot of the movie.
    * Actors in the movie.
    * if no movie is specified the default is Mr. Nobody
   Example syntax:
     node liri movie-this Frozen

4. This last command reads the "random.txt" file to execute the commands with in the file.
   Each line in the file is treated as a command and an argument for the command seperated
   by a comma (,);
   Execute with this syntax:
     node liri do-what-it-says

5. All commands are logged to the file log.txt. If the file does not exist it will be created.
