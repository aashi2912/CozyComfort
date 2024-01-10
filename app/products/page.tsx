"use client";

import Filter from "@/components/Filter";
import Loading from "@/components/Loading";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { limit } from "@/helpers/constants";
import { Product } from "@/types/product";
import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories, status: categoryStatus } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(`/api/categories`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
      return response.json();
    },
    retry: 3,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 60,
    select(data) {
      const categories = data?.categories.map((row: any) => ({
        name: row?.name,
        value: row?._id,
      }));
      return [{ name: "All", value: "" }, ...categories];
    },
    enabled: true,
  });

  const { data, fetchNextPage, status, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [`products-${searchParams.toString()}`],
      queryFn: async ({ pageParam }) => {
        let queryString = searchParams.toString();
        queryString = updateSearchParms(queryString, "pageNo", pageParam);
        queryString = updateSearchParms(queryString, "limit", limit);
        const response = await fetch(`/api/products?${queryString}`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        });
        return response.json();
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage?.totalCount / limit > lastPage?.pageNo)
          return Number(lastPage?.pageNo) + 1;
        return undefined;
      },
      staleTime: 1000 * 60 * 5,
      retry: 5,
    });

  const handleChange = (search: any, key: any, value: any) =>
    updateSearchParms(search, key, value);

  const handleRoute = (path: string) => router.push(path);

  return (
    <>
      <Box mb={10}>
        <PageHero page={"products"} />
        <Container maxWidth={"container.xl"} marginTop={{ base: 5, md: 20 }}>
          <Flex
            width="100%"
            columnGap={5}
            direction={{ base: "column", md: "row" }}
          >
            <Flex flex={1} flexDirection={"column"} rowGap={5}>
              <Filter
                categories={categories}
                categoryStatus={categoryStatus}
                handleChange={handleChange}
                handleRoute={handleRoute}
                searchParams={searchParams}
              />
            </Flex>
            <Flex
              flex={4}
              justifyContent={{ base: "center", md: "flex-start" }}
            >
              {status === "pending" ? (
                <Loading />
              ) : status === "error" ? (
                <Flex
                  h="full"
                  w="full"
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Text as="h3" fontSize={"1.2rem"}>
                    Something went wrong. Please try again later.
                  </Text>
                </Flex>
              ) : (
                <>
                  <Flex flexDirection={"column"} h="full" w="full">
                    {data?.pages && data?.pages[0].products?.length === 0 && (
                      <>
                        <Text
                          h="full"
                          w="full"
                          textAlign={"center"}
                          fontSize={"1.2rem"}
                          color="var(--clr-grey-3)"
                        >
                          No Products Found...
                        </Text>
                      </>
                    )}
                    <Flex
                      wrap="wrap"
                      rowGap={"2rem"}
                      columnGap="1.5rem"
                      marginTop={{ base: 5, md: 0 }}
                      justifyContent={{ base: "center", md: "flex-start" }}
                    >
                      {data?.pages &&
                        data?.pages.map((page) => (
                          <>
                            {page?.products &&
                              page?.products?.map(
                                (product: Product, index: number) => (
                                  <ProductCard product={product} key={index} />
                                )
                              )}
                          </>
                        ))}
                    </Flex>
                    {isFetchingNextPage && <Loading />}
                    {!isFetchingNextPage && hasNextPage && (
                      <Box mx={"auto"}>
                        <Button
                          onClick={() => fetchNextPage()}
                          disabled={!hasNextPage || isFetchingNextPage}
                          size="sm"
                          w="fit-content"
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
                          Load More
                        </Button>
                      </Box>
                    )}
                  </Flex>
                </>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>
    </>
  );
}

const updateSearchParms = (params: any, key: string, value: any) => {
  let search = new URLSearchParams(params);
  if (value == undefined || value == null || value == "") {
    search.delete(key);
  } else {
    search.set(key, value);
  }
  return search.toString();
};
