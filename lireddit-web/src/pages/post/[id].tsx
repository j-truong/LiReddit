import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient"
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { withApollo } from "../../utils/withApollo";


const Post = ({}) => {
    const {loading, data, error} = useGetPostFromUrl()

    if (loading) {
        return (
            <Layout>
                <div>loading...</div>
            </Layout>
        )
    }
    if (error) {
        return (
            <Layout>
                <div>{error.message}</div>
            </Layout>
        )
    }
    if (!data?.post) {
        return (
            <Layout>
                <Box>could not find post</Box>
            </Layout>
        )
    }

    return (
        <Layout>
          <Heading mb={4}>{data.post.title}</Heading>
          <Box mb={4}>{data.post.text}</Box>
          <EditDeletePostButtons
            id={data.post.id}
            creatorId={data.post.creator.id}
          />
        </Layout>
      );
}

//export default withUrqlClient(createUrqlClient, {ssr: true})(Post);

//export default Post;

export default withApollo({ ssr: true })(Post);