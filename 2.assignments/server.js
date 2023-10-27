var express = require('express');
const { graphqlHTTP } = require('express-graphql');
const PORT = process.env.PORT || 4040;
const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID, GraphQLInt } = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User', 
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    village: { type: GraphQLString }
  },
});

const VillagerCountsType = new GraphQLObjectType({
  name: 'VillagerCounts', 
  fields: {
    name1Count: { type: GraphQLInt }, 
    name2Count: { type: GraphQLInt }  
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'Query', 
  fields: {
    usersByVillages: {
      type: new GraphQLList(UserType),
      resolve: (_, __, ___) => {
        return users.filter(user => user.village === 'name 1' || user.village === 'name 2');
      },
    },
    villagerCounts: {
      type: VillagerCountsType,
      resolve: (_, __, ___) => {
        const name1Count = users.filter(user => user.village === 'name 1').length;
        const name2Count = users.filter(user => user.village === 'name 2').length;
        return { name1Count, name2Count }; 
      },
    },
  },
});

const users = [
  { id: 1, name: 'Ramu', village: 'name 1' },
  { id: 2, name: 'Lakshmana', village: 'name 1' },
  { id: 3, name: 'HANUMA', village: 'name 2' },
  { id: 4, name: 'Sita', village: 'name 3' },
];

const schema = new GraphQLSchema({
  query: RootQuery,
});

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true, 
}));

app.listen(PORT, () => console.log(`Express GraphQL Server Now Running On localhost:${PORT}/graphql`));
