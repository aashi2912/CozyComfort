import { Box, Button, Checkbox } from "@chakra-ui/react";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import RatingFilter from "./RatingFilter";

const Filter = ({
  handleChange,
  handleRoute,
  searchParams,
  categories,
  categoryStatus,
}: {
  handleChange: (params: any, key: string, value: any) => string;
  handleRoute: (path: string) => void;
  searchParams: any;
  categories: any[] | undefined;
  categoryStatus: "pending" | "success" | "error";
}) => {
  return (
    <>
      {/* Category */}
      {categoryStatus === "success" && (
        <CategoryFilter
          searchParams={searchParams}
          categories={categories}
          handleChange={handleChange}
          handleRoute={handleRoute}
          key={"categories"}
        />
      )}
      {/* Price */}
      <PriceFilter
        handleChange={handleChange}
        searchParams={searchParams}
        handleRoute={handleRoute}
        key={"prices"}
      />
      {/* Rating */}
      <RatingFilter
        handleChange={handleChange}
        handleRoute={handleRoute}
        searchParams={searchParams}
        key={"rating"}
      />
      {/* FreeShipping */}
      <Box>
        <Checkbox
          size={"md"}
          isChecked={searchParams.get("freeShipping") === "true"}
          onChange={(event) => {
            const search = handleChange(
              searchParams,
              "freeShipping",
              event.target.checked ? true : null
            );
            handleRoute(`/products?${search}`);
          }}
          sx={{
            color: "var(--clr-grey-4)",
            "& : span": {
              fontSize: "0.9rem",
            },
          }}
        >
          Free Shipping
        </Checkbox>
      </Box>
      {/* Clear */}
      <Box>
        <Button
          size="sm"
          type="button"
          sx={{
            backgroundColor: "var(--clr-red-dark)",
            color: "var(--clr-white)",
            borderRadius: "var(--radius)",
            padding: "0.25rem 0.5rem",
            letterSpacing: "var(--spacing)",
            _hover: {
              backgroundColor: "var(--clr-red-dark)",
              color: "var(--clr-white)",
            },
          }}
          onClick={() => handleRoute(`/products`)}
        >
          Clear Filters
        </Button>
      </Box>
    </>
  );
};

export default Filter;
