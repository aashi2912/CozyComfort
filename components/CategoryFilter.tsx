import { Box, Select, Text } from "@chakra-ui/react";

const CategoryFilter = ({
  searchParams,
  categories,
  handleChange,
  handleRoute,
}: {
  searchParams: any;
  categories: any;
  handleChange: any;
  handleRoute: (search: string) => void;
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
          Category
        </Text>
        <Select
          name={"category"}
          size={"sm"}
          style={{ textTransform: "capitalize" }}
          value={searchParams.get("category") ?? ""}
          onChange={(event) => {
            let search = handleChange(
              searchParams,
              "category",
              event.target.value
            );
            handleRoute(`/products?${search}`);
          }}
        >
          {categories &&
            categories?.length > 0 &&
            categories.map(
              (
                c: { name: string; value: string | undefined },
                index: number
              ) => (
                <Box
                  as={"option"}
                  value={c.value}
                  key={index}
                  textTransform={"capitalize"}
                >
                  {c.name}
                </Box>
              )
            )}
        </Select>
      </Box>
    </>
  );
};

export default CategoryFilter;
