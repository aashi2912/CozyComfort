"use client";

import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <Box paddingY={50}>
        <Container maxW={"container.xl"}>
          <Flex direction={"row"} justifyContent={"space-around"}>
            <Box maxW={{ base: "100%" }}>
              <Heading
                sx={{
                  fontSize: "3rem",
                  marginBottom: "2rem",
                  lineHeight: 1,
                  letterSpacing: "var(--spacing)",
                  textTransform: "capitalize",
                  color: "var(--clr-grey-1)",
                }}
              >
                Design Your Comfort Zone
              </Heading>
              <Text
                maxWidth={20}
                sx={{
                  color: "var(--clr-grey-5)",
                  lineHeight: 2,
                  maxW: "45em",
                  mb: "2rem",
                  fontSize: "1.25rem",
                }}
              >
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Ducimus quibusdam vel quia quisquam repellat quos, qui nihil
                error obcaecati ea aliquam cumque fuga expedita recusandae, ex
                unde quod aut sequi.
              </Text>
              <Button
                w="fit-content"
                as={Link}
                href={"/products"}
                sx={{
                  textTransform: "capitalize",
                  letterSpacing: "var(--spacing)",
                  borderRadius: "var(--radius)",
                  transition: "var(--transition)",
                  color: "var(--clr-primary-10)",
                  bgColor: "var(--clr-primary-5)",
                  borderColor: "transparent",
                  fontWeight: 400,
                  fontSize: "1rem",
                  textAlign: "center",
                  _hover: {
                    color: "var(--clr-primary-1)",
                    bgColor: "var(--clr-primary-7)",
                    textDecoration: "none",
                  },
                }}
              >
                Shop Now
              </Button>
            </Box>
            <Box display={{ base: "none", md: "block" }}>
              <Image
                src={"/hero-bcg-2.789918645915c8acb36f.jpeg"}
                height={"100%"}
                width="400px"
              />
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
}
