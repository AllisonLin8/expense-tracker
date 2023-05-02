const formatDate = (records) => {
    records.forEach(record => {
        const date = new Date(record.date)
        record.date = date.getFullYear() + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getDate().toString().padStart(2, '0')
    })
}
const totalAmount = (records) => {
    let totalAmount = 0
    records.forEach(record => {
        totalAmount += record.amount
    })
    return totalAmount
}
module.exports = { formatDate, totalAmount }