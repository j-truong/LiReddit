import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { Router, useRouter } from "next/router";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { usePostQuery, useUpdatePostMutation } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetIntId } from "../../../utils/useGetIntId";
import { useGetPostFromUrl } from "../../../utils/useGetPostFromUrl";
import { useIsAuth } from "../../../utils/useIsAuth";
import { withApollo } from "../../../utils/withApollo";

export const EditPost: React.FC<{}> = ({}) => {
    const intId = useGetIntId();
    const {loading, data, error} = usePostQuery({
        //pause: intId === -1,
        skip: intId === -1,
        variables: {
            id: intId
        }
    })
    const [updatePost] = useUpdatePostMutation();
    const router = useRouter(); 

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
        <Layout variant='small'>
            <Formik 
                initialValues={{title: data.post.title, text:data.post.text}}
                onSubmit={async (values) => {
                    await updatePost( { variables: {id: intId, ...values } } );
                    router.push("/");
                    //router.back();
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="title"
                            placeholder="title"
                            label="title"
                        />
                        <Box mt={4}>
                            <InputField
                                textarea
                                name="text"
                                placeholder="text..."
                                label="Body"
                            />
                        </Box>
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            color="teal"
                            >
                                update post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}

// export default withUrqlClient(createUrqlClient)(EditPost);

//export default EditPost;

export default withApollo({ ssr: false })(EditPost);