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
        
        // return `https://wallpapercave.com/${item[String(new Date().getDate())]}`
        return `https://wallpapercave.com/${item['54']}`;
    }
}