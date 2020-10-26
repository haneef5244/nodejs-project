var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true}))
router.use(bodyParser.json())
var SearchHistory = require('../model/SearchHistory')

router.get('/byCategory', (req, resp) => {
    let data = []
    SearchHistory.find({category: 'language'}, (err, histories) => {
        console.log("Finding by language")
        console.log(histories.length)
        let languageData = {category:'language'}
        languageData.keyword = []
        languageData.count = 0
        histories.forEach((x) => {
            languageData.keyword.push(x.keyword)
            x.searchedBy.forEach(() => languageData.count++)
        })
        data.push(languageData)
        SearchHistory.find({category: 'topic'}, (err, histories) => {
            console.log('find by topic')
            let topic = {category:'topic'}
            topic.keyword = []
            topic.count = 0
            histories.forEach((x) => {
                topic.keyword.push(x.keyword)
                x.searchedBy.forEach(() => {
                    topic.count++
                })
            })
            data.push(topic)
            return resp.status(200).send({
                message: 'Successfully retrieved',
                data: data
            })
        })
    })


})

router.get('/trending', (req, resp) => {
    var lastHour = new Date();
    lastHour.setHours(lastHour.getHours()-1)
    console.log(`lastHour = ${lastHour}`)
    SearchHistory.find({dateModified: {$gt: lastHour}}, (err, histories) => {
        var lastHourData = []
        console.log(`histories count : ${histories.length}`)
        histories.forEach((h) => {
            var newData = {}
            let count = 0
            h.searchedBy.forEach((s) => {
                if (s.dateSearched >= lastHour) count++
            })
            newData.keyword = h.keyword
            newData.totalCount = count
            newData.lastSearchedOn = h.dateModified
            //newData.lastSearchedOn.setHours(newData.lastSearchedOn.getHours()+8)
            lastHourData.push(newData)
        })
        lastHourData = lastHourData.sort((a,b) => b.totalCount - a.totalCount)
        return resp.status(200).send({
            message: 'Successful',
            data: lastHourData
        })
    })
})



module.exports = router
