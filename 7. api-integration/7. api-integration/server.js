const express = require('express');
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLList } = require('graphql');
const axios = require('axios');
const app = express();
// Define types for Post and User
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    totalPosts:{type: GraphQLInt}
  },
  totalPosts: {
    type: GraphQLInt,
    resolve(parent) {
      return axios
        .get(`https://jsonplaceholder.typicode.com/posts?userId=${parent.id}`)
        .then((response) => response.data.length);
    },
  },
});
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Query to get a single post by ID
    post: {
      type: PostType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return axios.get(`https://jsonplaceholder.typicode.com/posts/${args.id}`)
          .then((response) => response.data);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve() {
        return axios.get('https://jsonplaceholder.typicode.com/posts')
          .then((response) => response.data);
      },
    },
    searchPosts: {
      type: new GraphQLList(PostType),
      args: {
        query: { type: GraphQLString },
      },
      resolve(parent, args) {
        return axios.get('https://jsonplaceholder.typicode.com/posts')
          .then((response) => {
            const allPosts = response.data;
            return allPosts.filter((post) => {
              const query = args.query.toLowerCase();
              return (
                post.title.toLowerCase().includes(query) ||
                post.body.toLowerCase().includes(query) 
              );
            });
          });
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return axios.get(`https://jsonplaceholder.typicode.com/users/${args.id}`)
          .then((response) => response.data);
      },
    },
  },
});
const schema = new GraphQLSchema({
  query: RootQuery,
});


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true, // Enable the GraphiQL UI for testing
}));


const PORT = process.env.PORT || 4050

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

