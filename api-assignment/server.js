// implement QraphQL endpoint that will retrieve address & email from the response of https://jsonplaceholder.typicode.com/users
//Implement QraphQL endpoint that will retrieve unique addresses & emails from the response of https://jsonplaceholder.typicode.com/users


const express = require('express');
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLList } = require('graphql');
const axios = require('axios');
const app = express();

const AddressType = new GraphQLObjectType({
    name: 'Address',
    fields: {
      street: { type: GraphQLString },
      suite: { type: GraphQLString },
      city: { type: GraphQLString },
      zipcode: { type: GraphQLString },
    },
  });
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLInt },
    name: {type: GraphQLString},
    email: { type: GraphQLString },
    address: { type: AddressType }
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return axios.get(`https://jsonplaceholder.typicode.com/users`)
          .then((response) => response.data);
      },
    },
    uniqueEmail:{
        type: new GraphQLList(GraphQLString),
        resolve(users){
            if (!users) {
                return []; 
              }
            const uniqueEmails = [...new Set(users.map((user)=> user.email))];
            return uniqueEmails;
        }
    },
    uniqueAddresses: {
        type: new GraphQLList(AddressType),
        resolve(users) {
            if (!users) {
                return []; // Return an empty array or handle the error gracefully
              }
          const uniqueAddresses = [...new Map(users.map((user) => [user.address.street, user.address])).values(),];
          return uniqueAddresses;
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


const PORT = process.env.PORT || 4051

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

