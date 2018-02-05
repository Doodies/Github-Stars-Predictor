const {request, GraphQLClient} = require('graphql-request');
const dotenv = require("dotenv");
dotenv.config();
dotenv.load();
const csv = require('csvtojson');
const fs = require('fs');
const jsonfile = require("jsonfile");

let url = "https://api.github.com/graphql";
const client = new GraphQLClient(url, {
    headers: {
        Authorization: 'bearer ' + process.env.TOKEN,
    },
});
let start = parseInt(process.env.START), end = start + 5;
let fmid = "" + start + "_" + end;
let input = "./../basic_info_of_repos/file_" + fmid + ".csv";
let output = "./../graphQL_info_of_repos/file_" + fmid + ".json";

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
        '    # readme of the repo\n' +
        '    readme:object(expression: "master:README.md"){\n' +
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

const query = getQuery();
// const query = getRateLimitQuery();
let variables = {
    "owner": "rails",
    "name": "rails",
    "isUser": false
};

let basicData = [];
let graphQLData = [];
let errors = 0, errorsList = [];

readData();
function readData() {
    console.log("reading csv data from "+ input +"...");
    basicData = [];
    csv().fromFile(input).on('json', (jsonObj) => {
        basicData.push(jsonObj);
    })
        .on('done', (error) => {
            if (error) {
                console.log(error);
            }
            console.log('done reading data! having length ', basicData.length);

            console.log("starting to fetch data...");
            graphQLData = [];
            errorsList = [];
            callRequest(0);
            // callOneRequest(49);
        });
}


function callOneRequest(i) {
    console.log(basicData[i], i);
    variables["owner"] = basicData[i]["OwnerName"];
    variables["name"] = basicData[i]["RepoName"];
    variables["isUser"] = basicData[i]["Type"] === "User";
    console.log(variables);

    // variables["owner"] = "drnic";
    // variables["name"] = "ruby-on-rails-tmbundle";
    // variables["isUser"] = true;
    // console.log(variables);

    client
        .request(query, variables)
        .then(data => {
            // console.log(data);
            console.log("fetched!");
        })
        .catch((err) => {
            console.log("here");
            console.log(err.response)
        });
}

function callRequest(i) {
    if (i === basicData.length) {
        return saveData();
    }
    variables["owner"] = basicData[i]["OwnerName"];
    variables["name"] = basicData[i]["RepoName"];
    variables["isUser"] = basicData[i]["Type"] === "User";
    client
        .request(query, variables)
        .then(data => {
            data["repository"]["type"] = variables["isUser"] ? "user" : "organization";
            graphQLData.push(data);
            console.log("got " + i + " data!");
            callRequest(i + 1);
        })
        .catch((err) => {
            console.log("got error on " + i + " data! ************************************");
            errors++;
            errorsList.push(i);
            console.log(err.response);
            callRequest(i + 1);
        });
}

function saveData() {
    console.log("saving data to "+ output +"...");
    jsonfile.writeFile(output, graphQLData, function (err) {
        if (err) console.log(err);
        console.log("done saving! " + graphQLData.length + " items");
        console.log("got " + errors + " errors");
        console.log(errorsList);

        //changing input file now
        if(start !== parseInt(process.env.END)){
            start = start+5;
            end = start+5;
            fmid = "" + start + "_" + end;
            input = "./../basic_info_of_repos/file_" + fmid + ".csv";
            output = "./../graphQL_info_of_repos/file_" + fmid + ".json";
            readData();
        }
    })
}
