var TwitterPackage = require('twitter');




var Twitter = new TwitterPackage(secret);
var unirest = require('unirest');

var positiveResponses = ["I think everything is going to be okay", "You have some really good ideas", "That's nice, keep on truckin!", "Go eat a cookie. You deserve it.", "Decide what it is you want. Write that shit down. Make a fucking plan and work on it every single day.", "You are the world's best juggler, chill out", "Beat your inner-critic with a stale loaf of bread", "You're having a good day! Keep it goin!", "This is a positive quote", "You look great today! I'd marry you in an second!", "You will be the President of the United Plates", "Good thoughts. Nice thoughts.", "Never gonna give you up, Never gonna let you down, Never gonna run around and desert you, Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you", "I am a tweeter bot! Watch me tweet!", "Reduce. Reuse. Recycle. Rhianna.", "All right All right All right"]

var neutralResponses = ["I really don't know", "You can't be late until you show up.", "The secret to creativity is knowing how to hide your sources","It may look like I'm doing nothing, but I'm actively waiting for my problems to go away.", "Anyone who uses the phrase 'easy as taking candy from a baby' has never tried taking candy from a baby.", "I steal children's candy", "Every rule has an exception. Especially this one.", "If you're gonna go, go obnoxiously.", "Nothing needs reforming as much as other people's habits", "The avoidance of taxes is the only intellectual pursuit that carries any reward.", "You can't have everything. Where would you put it?", "If you are afraid of being lonely, don't try to be right.", "You should probably ask for help"]

var negativeResponses = ["Never ask me that again", "#trump", "Go away", "I'm not saying I hate you, but I would unplug your life support to charge my phone.", "Roses are red, violets are blue, I have 5 fingers, the 3rd ones for you.", "If you are going to be two faced, at least make one of them pretty.", "You're so ugly, when your mom dropped you off at school she got a fine for littering.", "You must have been born on a highway because that's where most accidents happen.", "I wasn't born with enough middle fingers to let you know how I feel about you.", "I bet your brain feels as good as new, seeing that you never use it.", "I’m jealous of all the people that haven't met you!", "You bring everyone a lot of joy, when you leave the room.", "You're in trouble"]

var momoResponse = "*momo bellissimo kisses*"

var dukeResponse = "<insert incredulous pun>"

var clapResponse = "*clap* *clap* *clap* *clap* *clap* *clap* *clap* *clap*"

var leonResponse = "Grow a beard and take off your shoes"

var cheerResponses = ["H-O-T!", "Go, Fight, Win", "Holler", "STOMP!"]

var bakerResponses = ["Take a deep breath, becauase shit's about to get fucked", "Believe me, I know how fucked this is", "Break the fuck out", "If you're gunna fuck shit up, do it here where at least I'm here to un-fuck it.", "A man doesn't know his soul until he looks into a unicorn's eyes", "Google it"]


var selectResponse = function (array){
  var index = Math.floor(Math.random() * (array.length));
  return array[index];
};


Twitter.stream('statuses/filter', {track: '#askkarnakcracker'}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text)
    var tweetText = tweet.text.toLowerCase()
    var textToEval = "text="+tweetText
    var targetUser = tweet.user.screen_name
    var response = ""
    var totalResponse = "@" + targetUser + ": "
    var sentimentScore = 0


    switch (true){
      case (tweetText.includes("momo")):
        totalResponse = totalResponse.concat(momoResponse)
          break;
      case (tweetText.includes("#nowaitaskmattbaker")):
        var bakerResponse = selectResponse(bakerResponses)
        totalResponse = totalResponse.concat(bakerResponse)
          break;
      case (tweetText.includes("duke")):
        totalResponse = totalResponse.concat(dukeResponse)
          break;
      case (tweetText.includes("leon")):
        totalResponse = totalResponse.concat(leonResponse)
          break;
      case (tweetText.includes("*clap*")):
        totalResponse = totalResponse.concat(clapResponse)
          break;
      case (tweetText.includes("cheer")):
        var cheerResponse = selectResponse(cheerResponses)
        totalResponse = totalResponse.concat(cheerResponse)
          break;
      default:
        unirest.post("https://twinword-sentiment-analysis.p.mashape.com/analyze/")
          .header("X-Mashape-Key", "c5XDKl2QXnmshXTO9rNaDExsnaNZp1s8jpbjsncvCMabLZNUIh")
          .header("Content-Type", "application/x-www-form-urlencoded")
          .header("Accept", "application/json")
          .send(textToEval)
          .end(function (result) {
            sentimentScore = result.body.score
            console.log(result.headers)
          });

        switch (true){
            case (sentimentScore >= .5):
              sentimentResponse = selectResponse(positiveResponses)
                break;
            case (sentimentScore <= -.5):
                sentimentResponse = selectResponse(negativeResponses)
                break;
            default:
                sentimentResponse = selectResponse(neutralResponses);
          }
        totalResponse = totalResponse.concat(sentimentResponse)
    }


    console.log(totalResponse);


    Twitter.post('statuses/update', {status:totalResponse},  function(error, tweet, response){
      if(error){
        console.log(error);
      }
    });

  });

  stream.on('error', function(error) {
    console.log(error);
  });
});


