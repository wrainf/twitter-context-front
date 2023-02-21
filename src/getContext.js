const{ Configuration, OpenAIApi } = require("openai");

async function getTweets(query) {
  if(query.includes("#")) {
    query = query.replace('#', '')
  }
  console.log(query)
  const res = await fetch(`https://twitter-context.onrender.com/tweets/${query}`);
  const resJson = await res.json()

  const popTweets = resJson.popular;
  const recTweets = resJson.recent;
  
  let tweets;
  for (let index = 0; index < popTweets.length; index++) {
    const tweet = popTweets[index];
    tweets += tweet.text
  }
  for (let index = 0; index < recTweets.length; index++) {
    const tweet = recTweets[index];
    tweets += tweet.text
    
  }
  return tweets;
}

// returns the context for a queried trend
module.exports = async function getContext(trend, apikey) {
  try {

    const configuration = new Configuration({
      apiKey: apikey,
    });
    const openai = new OpenAIApi(configuration);
    const tweets = await getTweets(trend);
  
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Give context based on these tweets: ${tweets}:`,
      temperature: 0.3,
      max_tokens: 800,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    const context = response.data.choices[0].text;
    console.log(context)
    return context;
  } catch(e) {
    console.log(e)
    alert("Error! Try another key or wait a few minutes.")
    return ""
  }
  
}
