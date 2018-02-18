//setInterval based implementation

const fs = require('fs');
const csv = require('csvtojson');
const jsonfile = require("jsonfile");
const dotenv = require("dotenv");
dotenv.config();
dotenv.load();
const {request, GraphQLClient} = require('graphql-request');
let url = "https://api.github.com/graphql";
const client = new GraphQLClient(url, {
    headers: {
        Authorization: 'bearer ' + process.env.TOKEN,
    },
});

// get query for data
function getQuery() {
    let q = 'query ($owner: String!, $name: String!, $isUser:Boolean!) {  \n' +
        '  \n' +
        '  organization(login: $owner) @skip(if: $isUser){\n' +
        '    login\n' +
        '    \n' +
        '    repositories{\n' +
        '      totalCount\n' +
        '    }       \n' +
        '    \n' +
        '    location\t\t#location of organization\n' +
        '    \n' +
        '    members{\n' +
        '      totalCount\n' +
        '    }\n' +
        '    \n' +
        '    websiteUrl        \n' +
        '  }\n' +
        '  \n' +
        '  user(login: $owner) @include(if: $isUser){            \n' +
        '    login\n' +
        '    \n' +
        '    followers{\t\t# number of followers of the user\n' +
        '      totalCount\n' +
        '    }    \n' +
        '\trepositories{\t\t# number of repositories of the user\n' +
        '      totalCount\n' +
        '    }\n' +
        '    \n' +
        '    following{\t# following\n' +
        '      totalCount\n' +
        '    }\n' +
        '    \n' +
        '    location    # location of user\n' +
        '    \n' +
        '    organizations{\n' +
        '      totalCount\n' +
        '    }\n' +
        '    \n' +
        '    gists(last:100){\n' +
        '      edges{\n' +
        '        node{          \n' +
        '          comments{\n' +
        '            totalCount\n' +
        '          }\n' +
        '          stargazers{\n' +
        '            totalCount\n' +
        '          }          \n' +
        '        }\n' +
        '      }\n' +
        '      totalCount\n' +
        '    }    \n' +
        '    \n' +
        '    websiteUrl\n' +
        '  }\n' +
        '  \n' +
        '  repository(owner: $owner, name: $name) {\n' +
        '    name\t\t# name of the repo           \n' +
        '\n' +
        '    primaryLanguage{\n' +
        '      name\n' +
        '    }\n' +
        '\n' +
        '    license\n' +
        '    \n' +
        '    isArchived\n' +
        '\n' +
        '    hasWikiEnabled\n' +
        '    \n' +
        '    forkCount\n' +
        '    \n' +
        '    # readme.md of the repo\n' +
        '    readme_md:object(expression: "master:README.md"){\n' +
        '      ... on Blob{\n' +
        '        text\n' +
        '        byteSize\n' +
        '      }\n' +
        '    }\n' +
        '    readme_txt:object(expression: "master:README.txt"){\n' +
        '      ... on Blob{\n' +
        '        text\n' +
        '        byteSize\n' +
        '      }\n' +
        '    }\n' +
        '    readme_markdown:object(expression: "master:README.markdown"){\n' +
        '      ... on Blob{\n' +
        '        text\n' +
        '        byteSize\n' +
        '      }\n' +
        '    }\n' +
        '    readme_tst:object(expression: "master:README.tst"){\n' +
        '      ... on Blob{\n' +
        '        text\n' +
        '        byteSize\n' +
        '      }\n' +
        '    }\n' +
        '    readme_:object(expression: "master:README"){\n' +
        '      ... on Blob{\n' +
        '        text\n' +
        '        byteSize\n' +
        '      }\n' +
        '    }\n' +
        '    \n' +
        '    stars: stargazers{\n' +
        '      totalCount\n' +
        '    }\n' +
        '    createdAt\n' +
        '    updatedAt\n' +
        '    pushedAt\n' +
        '\n' +
        '    \n' +
        '    description\n' +
        '    \n' +
        '    subscribersCount: watchers{\n' +
        '      totalCount\n' +
        '    }\n' +
        '    \n' +
        '    # size of repository\n' +
        '    diskUsage\n' +
        '    \n' +
        '    # pull requests number\n' +
        '    pullRequestsOpen: pullRequests(states: OPEN){            \n' +
        '      totalCount\n' +
        '    }\n' +
        '    pullRequestsClosed: pullRequests(states: CLOSED){\n' +
        '      totalCount\n' +
        '    }\n' +
        '    pullRequestsMerged: pullRequests(states: MERGED){\n' +
        '      totalCount\n' +
        '    }\n' +
        '\n' +
        '    # total number of comments and commits for last open 100 PRs\n' +
        '    PROpenCommentsCommitsCount: pullRequests(last:100, states: OPEN){\n' +
        '      edges{\n' +
        '        node{\n' +
        '          comments{\n' +
        '            totalCount\n' +
        '          }\n' +
        '          commits{\n' +
        '            totalCount\n' +
        '          }          \n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '    \n' +
        '    # total number of comments and commits for last 100 closed PRs\n' +
        '    PRClosedCommentsCommitsCount: pullRequests(last:100, states: CLOSED){\n' +
        '      edges{\n' +
        '        node{\n' +
        '          comments{\n' +
        '            totalCount\n' +
        '          }\n' +
        '          commits{\n' +
        '            totalCount\n' +
        '          }          \n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '    \n' +
        '    # total number of comments and commits for last 100 merged PRs\n' +
        '    PRMergedCommentsCommitsCount: pullRequests(last:100, states: MERGED){\n' +
        '      edges{\n' +
        '        node{\n' +
        '          comments{\n' +
        '            totalCount\n' +
        '          }\n' +
        '          commits{\n' +
        '            totalCount\n' +
        '          }          \n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '    \n' +
        '    # issues number\n' +
        '    issuesOpen:issues(states:OPEN){\n' +
        '      totalCount\n' +
        '    }\n' +
        '    issuesClosed:issues(states:CLOSED){\n' +
        '      totalCount\n' +
        '    }\n' +
        '    \n' +
        '    # number of comments on last 100 open issues\n' +
        '    iOpenCommentsParticipantsCount: issues(last: 100, states:OPEN){\n' +
        '      edges{\n' +
        '        node{\n' +
        '          comments{\n' +
        '            totalCount\n' +
        '          }\n' +
        '          participants{\n' +
        '            totalCount\n' +
        '          }          \n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '    \n' +
        '    # number of comments on last 100 closed issues\n' +
        '    iClosedCommentsParticipantsCount: issues(last: 100, states:CLOSED){\n' +
        '      edges{\n' +
        '        node{\n' +
        '          comments{\n' +
        '            totalCount\n' +
        '          }\n' +
        '          participants{\n' +
        '            totalCount\n' +
        '          }          \n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '    \n' +
        '    # total number of branches\n' +
        '    numBranches:refs(refPrefix: "refs/heads/") {\n' +
        '      totalCount      \n' +
        '    }\n' +
        '    \n' +
        '    # total commits on master branch\n' +
        '    numCommits:ref(qualifiedName: "master"){\n' +
        '      target{\n' +
        '        ... on Commit{\n' +
        '          history{\n' +
        '            totalCount\n' +
        '          }\n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '    \n' +
        '    # total number of tags\n' +
        '    tags:refs(refPrefix:"refs/tags/"){\n' +
        '      totalCount\n' +
        '    }\n' +
        '    \n' +
        '    # total number of releases\n' +
        '    releases {\n' +
        '    \ttotalCount  \n' +
        '    }\n' +
        '  }\n' +
        '}\n';
    return q;
}

//get query for rateLimit enquiry
function getRateLimitQuery() {
    let q = "{\n" +
        "  viewer {\n" +
        "    login\n" +
        "  }\n" +
        "  rateLimit {\n" +
        "    limit\n" +
        "    cost\n" +
        "    remaining\n" +
        "    resetAt\n" +
        "  }\n" +
        "}";
    return q;
}

let start = parseInt(process.env.START), end = parseInt(process.env.END);
let fMid = "" + start + "_" + end;
let input = "./repos/file_2008-01-01_2018-02-15.csv", output = "./graphQlData/file_" + fMid + ".json";
let nReq = -1, nRes = -1, setI, reqSetI;
let basicData = [], graphQLData = [], errors = 0, errorsList = [];
let startTime = new Date();
const query = getQuery();

// const query = getRateLimitQuery();


function readData() {
    console.log("reading csv data from " + input + "...");
    csv().fromFile(input).on('json', (jsonObj) => {
        basicData.push(jsonObj);
    })
        .on('done', (error) => {
            //error handling
            if (error) {
                return console.log(error);
            }

            // slicing the data
            basicData = basicData.slice(start, end + 1);
            console.log('done reading data! having length ' + basicData.length + " from " + start + " to " + end);

            //starting the request cycle
            console.log("starting to fetch data...");
            reqSetI = setInterval(callRequest, parseInt(process.env.LOOPDELAY));
        });
}

function callRequest() {
    if (nReq === basicData.length - 1) {
        clearInterval(reqSetI);
        console.log("Task completed");
        // saving data
        setI = setInterval(() => {
            if (nRes === nReq) {
                console.log("total requests: " + nReq + "\ttotal responses: " + nRes
                    + "\tdataCount: " + graphQLData.length + "\terrors count: " + errors);
                console.log("errorList: ", errorsList);
                return saveData();
            }
        }, 10 * 1000);
        return;
    }

    nReq++;
    let myReq = nReq;
    let repo = basicData[myReq];
    let variables = {
        "owner": repo["ownerName"],
        "name": repo["RepoName"],
        "isUser": repo["Type"] === "User",
    };
    // console.log(variables);
    client
        .request(query, variables)
        .then(data => {
            data["repository"]["type"] = variables["isUser"] ? "user" : "organization";
            data["siteAdmin"] = repo["SideAdmin"];
            graphQLData.push(data);
            nRes++;
            console.log("got " + nRes + " response for reqNum " + myReq + "\ttotal data len: " + (graphQLData.length)
                + "\terrors: " + errors + "\tat: " + (new Date() - startTime) / 1000.0 + "s");
        })
        .catch((err) => {
            nRes++;
            console.log("got error on " + myReq + " data! ************************************");
            errors++;
            errorsList.push(myReq);
            console.log(err.response);
        });
}

function saveData() {
    clearInterval(setI);
    console.log("saving data having length: " + graphQLData.length + " to " + output + "...");
    jsonfile.writeFile(output, graphQLData, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("done saving! " + graphQLData.length + " items");
    })
}

function callRateLimitRequest() {
    client
        .request(query)
        .then(data => {
            console.log(data);
            console.log("fetched!");
        })
        .catch((err) => {
            console.log("error: ");
            console.log(err.response)
        });
}

//starting to read data
readData();
// callRateLimitRequest();