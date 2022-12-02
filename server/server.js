const express = require('express');
// import ApolloServer
const {ApolloServer} = require('apollo-server-express');
const path = require('path');
// import our typeDefs and resolvers
const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({ 
  // create a new Apollo server and pass in our schema data
  typeDefs, 
  resolvers, 
  context: authMiddleware 
});
// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app });
// Initialize the Apollo server
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
//npm i
//cd server ->npm run seed
//cd server -> npm run start