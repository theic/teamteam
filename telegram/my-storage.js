const mongoose = require('mongoose')
const Storage = mongoose.model('Storage')

class AsyncStorage {

    constructor(phone_number) {
        this.phone_number = phone_number
    }

    async get(key) {
        console.log('Key Get: ', key)

        let res = await Storage.findOne(
            {
                phone: this.phone_number,
                key: key
            })

        console.log('Result: ', res)

        if (res && res.value)
            return res.value

        return null
    }

    async set(key, val) {
        console.log('Key Set: ', key, ' Value: ', val)

        let res = await Storage.update(
            {
                phone: this.phone_number,
                key: key
            },
            {
                phone: this.phone_number,
                key: key,
                value: val
            },
            {upsert: true})

        console.log('Result: ', res)

        return res
    }

    async remove(keys) {

        console.log('Removing...')

        let res = await Storage.remove({
            phone_number: this.phone_number,
            key: {
                $in: keys
            }
        })

        console.log('Result: ', res)

        return res
    }

    async clear() {

        console.log('Clearing...')

        let res = await Storage.remove({})

        console.log('Result: ', res)

        return res
    }
}

module.exports = AsyncStorage