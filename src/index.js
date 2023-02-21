const getContext = require('./getContext.js') ;
const fetch = require('node-fetch');

const ftrends = document.getElementById('ftrends');
const fknow = document.getElementById('fknow');

const search = document.getElementById('input-search');
const submit = document.getElementById('btn-search');
const apiSet = document.getElementById('btn-set');
const keyInput = document.getElementById('input-api');
let OPEN_AI_KEY = ''

const loader = document.createElement('div');
loader.setAttribute('class',"lds-dual-ring");

// get query location on click
submit.addEventListener('click', async (e) => {
  e.preventDefault();
  if(OPEN_AI_KEY) {
    const location = search.value;
    console.log(location);
    ftrends.innerHTML = "";
    await setTrend(location);
  } else {
    alert("Please Enter API Key")
  }
  
})

apiSet.addEventListener('click', (e) => {
  e.preventDefault();
  OPEN_AI_KEY = keyInput.value;
  alert("API Key Set!")
})


// function that gets the context behind selected trend
// implemented for each button
async function setInfo(trend, key) {
  const context = await getContext(trend, key);
  fknow.innerHTML = "";
  fknow.textContent = context;
}

// gets the trends based on location parameter and makes call to backend to get trends
// sets up to 5 trends in the trends location of the webpage
async function setTrend(location) {
  const res = await fetch(`https://twitter-context.onrender.com/trends/${location}`);
  console.log(res);
  const trends = await res.json();
  if(trends.length > 0) {
    for (let index = 0; index < 6; index++) {
      const trend = trends[index];
      console.log(trend)
      const temp = document.createElement('button');
      temp.textContent = trend.name;
      temp.addEventListener('click', ()=> {
         if(OPEN_AI_KEY) {
          fknow.innerHTML = "";
          fknow.append(loader);
          setInfo(temp.textContent, OPEN_AI_KEY);
         } else {
          alert("Please Enter OpenAI API Key!")
         }
         
         
        }
      )
      ftrends.append(temp);
    }
  } else {
    alert(`Invalid location: ${location}`);
    setTrend("london");
  }
  
}


