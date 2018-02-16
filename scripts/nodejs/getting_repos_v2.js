const request = require('request');
let url = 'https://api.github.com/search/repositories';
const json2csv = require('json2csv');
const fs = require('fs');
const dateFormat = require('dateformat');
const dotenv = require("dotenv");
dotenv.config();
dotenv.load();

let data = [], countExceeds = 0;
let fD = new Date();
let startTime = new Date();
let nReq = 0, nRes = 0, setI, reqSetI;

function getRepos() {
    if (fD <= new Date("2014-1-1")) {
        clearInterval(reqSetI);
        console.log("Task completed");
        // saving data
        setI = setInterval(() => {
            if (nRes === nReq) {
                console.log("total requests: " + nReq + "\ttotal responses: " + nRes + "\texceed count: " + countExceeds);
                return saveData();
            }
        }, 10 * 1000);
        return;
    }
    nReq++;
    let myDate;
    myDate = fD = new Date(fD - 1000 * 60 * 60 * 24);
    let options = {
        method: 'GET',
        url: url,
        qs: {
            q: "stars:>=100 created:" + dateFormat(myDate, "yyyy-mm-dd"),
            sort: "stars",
            order: "asc",
            page: 1,
            per_page: 101,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        },
        headers: {"User-Agent": "hackbansu"}
    };
    request(options, (err, res, body) => {
        // error handling
        if (err || !body) {
            console.log("body ==> ", body);
            console.log("error ==> ", err);
            console.log("some error occurred");
            clearInterval(reqSetI);
            return saveData();
        }
        body = JSON.parse(body);
        if (!body.items) {
            console.log("body ==> ", body);
            console.log("body.items not found");
            clearInterval(reqSetI);
            return saveData();
        }

        // this request work
        let modItems = body.items.map(x => {
            return {
                "RepoName": x.name,
                "ownerName": x.owner["login"],
                "Type": x.owner.type,
                "SideAdmin": x.owner["site_admin"],
            };
        });
        data = data.concat(modItems);
        nRes++;
        console.log(dateFormat(myDate, "dd-mm-yyyy") + "\tResults: " + body["total_count"] + "\tresNum: " + nRes
            + "\tcompleted at: " + (new Date() - startTime) / 1000.0 + "s" + "\trepos fetched: " + data.length);
        if (body["total_count"] > 100) {
            countExceeds++;
            console.log("************ count exceeded *************");
        }
    })
}

reqSetI = setInterval(getRepos, 2050);

function saveData() {
    clearInterval(setI);
    let fields = ['RepoName', 'ownerName', 'Type', 'SideAdmin'];
    console.log("len: ", data.length);
    let csv = json2csv({data: data, fields: fields});
    fs.writeFile('./repos/file_2014-01-01_2018-02-15.csv', csv, function (err) {
        if (err) throw err;
        console.log('file saved');
    });
}