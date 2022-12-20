import { createWithApollo } from "./createWithApollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedPosts } from "../generated/graphql";
import { NextPageContext } from "next";
import { isServer } from "./isServer";

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    credentials: "include",
    //uri: process.env.NEXT_PUBLIC_API_URL as string,
    uri: "http://localhost:4000/graphql",
    //uri: ["https://studio.apollographql.com", "http://localhost:4000/graphql"],
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
      "X-Forwarded-Proto": "https" 
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);