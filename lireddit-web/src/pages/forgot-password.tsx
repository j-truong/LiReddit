import { Flex, Button, Box } from "@chakra-ui/react";
import Link from "next/link";
import router from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { toErrorMap } from "../utils/toErrorMap";
import {Formik, Form} from "formik";
import NextLink from "next/link";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from 'next-urql';
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false);
    const [forgotPassword] = useForgotPasswordMutation();
    return (
        <Wrapper variant="small">
            <Formik 
                initialValues={{ email: "" }}
                onSubmit={async (values) => {
                    await forgotPassword({variables: values});
                    setComplete(true);
                }}
            >
                {({ isSubmitting }) => 
                    complete ? (
                        <Box>
                            if an account with that email exists, we sent you an email
                        </Box>
                    ) : (
                    <Form>
                        <InputField
                            name="email"
                            placeholder="email"
                            label="Email"
                            type="email"
                        />
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            color="teal"
                            >
                                Forgot password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
      );
}

//export default withUrqlClient(createUrqlClient)(ForgotPassword);

//export default ForgotPassword;

export default withApollo({ ssr: false })(ForgotPassword);
