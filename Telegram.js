const axios = require('axios')
var userDB, reqDB;
const db = require('./db')
Promise.resolve(db.getDB('Telegram')).then((fullfill) => {
    userDB = fullfill.collection("users")
    reqDB = fullfill.collection("requests")
})
class TelegramAPI {
    constructor(token) {
        this.token = token
        this.request = axios.create({
            baseURL: `https://api.telegram.org/bot${this.token}`
        })
    }
    /**
     * @description using telegram API send message to specify user
     * @param {String} chat_id Telegram User ID 
     * @param {String} text Message you want to send
     */
    sendMessage(chat_id, text) {
        let option = {
            chat_id,
            text
        }
        return this.request.post('/sendMessage', option)
    }
    /**
     * @description Send image using Telegram API
     * @param {String} chat_id 
     * @param {JSON} photo {
     * img , caption
     * }
     */
    sendPhoto(chat_id, photo) {
        let option = {
            chat_id,
            photo: photo.img,
            caption: photo.caption
        }
        return this.request.post('/sendPhoto', option)
    }
    /**
     * @description Listening on webhook 
     * @param {String} message message send from telegram webhook
     */
    async webhook(message){
        let command = message.text
        let name = message.from.first_name +' '+message.from.last_name
        let key = message.from.id.toString()
        if(command == '/start'){
            this.sendMessage(key,"Thank you from now on you'll be recieving text from me.")
            userDB.insertOne({
                _id: key,
                name
            })
        } else if(command == '/stop'){
            this.sendMessage(key,"You won't be recieving any message from me anymore.")
            userDB.deleteOne({
                _id: key
            })
        } else {
            this.sendMessage(key,"Yuhuuu thank you for chating with me :)")
        }
    }
    /**
     * @description get update manually
     * can't use while using webhook 
     */
    async getUpdates() {
        let res = await this.request.get('/getUpdates')
        let results = res.data.result
        reqDB.insertOne({
            results
        })
        var userAction = {}
        results.forEach(update => {
            if (update.message.text == '/stop') {
                userAction[update.message.from.id] = {
                    action : '/stop'
                }
            } else if (update.message.text == '/start') {
                userAction[update.message.from.id] = {
                    action : '/start',
                    name : update.message.from.first_name + ' ' + update.message.from.last_name 
                }
                
            }
        })
        for (let [key, value] of Object.entries(userAction)) {
            if(value.action == '/start'){
                this.sendMessage(key,"Thank you from now on you'll be recieving text from me.")
                userDB.insertOne({
                    _id: key,
                    name: value.name
                })
            }
            else if(value.action == '/stop'){
                this.sendMessage(key,"You won't be recieving any message from me anymore.")
                userDB.deleteOne({
                    _id: key
                })
            }
        }
    }

}
module.exports = TelegramAPI