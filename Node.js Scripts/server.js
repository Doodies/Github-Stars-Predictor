const request = require('request')
let url = 'https://api.github.com/repositories'
let json2csv = require('json2csv');
let fs = require('fs');
data = []

function getRepos(i){
    let options = {
        method:'GET',
        url:url,
        qs:{since:i},
        headers:{"User-Agent":"anmolduainter"}
    };
    request(options , (err,res,body)=> {
        body = JSON.parse(body)
        console.log("------------------0------------")
        console.log(body[0].name)
        for (let i = 0; i < body.length; i++) {
            let d = {
                "RepoName": body[i].name,
                "Fork": body[i].fork,
                "Desc": body[i].description,
                "ownerName": body[i].owner.login,
                "Type": body[i].owner.type,
                "SideAdmin": body[i].owner.site_admin,
                "PrivateorNot": body[i].private
            }
            data.push(d)
        }

    //     console.log("Error -> " + err)
    // console.log("Response -> "+res)
    // console.log("body -> "+body)

})
}

for(let i=20000 ; i<25000 ; i+=100){
    setTimeout(function () {
        getRepos(i)
        console.log(i)
    },200)
}

setTimeout(function () {
    let fields = ['RepoName', 'Fork', 'Desc' ,'ownerName' ,'Type' ,'SideAdmin' , 'PrivateorNot'];
    let csv = json2csv({ data: data, fields: fields });
    fs.writeFile('file4.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
    console.log(data.length)
},60000)

//getRepos(1)