import { NextPage } from "next";
import router, { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import {Formik, Form} from "formik";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { withApollo } from "../../utils/withApollo";

export const ChangePassword: NextPage<{token: string}> = () => {
    const router = useRouter();
    const [changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');
    return (
        <Wrapper variant="small">
        <Formik 
            initialValues={{ newPassword: "" }}
            onSubmit={async (values, { setErrors }) => {
                const response = await changePassword({
                    variables: {
                        newPassword: values.newPassword, 
                        token: 
                            typeof router.query.token === "string" ? router.query.token : "",
                    }
                })

                console.log("response", response.data);
                
                if (response.data?.changePassword.errors) {
                    const errorMap = toErrorMap(response.data.changePassword.errors);
                    if ("token" in errorMap) {
                        setTokenError(errorMap.token);
                    }
                    setErrors(errorMap);
                } else if (response.data?.changePassword.user) {
                    router.push("/");
                }
            }}>
            {({ isSubmitting }) => (
                <Form>
                    <InputField
                        name="newPassword"
                        placeholder="new password"
                        label="New Password"
                        type="password"
                    />
                    {tokenError ? (
                        <Flex>
                            <Box mr={2} style={{color:'red'}}>{tokenError}</Box>
                            <NextLink href="/forgot-password">
                                <Link>go forget it again</Link>
                            </NextLink>
                        </Flex>
                        ) : null}
                    <Button
                        mt={4}
                        type="submit"
                        isLoading={isSubmitting}
                        color="teal"
                        >
                            change password
                    </Button>
                </Form>
            )}
        </Formik>
    </Wrapper> 
    );
}

//export default withUrqlClient(createUrqlClient, {ssr: false}) (ChangePassword);

//export default ChangePassword;

export default withApollo({ ssr: false })(ChangePassword);