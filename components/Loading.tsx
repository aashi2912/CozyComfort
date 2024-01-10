import { Flex, Spinner } from "@chakra-ui/react";
export default function Loading() {
  return (
    <Flex justifyContent={"center"} alignItems={"center"} h={"full"} w={"full"}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="var(--clr-primary-2)"
        size="xl"
      />
    </Flex>
  );
}
