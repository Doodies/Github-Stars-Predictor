const request = require('request');
let url = 'https://api.github.com/repositories';
let json2csv = require('json2csv');
let fs = require('fs');
data = [];
let start = 15, end = 20, total = 0;

function getRepos(i) {
    let options = {
        method: 'GET',
        url: url,
        proxy: 'http://54.215.238.241:30094',
        qs: {since: i},
        headers: {"User-Agent": "hackbansu"}
    };
    request(options, (err, res, body) => {
        console.log(err)
        body = JSON.parse(body);
        console.log("------------------0------------");
        // console.log(body[0].name);
        for (let i = 0; i < body.length; i++) {
            let d = {
                "RepoName": body[i].name,
                "Fork": body[i].fork,
                "Desc": body[i].description,
                "ownerName": body[i].owner.login,
                "Type": body[i].owner.type,
                "SideAdmin": body[i].owner.site_admin,
                "PrivateorNot": body[i].private
            };
            data.push(d)
        }
        total += 100;
        console.log(total + ' done');

        //     console.log("Error -> " + err)
        // console.log("Response -> "+res);
        // console.log("body -> "+body);
    })
}

for (let i = start * 1000; i < end * 1000; i += 100) {
    setTimeout(function () {
        getRepos(i);
        console.log(i)
    }, 200)
}

setTimeout(function () {
    let fields = ['RepoName', 'Fork', 'Desc', 'ownerName', 'Type', 'SideAdmin', 'PrivateorNot'];
    let csv = json2csv({data: data, fields: fields});
    fs.writeFile('file_'+start+'_'+end+'.csv', csv, function (err) {
        if (err) throw err;
        console.log('file saved');
    });
    console.log(data.length)
}, 30000);

//getRepos(1)