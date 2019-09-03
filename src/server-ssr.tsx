import React from "react";

import express from "express";
import { renderToString, renderToStaticMarkup } from "react-dom/server";

import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { ApolloProvider } from "@apollo/react-common";
import { getDataFromTree } from "@apollo/react-ssr";

import fetch from "node-fetch";

import AppComponent from "./component";

const app = express();

const Html = ({ content, state }: { content: string, state: any }) => (
  <html>
    <body>
      <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
      <script dangerouslySetInnerHTML={{
        __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
      }} />
    </body>
  </html>
);

app.use("/", async (req, res) => {
  const cache =  new InMemoryCache({ resultCaching: false });
  const client = new ApolloClient({
    link: createHttpLink({
      uri: "http://localhost:4000/graphql",
      fetch: fetch as any,
    }),
    cache,
  });

  const App = (
    <ApolloProvider client={client}>
      <AppComponent />
    </ApolloProvider>
  );

  await getDataFromTree(App);

  const content = renderToString(App);
  const initialState = client.extract();

  res
    .status(200)
    .end(`<!doctype html>\n${renderToStaticMarkup(<Html content={content} state={initialState} />)}`);
});

app.listen(4010 , () => console.log(
  `React SSR server is now running on http://localhost:4010`
));
