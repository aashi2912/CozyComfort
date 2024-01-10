import PageHero from "@/components/PageHero";
import { Container, Flex, Image, Box, Text } from "@chakra-ui/react";

export default function Index() {
  return (
    <>
      <PageHero page={"about"} />
      <Container maxW={"container.xl"}>
        <Flex
          marginY={50}
          columnGap={50}
          direction={{ base: "column", md: "row" }}
        >
          <Image
            src="/hero-bcg.jpeg"
            alt="VS Furnitures"
            sx={{
              width: "100%",
              height: "500px",
              borderRadius: "var(--radius)",
              objectFit: "cover",
              display: "block",
            }}
          />
          <Box>
            <Text
              sx={{
                fontSize: "2.5rem",
                textTransform: "capitalize",
                color: "var(--clr-grey-1)",
                lineHeight: 1.5,
                fontWeight: "bold",
                letterSpacing: "var(--spacing)",
              }}
            >
              Our Story
            </Text>
            <Text
              sx={{
                width: "6rem",
                border: "2px solid var(--clr-primary-5)",
              }}
            ></Text>
            <Text
              sx={{
                marginTop: 5,
                fontSize: "1rem",
                lineHeight: 2,
                color: "var(--clr-grey-5)",
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo,
              praesentium beatae, quis soluta eum provident itaque laborum
              veniam alias nesciunt autem commodi fugiat fuga quos ipsum
              consequuntur maxime. Saepe, delectus.
            </Text>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
