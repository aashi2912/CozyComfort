"use client";
import { Container, Flex, Heading, Text } from "@chakra-ui/react"

const Page = () => {
    return (
        <>
            <Container maxW={"container.xl"} h="full">
                <Flex h="full" w="full" mt={10} justifyContent={"center"}>
                    <Heading color={"var(--clr-grey-3)"}>Something went wrong...</Heading>
                </Flex>
            </Container></>
    )
}

export default Page;