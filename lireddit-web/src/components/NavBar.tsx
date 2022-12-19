import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import {useRouter} from "next/router";
import { useApolloClient } from "@apollo/client";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const router = useRouter();
    const [logout, {loading: logoutFetching}] = useLogoutMutation();
    const apolloClient = useApolloClient();
    //const [logout, { fetching: logoutFetching }] = useLogoutMutation();
    const { data, loading } = useMeQuery({
        skip: isServer(),
        //skip: isServer(),
        //pause: true,
    });
    let body = null;
    
    // data is loading
    if (loading) {

    // user not logged in 
    } else if (!data?.me) {
        body = (<>
            <NextLink href="/login">
                <Link color="white" mr={2}>login</Link>
            </NextLink>
            <NextLink href="/register">
                <Link color="white">register</Link>
            </NextLink>
        </>)
    // user is logged in
    } else {
        body = (
                <Flex align="center">
                    <NextLink href="/create-post">
                        <Button as={Link} mr={4}>
                            create post
                        </Button>
                    </NextLink>
                <Box color="white" mr={2}>{data.me.username}</Box>
                <Button 
                    color="white" 
                    variant="link"
                    onClick={async () => {
                        await logout({});
                        //router.reload();
                        await apolloClient.resetStore();
                    }}
                    isLoading={logoutFetching}
                    >logout</Button>
            </Flex>
        )
    }

    return (
        <Flex zIndex={2} position="sticky" top={0} bg="tan" p={4}>
            <Flex align="center" flex={1} m="auto" maxW={800}>
                <NextLink href="/">
                    <Link>
                        <Heading>LiReddit</Heading>
                    </Link>
                </NextLink>
                <Box ml={"auto"}>
                    {body}
                </Box>
            </Flex>
        </Flex>
    );
};
