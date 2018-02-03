const request = require('request')
let url = 'https://api.github.com/repos'
let json2csv = require('json2csv');
let csv = require('csvtojson')
let fs = require('fs');
data = [];

function saveData(){
    let fields = ['RepoName', 'OwnerName',
        'Fork', 'Desc' ,'Type' ,'SideAdmin' , 'PrivateorNot',
        'Size' ,'WatchersCount'
        ,'Language' ,'HasIssues' , 'HasProjects' , 'HasDownloads' ,'HasWiki' ,'HasPages'
        ,'ForksCounts' ,'Archived','OpenIssuesCount','License' ,'SubscribersCount','NetworkCount'
        ,'CreatedAt','UpdatedAt','PushedAt','StarsCount'];
    let csv = json2csv({ data: data, fields: fields });
    fs.writeFile('file6.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
//    console.log(data.length)
}


function getRepos(RepoName,Ownername,RepoDetails){
   return new Promise((resolve)=>{
       let options = {
           method:'GET',
           url:url+"/"+Ownername+"/"+RepoName,
           headers:{"User-Agent":"anmolduainter"}
       };
       request(options , (err,res,body)=> {
           body = JSON.parse(body)
           let licen;
           if (body.license == null){
               licen = 'NA'
           }
           else{
               licen = body.license.key
           }
           let opt = {
               "RepoName" : RepoName,
               "OwnerName" : Ownername,
               "Fork": RepoDetails.Fork,
               "Desc": RepoDetails.Desc,
               "Type": RepoDetails.Type,
               "SideAdmin": RepoDetails.SideAdmin,
               "PrivateorNot": RepoDetails.PrivateOrNot,
               "Size" : body.size,
               "WatchersCount" : body.watchers_count,
               "Language" : body.language,
               "HasIssues" : body.has_issues,
               "HasProjects" : body.has_projects,
               "HasDownloads" : body.has_downloads,
               "HasWiki" : body.has_wiki,
               "HasPages" : body.has_pages,
               "ForksCounts" : body.forks_count,
               "Archived" : body.archived,
               "OpenIssuesCount" : body.open_issues_count,
               "License" : licen,
               "SubscribersCount" : body.subscribers_count,
               "NetworkCount" : body.network_count,
               "CreatedAt" : body.created_at,
               "UpdatedAt" : body.updated_at,
               "PushedAt" : body.pushed_at,
               "StarsCount": body.stargazers_count
           }
           resolve(opt)
           // console.log(opt)
           // console.log(data)
       })
   })
}



let reponameSearch=[]
csv().fromFile('./file5.csv').on('json',(jsonObj)=>{
       let opt = {
            "RepoName" : jsonObj.RepoName,
            "ownerName" : jsonObj.ownerName,
            "Fork" : jsonObj.Fork,
            "Desc" : jsonObj.Desc,
            "Type" : jsonObj.Type,
            "SideAdmin" : jsonObj.SideAdmin,
            "PrivateOrNot" : jsonObj.PrivateorNot
       }
       console.log(opt)
       reponameSearch.push(opt)
    })
    .on('done',(error)=>{
        console.log('end')
        console.log(reponameSearch)
        console.log(reponameSearch.length)
        for (let i=0 ; i<reponameSearch.length ; i++){
            let repoName = reponameSearch[i].RepoName
            let ownerName = reponameSearch[i].ownerName
            getRepos(repoName,ownerName,reponameSearch[i]).then(d=>{
               // console.log(d)
                data.push(d)
                if (data.length == reponameSearch.length){
                    console.log("Saving")
                    saveData()
                }
            })
            //console.log(repoName)
            //console.log(ownerName)
        }
    })