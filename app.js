var TwitterPackage = require('twitter');

var Twitter = new TwitterPackage(secret);
var unirest = require('unirest');

var positiveResponses = ["I think everything is going to be okay", "You have some really good ideas", "That's nice, keep on truckin!"]

var neutralResponses = ["I really don't know", "You should look up Robert Crumb", "Whatever","You can't be late until you show up.", "The secret to creativity is knowing how to hide your sources", "It isn't homework unless it's due tomorrow.","It may look like I'm doing nothing, but I'm actively waiting for my problems to go away.", "Anyone who uses the phrase 'easy as taking candy from a baby' has never tried taking candy from a baby.", "I steal children's candy","Every rule has an exception. Especially this one.", "If you're gonna go, go obnoxiously.", "Delusions are often functional. A mother's opinions about her children's beauty, intelligence, goodness, et cetera ad nauseam, keep her from drowning them at birth.","Nothing needs reforming as much as other people's habits", "The avoidance of taxes is the only intellectual pursuit that carries any reward.","It's your god. They're your rules. *You* go to hell."]

var negativeResponses = ["Never ask me that again", "#trump", "Go away", "Is your ass jealous of the amount of shit that just came out of your mouth?", "I'm not saying I hate you, but I would unplug your life support to charge my phone.", "Roses are red, violets are blue, I have 5 fingers, the 3rd ones for you.", "Your birth certificate is an apology letter from the condom factory.", "If you are going to be two faced, at least make one of them pretty.", "You're so ugly, when your mom dropped you off at school she got a fine for littering.", "You must have been born on a highway because that's where most accidents happen.", "I wasn't born with enough middle fingers to let you know how I feel about you.", "I bet your brain feels as good as new, seeing that you never use it.","What’s the difference between you and eggs? Eggs get laid and you don't.", "I’m jealous of all the people that haven't met you!", "You bring everyone a lot of joy, when you leave the room."]

console.log(neutralResponses.length)

var selectResponse = function (array){
  var index = Math.floor(Math.random() * (array.length));
  return array[index];
};









Twitter.stream('statuses/filter', {track: '#AskKarnakCracker'}, function(stream) {
  stream.on('data', function(tweet) {


    var textToSend = "text="+tweet.text
    var targetUser = tweet.user.screen_name
    var response = ""
    var sentimentScore = 0

    unirest.post("https://twinword-sentiment-analysis.p.mashape.com/analyze/")
    .header("X-Mashape-Key", "c5XDKl2QXnmshXTO9rNaDExsnaNZp1s8jpbjsncvCMabLZNUIh")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .header("Accept", "application/json")
    .send(textToSend)
    .end(function (result) {
      sentimentScore = result.body.score
      console.log(result.headers)
    });

    switch (true){
        case (sentimentScore >= .5):
          response = selectResponse(positiveResponses)
            break;
        case (sentimentScore <= -.5):
            response = selectResponse(negativeResponses)
            break;
        default:
            response = selectResponse(neutralResponses);
    }


    var totalResponse = "@" + targetUser + ": " + response
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


