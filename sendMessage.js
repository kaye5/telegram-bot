const cron = require('node-cron');
const Telegram = require('./Telegram');
const TeleReq = new Telegram(process.env.TOKEN)
const moment = require('moment-timezone')
const Services = require('./services')
moment.tz.setDefault('Asia/Jakarta')
const axios = require('axios')

var userDB;
const db = require('./db')
Promise.resolve(db.getDB('Telegram')).then((fullfill)=>{
    userDB = fullfill.collection("users")
    reqDB = fullfill.collection("requests")
})
let curTime = moment().add(3,'s').format('s')
/**
 * @description CRON SCHEDULE
 * @description * * * * * *
 * @description s m h d M dow
 */
const CronOption = {
    timezone: "Asia/Jakarta"
}

const unplashAPI = `https://api.unsplash.com/photos/random/?client_id=${process.env.UNPLASH}&count=1&query=nature-green`

async function getQuote(){
    let res = await axios.get('https://quotes.rest/qod?language=en')
    let QOD = res.data.contents.quotes[0];
    return `Good morning, it's ${moment().format('dddd, MMMM Do YYYY, h:mm a')}.\n${QOD.quote}\n-${QOD.author}`
}
async function getImage(){
    let Image = await axios.get(unplashAPI)
    return Image.data[0]
}
async function getWeather(){
    let res = await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/211298?apikey=${process.env.ACCU_WEATHER}&metric=true`)
    let Headline = res.data.Headline;
    let Daily = res.data.DailyForecasts[0]
    return `Whatsup, it's ${moment().format('h:mm a')}.\nToday's Weather ${Headline.Text}\nCategory : ${Headline.Category}.\nTemperature Min : ${Daily.Temperature.Minimum.Value} C.\nMax : ${Daily.Temperature.Maximum.Value} C.\nDay : ${Daily.Day.IconPhrase}\nNight : ${Daily.Night.IconPhrase}`
}
async function getNews(){
    const newsAPI = `https://newsapi.org/v2/top-headlines?country=id&apiKey=${process.env.NEWSAPI}`
    let news = await axios.get(newsAPI);
    let article = news.data.articles[0]
    return {
        image : article.urlToImage,
        text : `${article.title}\n${article.url}`
    }
}
cron.schedule('0 0 7 * * *', async () => {
    let chats = await userDB.find({}) || []
    let quote = await getQuote();
    let img = await getImage()
    chats.forEach(chat => {
        TeleReq.sendMessage(chat._id,quote)        
        TeleReq.sendPhoto(chat._id,{
            img : img.urls.regular,
            desc : img.description
        })
    })
}, CronOption)
cron.schedule('0 0 8,13,17,21 * * *',async () =>{
    let chats = await userDB.find({}) || []
    let weather = await getWeather()
    chats.forEach(chat => {
        TeleReq.sendMessage(chat._id,weather);
    })
},CronOption)

cron.schedule('0 0 9,14 * * *',async () =>{
    let chats = await userDB.find({}) || []
    let news = await getNews()
    chats.forEach(chat => {
        TeleReq.sendMessage(chat._id,news.text);    
    })    
},CronOption)

cron.schedule('0 30 9 * * *',async ()=>{
    let chats = await userDB.find({}) || []
    let link = await Services.webScrapGetImg();
    chats.forEach(chat => {
        TeleReq.sendPhoto(chat._id,{
            img : link,
            caption : ''
        });
    })
})

cron.schedule('0 0 12 * * *',async () =>{
    let chats = await userDB.find({}) || []
    chats.forEach(chat => {
        TeleReq.sendMessage(chat._id,`Good afternoon everyone, it's ${moment().format('h:mm a')}.`);
    })    
},CronOption)

cron.schedule('0 0 23 * * *',async ()=>{
    TeleReq.getUpdates();
})

/**
 * @description Testing CRON
 */
cron.schedule(`${curTime} * * * * *`, async () => {

})