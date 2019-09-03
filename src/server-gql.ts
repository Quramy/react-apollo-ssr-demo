import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Int!
    imageUrlSmall: String!
    imageUrlLarge: String!
    comments: [String]!
    relatedProducts(count: Int!): [Product]!
  }
  type Query {
    hello: String
    products(count: Int!): [Product]!
  }
`;

const server = new ApolloServer({
  typeDefs,
  mocks: {
    Int: () => ~~(Math.random() * 10000),
  },
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`GraphQL server ready at http://localhost:4000${server.graphqlPath}`)
);
