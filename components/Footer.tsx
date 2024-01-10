import { Box, Flex, Text } from "@chakra-ui/react";

export default function Footer() {
    return (
        <Flex
            minH="5rem"
            alignItems={"center"}
            justifyContent={"center"}
            backgroundColor={"var(--clr-black)"}
            marginTop={"auto"}
        >
            <Text
                color={"var(--clr-white)"}
                lineHeight={1.25}
                textTransform="none"
                fontWeight={400}
                margin={"0.1rem"}
            >
                &copy; {new Date().getFullYear()}
                <Box as="span" color="var(--clr-primary-5)">
                    {" "}Cozy Comfort{" "}
                </Box>
                All rights reserved.
            </Text>
        </Flex>
    )
}