if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const db = require('../../config/mongoose')
const Category = require('../category')
const SEED_CATEGORY = require('../../utility/categoryIconList')

db.once('open', async () => {
    try {
        for (const property in SEED_CATEGORY) {
            const categoryExists = await Category.find({ name: property }).lean()
            if (categoryExists.length) {
                continue
            }
            await Category.create({
                name: property,
                icon: SEED_CATEGORY[property],
            })
        }
    } catch (err) {
        console.error(err)
    }
    console.log('categorySeeder done.')
    process.exit()
})