const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const db = require('../../config/mongoose')
const Record = require('../record')
const User = require('../user')
const Category = require('../category')
const { SEED_USER, SEED_RECORD } = require('./fakeData')


db.once('open', async () => {
    try {
        // 處理SEED_RECORD：把category換成categoryId
        const categories = await Category.find({}).lean() // 找出所有category
        const processedRecords = SEED_RECORD.map(record => {
            for (const category of categories) {
                if (record.category === category.name) {
                    const categoryId = category._id
                    return {
                        name: record.name,
                        amount: record.amount,
                        categoryId
                    }
                }
            }
        })
        // 建立user
        for (let i = 0; i < SEED_USER.length; i++) {
            const hash = await bcrypt.hash(SEED_USER[i].password, await bcrypt.genSalt(10))
            const user = await User.create({
                name: SEED_USER[i].name,
                email: SEED_USER[i].email,
                password: hash
            })
            // 分配processedRecords給使用者
            const startIndex = i * 5
            const endIndex = startIndex + 5
            const slicedRecords = processedRecords.slice(startIndex, endIndex)
            for (const record of slicedRecords) {
                record.userId = user._id
                await Record.create(record)
            }
        }
    } catch (err) {
        console.error(err)
    }
    console.log('recordSeeder done.')
    process.exit()
})