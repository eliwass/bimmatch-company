import { from, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createUploadLink({
  uri: `${process.env.REACT_APP_APIS_URL}/gq/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = window.sessionStorage.getItem("__bauhub_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        search: {
          keyArgs: false,
          merge(existing, incoming, { args }) {
            if (args) {
              const { from = 0 } = args;
              if (!from || !existing) {
                // if from is 0 (start position of pagination)
                return incoming;
              }
              const results =
                (existing.hits &&
                  existing.hits.results &&
                  existing.hits.results.slice(0)) ||
                [];
              const incomingResults =
                (incoming.hits && incoming.hits.results) || [];
              for (let i = 0; i < incomingResults.length; ++i) {
                results[from + i] = incomingResults[i];
              }
              return {
                facets: incoming.facets,
                hits: {
                  total: incoming.hits.total,
                  results: results,
                },
              };
            } else {
              // It's unusual (probably a mistake) for a paginated field not
              // to receive any arguments, so you might prefer to throw an
              // exception here, instead of recovering by appending incoming
              // onto the existing array.
              throw Error("[Bimmatch] Apollo Client merge issue");
            }
          },
        },
      },
    },
    SearchFacet: {
      // Search Facets are always new for new search
      fields: {
        buckets: {
          keyArgs: false,
          merge(existing, incoming) {
            // Search Facets are always new for new search, so just replace with incoming buckets
            return incoming;
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  connectToDevTools: process.env.NODE_ENV !== "production",
});
