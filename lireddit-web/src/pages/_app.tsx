import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { AppProps } from 'next/app'
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, PaginatedPosts, RegisterMutation } from '../generated/graphql';
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client"
import { NextPageContext } from 'next';

// const client = new ApolloClient({
//   //uri: process.env.NEXT_PUBLIC_API_URL as string,
//   uri: "http://localhost:4000/graphql",
//   credentials: "include",
//   cache: new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           posts: {
//             keyArgs: [],
//             merge(
//               existing: PaginatedPosts | undefined,
//               incoming: PaginatedPosts
//             ) : PaginatedPosts {
//               return {
//                 ...incoming,
//                 posts: [...(existing?.posts || []), ...incoming.posts],
//               };
//             },
//           },
//         },
//       },
//     }
//   }),
// })

function MyApp({ Component, pageProps }: AppProps, ctx: NextPageContext) {
  return (
    //<ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
   //</ApolloProvider>
  )
}

export default MyApp
