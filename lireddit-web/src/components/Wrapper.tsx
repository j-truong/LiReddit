// import { Box } from "@chakra-ui/core";

//import { Box } from "@chakra-ui/layout"

import { Box } from "@chakra-ui/react"

export type WrapperVariant = "small" | "regular"

interface WrapperProps {
    children: React.ReactNode;
    variant?: "small" | "regular"
}

export const Wrapper: React.FC<WrapperProps> = ({ 
        children,
        variant = "regular",
    }) => {
    return (
        <Box 
            mt={8} 
            mx="auto" 
            maxW={variant == "regular" ? "800px" : "400px"} 
            w="100%">
            {children}
        </Box>
        );
};