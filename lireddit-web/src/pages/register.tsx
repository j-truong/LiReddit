import React from "react";
import {Formik, Form} from "formik";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { withApollo } from "../utils/withApollo";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [register] = useRegisterMutation();
    return (
        <Wrapper variant="small">
            <Formik 
                initialValues={{email:"", username:"", password:""}}
                onSubmit={async (values, { setErrors }) => {
                    console.log("here 3")
                    console.log(values);
                    const response = await register({variables: {options: values}});
                    console.log("is user there",response.data );
                    
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors));
                    } else if (response.data?.register.user) {
                        // worked
                        //console.log(response.data.register.user);
                        router.push("/");
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="username"
                            label="Username"
                        />
                        <Box mt={4}>
                            <InputField
                                name="email"
                                placeholder="email"
                                label="email"
                            />
                        </Box>
                        <Box mt={4}>
                            <InputField
                                name="password"
                                placeholder="password"
                                label="Password"
                                type="password"
                            />
                        </Box>
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            color="teal"
                            >
                                register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
      );
};

//export default withUrqlClient(createUrqlClient)(Register);

//export default Register;

export default withApollo({ ssr: false })(Register);