cd ./../nodejs
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install
echo "TOKEN =
START = 0
END = 10000" > .env
mkdir graphQlData
cd ./../../
cp .tmux.conf ~/.tmux.conf
