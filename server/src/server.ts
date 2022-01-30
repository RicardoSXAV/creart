import 'reflect-metadata';
import express from 'express';
import 'dotenv/config';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import './database';
import { UserResolver } from './resolvers/UserResolver';
import { AuthResolver } from './resolvers/AuthResolver';

async function runServer() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [UserResolver, AuthResolver],
  });

  const apolloServer = new ApolloServer({ schema });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Server running on port 4000!');
  });
}

runServer();
