import React, { useEffect } from "react";
import {Formik, Form} from "formik";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRouter } from "next/router";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

export const CreatePost: React.FC<{}> = ({}) => {
    const [createPost] = useCreatePostMutation();
    useIsAuth();
    const router = useRouter();
    return (
        <Layout variant='small'>
            <Formik 
                initialValues={{title:"", text:""}}
                onSubmit={async (values) => {
                    const { errors } = await createPost({ variables: {input: values } });
                    if (!errors) {
                        router.push("/");
                    }
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
                                create post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}

//export default withUrqlClient(createUrqlClient)(CreatePost);

//export default CreatePost; 

export default withApollo({ ssr: false })(CreatePost);