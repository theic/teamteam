const {MTProto} = require('telegram-mtproto')
require('babel-polyfill')

const AsyncStorage = require('./my-storage')
const storage = new AsyncStorage(79788522620)

const api = {
    invokeWithLayer: 0xda9b0d0d,
    layer: 57,
    initConnection: 0x69796de9,
    api_id: 49631,
    app_version: '0.0.1',
    lang_code: 'en'
}

const server = {
    dev     : true,
    webogram: true
}

const app = {
    storage: storage
}

const client = MTProto({server, api, app})

const config = {
    id: 49631,//57413,
    hash: 'fb050b8f6771e15bfda5df2409931569'//'fef04bb4cfbd2758fb7529ee3ca9acac'
}

// client('auth.checkPhone', {
//     phone_number  : phone
// }).then((res) => {
//    console.log(res)
// })

const getState = async _ => {
    return await client('updates.getState')
}

const sendCode = async (phone) => {
    try {
        const res = await client('auth.sendCode', {
            phone_number: phone,
            sms_type: 0,
            api_id: config.id,
            api_hash: config.hash
        })
        return {phone_code_hash: res.phone_code_hash}
    } catch (err) {
        switch (err.code) {
            case 400:
                return {error_msg: 'Номер неправильный бл*ть', data: {}}
            case 303:
                return {error_msg: 'Что-то не так, попробуй выключить и включить', data: {}}
            default:
                return {error_msg: 'Все сломалось :(', data: {}}
        }
    }
}

const signIn = async (phone, hash, code) => {
    try {
        // console.log('Данные для входа: ', phone, ' ', code, ' ', phoneCodeHash);
        const res = await client('auth.signIn', {
            phone_number: phone,
            phone_code_hash: hash,
            phone_code: code
        })
        return {error_msg: '', data: res}
    } catch (err) {
        return {error_msg: 'all is fucked', data: {}}
    }
}

const logOut = async _ => {
    return await client('auth.logOut')
}

const getChat = async _ => {
    const dialogs = await client('messages.getDialogs', {
        limit: 50
    })
    const {chats} = dialogs
    const selectedChat = await selectChat(chats)
    console.log(selectedChat)
    return selectedChat
}

module.exports = {getState, sendCode, signIn, logOut, getChat}