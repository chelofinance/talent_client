import {ApolloClient, InMemoryCache, TypedDocumentNode} from "@apollo/client";

export const getApolloClient = (uri: string) => {
  const cache = new InMemoryCache();
  return new ApolloClient({
    cache: cache,
    uri,
    queryDeduplication: false,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
};

export const makeQuery = async <T>(
  uri: string,
  query: TypedDocumentNode<unknown, unknown>,
  variables?: unknown
) => {
  const client = getApolloClient(uri);

  const res = await client.query<T>({
    query,
    variables,
  });

  return res.data;
};
