const {request, GraphQLClient} = require('graphql-request');
let url = "https://api.github.com/graphql";
const client = new GraphQLClient(url, {
    headers: {
        Authorization: 'Bearer my-jwt-token',
    },
});

const query = `{
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}`;

client.request(query).then(data => {
    console.log(data)
})
.catch((err) => console.log(err));