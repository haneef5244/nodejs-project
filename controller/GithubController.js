var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const axios = require('axios')
var SearchHistory = require('../model/SearchHistory')
router.use(bodyParser.urlencoded({ extended: true}));
router.use(bodyParser.json());

router.post('/', (req, outerResp) => {
    if (!req.session) {
        return outerResp.status(400).send({
            message: 'User session not found'
        })
    }
    console.log(req)
    let page = req.body.reqBody.page
    let perPage = req.body.reqBody.per_page
    var params = {}
    if (req.body.reqBody.language) {
        params.q = 'language:' + req.body.reqBody.language
        storeSearchInSession(req, 'language', req.body.reqBody.language)
    } else if (req.body.reqBody.topic) {
        params.q = 'topic:' + req.body.reqBody.topic
        storeSearchInSession(req, 'topic', req.body.reqBody.topic)
    }
    params.page = page
    params.per_page = perPage

    console.log("PARAMS: ")
    console.log(JSON.stringify(params))
    axios.get("https://api.github.com/search/repositories", { params: params })
        .then((resp) => {
            if (resp.data.items.length == 0) {
                return outerResp.status(400).send({
                    message:'No items found'
                })
            } else {
                var totalCount = resp.data.total_count
                var balance = totalCount - (page * perPage)
                if (balance > 0) {
                    // has more page
                }
                let responseObject = []
                let items = resp.data.items
                for (let i = 0; i < resp.data.items.length; i++) {
                    responseObject.push({
                        id: items[i].id,
                        fullName: items[i].full_name,
                        url: items[i].html_url,
                        watchersCount: items[i].watchers_count,
                        language: items[i].language,
                        forks: items[i].forks_count
                    })
                }
                return outerResp.status(200).send({
                    message: 'Successful',
                    totalCount: resp.data.total_count,
                    data: responseObject
                })


            }
            console.log(resp.data.items.length)
        })
        .catch((err) => {
            return outerResp.status(err.response.status).send({
                message: err.response.statusText
            })
        })
    //resp.status(200).send("Helo")
})

function storeSearchInSession(req, param, val) {
    // if totally doesn exist
    if (param == 'language') req.session.searches['language'].push(val)
    else req.session.searches['topic'].push(val)
    saveSearchHistory(param, val, req.session.sessionUserEmail)
}

function saveSearchHistory(param, val, email) {
    SearchHistory.findOne({keyword: val, category: param}, (err, history) => {
        if (err) return Promise.reject()
        if (!history) {
            console.log(`saveSearchHistory email : ${email}`)
            createUserHistory(param, val, email)
            return
        }
        let newSearch = history.searchedBy
        newSearch.push({
            email: email,
            dateSearched : new Date()
        })
        history.update({
            searchedBy: newSearch,
            dateModified: new Date()
        })
        history.save()
        return
    }).catch((err) => {
        console.log("printing err")
        console.log(err)
    })

}

function createUserHistory(param, val, email) {
    console.log(`createUserHistory email ${email}`)
    SearchHistory.create({
        keyword: val,
        category: param,
        searchedBy: [{
            email: email,
            dateSearched: new Date()
        }],
        dateCreated: new Date(),
        dateModified: new Date()
    }, (err, history) => {
        if (err) console.log(err)
        return
    })
}

module.exports = router;
