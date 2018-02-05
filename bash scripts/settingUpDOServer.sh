cd ./../node_scripts
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install graphql-request dotenv csvtojson jsonfile
echo "TOKEN =
START = 5
END = 10" > .env
cd ./../
mkdir graphQL_info_of_repos
cp .tmux.conf ~/.tmux.conf
cd ./node_scripts