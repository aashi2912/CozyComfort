import { prices } from "@/helpers/constants";
import { formatPrice } from "@/helpers/utils";
import { Box, Text } from "@chakra-ui/react";
const PriceFilter = ({
  searchParams,
  handleChange,
  handleRoute,
}: {
  searchParams: any;
  handleChange: any;
  handleRoute: (search: string) => void;
}) => {
  const isActivePrice = (
    min: number | undefined,
    max: number | undefined,
    searchParams: any
  ) => {
    let searchMin = searchParams.get("minPrice");
    let searchMax = searchParams.get("maxPrice");
    if (searchMax && searchMin) {
      return searchMax == max && searchMin == min;
    } else if (searchMax) {
      return searchMax == max;
    } else if (searchMin) return searchMin == min;
    return false;
  };
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
          Price
        </Text>
        {prices.map(({ min, max }, index: number) => {
          return (
            <Text
              key={index}
              sx={{
                color: `${
                  isActivePrice(min, max, searchParams)
                    ? "var(--clr-grey-3)"
                    : "var(--clr-grey-4)"
                }`,
                fontWeight: `${isActivePrice(min, max, searchParams) && "600"}`,
                _hover: {
                  color: "var(--clr-grey-3)",
                  fontWeight: "600",
                },
              }}
              fontSize={"0.9rem"}
              role="button"
              mb={0}
              onClick={() => {
                let search = handleChange(searchParams, "maxPrice", max);
                search = handleChange(search, "minPrice", min);
                handleRoute(`/products?${search}`);
              }}
            >
              {min && max && `${formatPrice(min)} - ${formatPrice(max)}`}
              {!min && max && `under ${formatPrice(max)}`}
              {!max && min && `${formatPrice(min)} above`}
            </Text>
          );
        })}
      </Box>
    </>
  );
};

export default PriceFilter;
