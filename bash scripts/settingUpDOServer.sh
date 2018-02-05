cd ./../node_scripts
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install graphql-request dotenv csvtojson jsonfile
echo "TOKEN = 2f2c1c7bdba256a4373388cdb5036ad9d0aa1792
 START = 5
 END = 10" > .env
 cd ./../
 mkdir graphQL_info_of_repos
 cd ./node_scripts
 node githubGraphQLApiCallsDO.js