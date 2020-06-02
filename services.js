const cheerio = require('cheerio');
const axios = require('axios');
require('dotenv').config()
module.exports = {
    /**
     * @description Scrap https://wallpapercave.com/ to get image 
     */
    async webScrapGetImg(){
        let res = await  axios.get(process.env.IMAGE_SITE)
        const $ = cheerio.load(res.data)
        var item = {}
        $('img.wpimg').map((idx,res)=>{
            item[idx] = res.attribs['src'];
        })
        
        return `https://wallpapercave.com/${item[String(new Date().getDate())]}`
    },
    /**
     * Get twitter trending tweets
     * @param {String} woeid Where on earth id
     */
    async getTwitterTrending(woeid){
        let res = await axios.get(`https://api.twitter.com/1.1/trends/place.json?id=${woeid}`,{headers : {authorization : `Bearer ${process.env.TWITTER_AUTH}`}})
        var message = 'Current twitter trending hashtag :\n';
        var c = 0; 
        res.data[0].trends.forEach(trend => {
            if(c>10)
                return -1;
            else if(trend.name[0] == '#')
                message += `${trend.name.slice(1)} : ${trend.url}\n`;
            else 
                message += `${trend.name} : ${trend.url}\n`;
            c++;
        });
        return message;
    }
}