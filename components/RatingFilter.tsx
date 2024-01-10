import { Box, Flex, Icon, Text, chakra } from "@chakra-ui/react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

const RatingFilter = ({
  searchParams,
  handleChange,
  handleRoute,
}: {
  searchParams: any;
  handleChange: any;
  handleRoute: any;
}) => {
  return (
    <>
      <Box>
        <Text
          as={"h5"}
          fontWeight="bold"
          fontSize="1rem"
          marginBottom={"0.5rem"}
          color="var(--clr-grey-1)"
        >
          Ratings
        </Text>
        {[4, 3, 2, 1].map((rating) => (
          <Flex
            key={rating}
            alignItems={"center"}
            role="button"
            color={
              searchParams.has("ratings") &&
              Number(searchParams.get("ratings")) === rating
                ? "yellow.500"
                : "yellow.400"
            }
            _hover={{
              color: "yellow.500",
            }}
            onClick={() => {
              const search = handleChange(searchParams, "ratings", rating);
              handleRoute(`/products?${search}`);
            }}
          >
            <Rating value={rating} />
            <Text
              fontSize={"0.9rem"}
              p={0}
              mb={0}
              ml={2}
              sx={{
                color: "var(--clr-grey-4)",
                _hover: {
                  color: "var(--clr-grey-3)",
                },
              }}
            >
              & above
            </Text>
          </Flex>
        ))}
      </Box>
    </>
  );
};

const Rating = ({ value }: { value: number }) => {
  return (
    <>
      <Flex columnGap={1}>
        {value >= 1 ? (
          <RatingIcon as={BsStarFill} />
        ) : value >= 0.5 ? (
          <RatingIcon as={BsStarHalf} />
        ) : (
          <RatingIcon as={BsStar} />
        )}
        {value >= 2 ? (
          <RatingIcon as={BsStarFill} />
        ) : value >= 1.5 ? (
          <RatingIcon as={BsStarHalf} />
        ) : (
          <RatingIcon as={BsStar} />
        )}
        {value >= 3 ? (
          <RatingIcon as={BsStarFill} />
        ) : value >= 2.5 ? (
          <RatingIcon as={BsStarHalf} />
        ) : (
          <RatingIcon as={BsStar} />
        )}
        {value >= 4 ? (
          <RatingIcon as={BsStarFill} />
        ) : value >= 3.5 ? (
          <RatingIcon as={BsStarHalf} />
        ) : (
          <RatingIcon as={BsStar} />
        )}
        {value >= 5 ? (
          <RatingIcon as={BsStarFill} />
        ) : value >= 4.5 ? (
          <RatingIcon as={BsStarHalf} />
        ) : (
          <RatingIcon as={BsStar} />
        )}
      </Flex>
    </>
  );
};
const RatingIcon = chakra(Icon, {
  baseStyle: {
    boxSize: 4,
  },
});

export default RatingFilter;
