
// Getting Contributors Count


const request = require('request')
let url = 'https://api.github.com/repos'
let json2csv = require('json2csv');
let csv = require('csvtojson')
let fs = require('fs');
let auth = require('./Auth')
let base64 = require('js-base64').Base64
let utf8 = require('utf8')
let wordCount = require('word-count')
data = [];

function saveData(){
    let fields = ['RepoName', 'OwnerName',
        'Fork', 'Desc' ,'Type' ,'SideAdmin' , 'PrivateorNot',
        'Size' ,'WatchersCount'
        ,'Language' ,'HasIssues' , 'HasProjects' , 'HasDownloads' ,'HasWiki' ,'HasPages'
        ,'ForksCounts' ,'Archived','OpenIssuesCount','License' ,'SubscribersCount','NetworkCount'
        ,'CreatedAt','UpdatedAt','PushedAt','ReadMeWordCount','ReadMeCharcCount','ContributorsCount','StarsCount'];
    let csv = json2csv({ data: data, fields: fields });
    fs.writeFile('./Outputs1/file_1_5.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
}


function getRepos(RepoData){
    return new Promise((resolve)=>{
        let options = {
            method:'GET',
            url:url+"/"+RepoData.OwnerName+"/"+RepoData.RepoName+"/stats/contributors?client_id=239e4cef0ea566b2e9f3&client_secret=dc1d2a5340fecde359ba3b085ea641f70b983256",
            headers:{"User-Agent":"anmolduainter"}
        };
        request(options , (err,res,body)=> {
            let contributorCount;
          //  console.log(body)
            if (typeof body === "undefined"){
                contributorCount = 'NA'
            }
            else {
                if (body !== ''){
                    body = JSON.parse(body)
                    if (typeof body.length !== "undefined"){
                        let l = body.length
                        contributorCount = l
                    }
                    else{
                        contributorCount = 'NA'
                    }
                }
                else{
                    contributorCount = 'NA'
                }
            }

                console.log(RepoData.RepoName + "  -> Count : " + contributorCount)

            let opt = {
                "RepoName" : RepoData.RepoName,
                "OwnerName" : RepoData.OwnerName,
                "Fork": RepoData.Fork,
                "Desc": RepoData.Desc,
                "Type": RepoData.Type,
                "SideAdmin": RepoData.SideAdmin,
                "PrivateorNot": RepoData.PrivateorNot,
                "Size" : RepoData.Size,
                "WatchersCount" : RepoData.WatchersCount,
                "Language" : RepoData.Language,
                "HasIssues" : RepoData.HasIssues,
                "HasProjects" : RepoData.HasProjects,
                "HasDownloads" : RepoData.HasDownloads,
                "HasWiki" : RepoData.HasWiki,
                "HasPages" : RepoData.HasPages,
                "ForksCounts" : RepoData.ForksCounts,
                "Archived" : RepoData.Archived,
                "OpenIssuesCount" : RepoData.OpenIssuesCount,
                "License" : RepoData.License,
                "SubscribersCount" : RepoData.SubscribersCount,
                "NetworkCount" : RepoData.NetworkCount,
                "CreatedAt" : RepoData.CreatedAt,
                "UpdatedAt" : RepoData.UpdatedAt,
                "PushedAt" : RepoData.PushedAt,
                "ReadMeWordCount" : RepoData.ReadMeWordCount,
                "ReadMeCharcCount": RepoData.ReadMeCharcCount,
                "ContributorsCount" : contributorCount,
                "StarsCount": RepoData.StarsCount
            }
            resolve(opt)
        })
    })
}

let reponameSearch=[]
csv().fromFile('./Outputs/file_1_5.csv').on('json',(jsonObj)=>{
    reponameSearch.push(jsonObj)
}).on('done',(error)=>{
    console.log('end')
    let i=0
    let intervalId = setInterval(function () {
        getRepos(reponameSearch[i]).then(d=>{
            data.push(d)
            console.log("done : " + data.length)
            if (data.length == reponameSearch.length){
                console.log("Saving")
                saveData()
            }
        })
        i++;
        if (i === reponameSearch.length) {
            clearInterval(intervalId);
        }
    } , 200)
})