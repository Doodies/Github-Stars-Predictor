const request = require('request');
let url = 'https://api.github.com/repos';
let json2csv = require('json2csv');
let csv = require('csvtojson');
let fs = require('fs');
let data = [];
let start = 25, end = 30;
let fmid = "" + start + "_" + end;
let input = "./data/file_" + fmid + ".csv";
let output = "./newDataUpdated/file_" + fmid + ".csv";


function saveData(err2) {
    let fields = ['RepoName', 'OwnerName',
        'Fork', 'Desc', 'Type', 'SideAdmin', 'PrivateorNot',
        'Size', 'WatchersCount'
        , 'Language', 'HasIssues', 'HasProjects', 'HasDownloads', 'HasWiki', 'HasPages'
        , 'ForksCounts', 'Archived', 'OpenIssuesCount', 'License', 'SubscribersCount', 'NetworkCount'
        , 'CreatedAt', 'UpdatedAt', 'PushedAt', 'StarsCount'];
    let csv = json2csv({data: data, fields: fields});
    fs.writeFile(output, csv, function (err) {
        if (err) throw err;
        if (err2) throw err2;
        console.log('file saved');
    });
//    console.log(data.length)
}


function getRepos(RepoName, Ownername, RepoDetails) {
    return new Promise((resolve) => {
        let options = {
            method: 'GET',
            url: url + "/" + Ownername + "/" + RepoName + "?client_id=7deec774e3dccdd361b5&client_secret=5f841951982f75b2045d8d79758a91daa8aa9578",
            // proxy: 'http://103.28.160.149:8081',
            headers: {"User-Agent": "hackbansu"}
        };
        request(options, (err, res, body) => {
            if (err) {
                return saveData(err);
            }
            body = JSON.parse(body);
            let licen;
            if (body.license == null) {
                licen = 'NA'
            }
            else {
                licen = body.license.key
            }
            let opt = {
                "RepoName": RepoName,
                "OwnerName": Ownername,
                "Fork": RepoDetails.Fork,
                "Desc": RepoDetails.Desc,
                "Type": RepoDetails.Type,
                "SideAdmin": RepoDetails.SideAdmin,
                "PrivateorNot": RepoDetails["PrivateorNot"],
                "Size": body.size,
                "WatchersCount": body["watchers_count"],
                "Language": body["language"],
                "HasIssues": body["has_issues"],
                "HasProjects": body["has_projects"],
                "HasDownloads": body["has_downloads"],
                "HasWiki": body["has_wiki"],
                "HasPages": body["has_pages"],
                "ForksCounts": body["forks_count"],
                "Archived": body["archived"],
                "OpenIssuesCount": body["open_issues_count"],
                "License": licen,
                "SubscribersCount": body["subscribers_count"],
                "NetworkCount": body["network_count"],
                "CreatedAt": body["created_at"],
                "UpdatedAt": body["updated_at"],
                "PushedAt": body["pushed_at"],
                "StarsCount": body["stargazers_count"]
            };
            resolve(opt);
            // console.log(opt);
            // console.log(data);
        })
    })
}


let reponameSearch = [];
csv().fromFile(input).on('json', (jsonObj) => {
    reponameSearch.push(jsonObj);
})
    .on('done', (error) => {
        if (error) {
            console.log(error);
        }
        console.log('end');
        // console.log(reponameSearch);
        console.log("reponameSearch length: " + reponameSearch.length);
        let i = 0;
        let intervalId = setInterval(() => {
            let repoName = reponameSearch[i].RepoName;
            let ownerName = reponameSearch[i].ownerName;
            getRepos(repoName, ownerName, reponameSearch[i]).then(d => {
                // console.log(d)
                data.push(d);
                console.log("done " + data.length);
                if (data.length === reponameSearch.length) {
                    console.log("Saving");
                    saveData(false);
                }
            });
            i++;
            if (i === reponameSearch.length) {
                clearInterval(intervalId);
            }
        }, 50);

    });