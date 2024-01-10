"use client";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import Loading from "@/components/Loading";
import { formatPrice } from "@/helpers/utils";
import { useEffect, useState } from "react";
import { AddIcon, MinusIcon, } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { BsShareFill, BsStarFill } from "react-icons/bs";
import PageHero from "@/components/PageHero";
import { signIn, useSession } from "next-auth/react";

const Page = () => {
  const { id } = useParams();
  const toast = useToast();
  const { status: loggedInStatus } = useSession();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, status, error } = useQuery({
    queryKey: [`product-${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
      return response.json();
    },
    retry: 5,
    retryDelay: 3000,
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
  });

  useEffect(() => {
    if (data) {
      document.title = `Cozy Comfort - ${data?.product?.name}`;
    }
  }, [data]);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [`add-cart-${id}`],
    mutationFn: async () => {
      await fetch(`/api/cart/add-update`, {
        method: "POST",
        body: JSON.stringify({
          productId: id,
          quantity,
        }),
      });
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: ["cart"],
        exact: true,
      });
    },
    onSuccess: () => {
      toast({
        title: `Item added to basket`,
        duration: 3000,
        status: "success"
      })
    },
    onError: () => {
      toast({
        title: "Some error occurred.",
        description: "please try again later.",
        duration: 3000,
        status: "error"
      })
    }
  });

  if (status === "error" || error) {
    router.back();
  }

  if (status === "pending") {
    return <Loading />;
  }

  const { product } = data;

  const handleQuantityChange = (value: number) => {
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddCart = async () => await mutateAsync()

  return (
    <>
      <PageHero page={`products`} title={`${product?.name}`} />
      <Container maxW={"container.xl"}>
        <Box mt={5}>
          <Button
            type="button"
            size="sm"
            sx={{
              textTransform: "capitalize",
              fontWeight: 400,
              boxShadow: "sm",
              padding: "1rem 1rem",
              letterSpacing: "var(--spacing)",
              borderRadius: "var(--radius)",
              transition: "var(--transition)",
              color: "var(--clr-primary-10)",
              backgroundColor: "var(--clr-primary-5)",
              borderColor: "transparent",
              lineHeight: 1.5,
              fontSize: "1rem",
              _hover: {
                color: "var(--clr-grey-1)",
                backgroundColor: "var(--clr-primary-7)",
                textDecoration: "none",
              },
            }}
            onClick={() => router.back()}
          >
            Back to Products
          </Button>
        </Box>
        <Flex
          my={10}
          columnGap={{ base: 0, md: 10 }}
          rowGap={{ base: 5, md: 0 }}
          mx={{ base: 5, md: 0 }}
          flexDirection={{ base: "column", md: "row" }}
          justifyContent={{ base: "center", md: "flex-start" }}
        >
          <Image
            src={product?.images[0]}
            alt={product?.name}
            maxW={{ base: "100%", md: "45%" }}
            position={{ base: "initial", md: "sticky" }}
            top={"10"}
            loading="lazy"
          />
          <Flex flexDirection={"column"} w="full" h="full">
            <HStack>
              <Heading
                sx={{
                  lineHeight: 1,
                  fontSize: "2rem",
                  textTransform: "capitalize",
                  color: "var(--clr-grey-1)",
                  letterSpacing: "var(--spacing)",
                  marginBottom: "0.75rem",
                  fontWeight: "500",
                }}
              >
                {product?.name}
              </Heading>
              <Icon
                role="button"
                color={"var(--clr-grey-3)"}
                as={BsShareFill}
                ml={"auto"}
                onClick={async () => {
                  let data = {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
                    title: product?.name,
                  };
                  //@ts-ignore
                  if (navigator.canShare) {
                    await navigator.share(data);
                  } else {
                    toast({
                      title: `link copied.`,
                      status: "success",
                      duration: 3000,
                      colorScheme: "blue",
                      isClosable: true,
                      position: "bottom",
                      variant: "left-accent",
                    });
                    await navigator.clipboard.writeText(data?.url);
                  }
                }}
              />
            </HStack>
            <HStack mb={3} mt={1}>
              <Badge
                width={"-moz-fit-content"}
                height={"fit-content"}
                borderRadius={"var(--radius)"}
                px={2}
                py={1}
                colorScheme={
                  product?.rating >= 4
                    ? "green"
                    : product?.rating >= 3
                      ? "yellow"
                      : "red"
                }
              >
                {product?.rating}
                <Icon
                  ml={1}
                  w="inherit"
                  verticalAlign={"middle"}
                  as={BsStarFill}
                />
              </Badge>
              <Badge
                as={Link}
                href={`/products?category=${product?.category?._id}`}
                w={"fit-content"}
                colorScheme="blue"
                borderRadius={"var(--radius)"}
                px={2}
                py={1}
                _hover={{
                  textDecoration: "none",
                }}
              >
                {product?.category?.name}
              </Badge>
            </HStack>
            <Text
              sx={{
                fontSize: "1.3rem",
                lineHeight: 1.25,
                fontWeight: "bold",
                marginBottom: "0.75rem",
                letterSpacing: "var(--spacing)",
                color: "var(--clr-primary-5)",
              }}
            >
              {formatPrice(product?.price, 2)}
            </Text>

            <Box mb={5} mt={2}>
              <Text mb={1} color={"var(--clr-grey-3)"} fontSize={"0.8rem"}>
                Quantity
              </Text>
              <Flex
                h="10"
                maxW={"32"}
                border={"1.2px solid var(--clr-grey-3)"}
                borderRadius={"var(--radius)"}
                alignItems={"center"}
              >
                <IconButton
                  aria-label="Decrease quantity"
                  bgColor={"transparent"}
                  h="inherit"
                  _hover={{
                    bgColor: "transparent",
                  }}
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <MinusIcon />
                </IconButton>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  h="inherit"
                  w="full"
                  textAlign={"center"}
                  border="none"
                  outline={"none"}
                  _focusVisible={{
                    outline: "none",
                  }}
                />
                <IconButton
                  aria-label="Increase quantity"
                  bgColor={"transparent"}
                  h="inherit"
                  _hover={{
                    bgColor: "transparent",
                  }}
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <AddIcon />
                </IconButton>
              </Flex>
            </Box>
            <Button
              size={"sm"}
              isLoading={isPending}
              loadingText={`Please wait...`}
              w={{ base: "full", md: "fit-content" }}
              px={10}
              py={1}
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
              onClick={async () => {
                if (loggedInStatus === "unauthenticated") {
                  await signIn();
                } else {
                  handleAddCart();
                }
              }}
            >
              Add to cart
            </Button>

            <Text
              sx={{
                maxW: "45em",
                color: "var(--clr-grey-3)",
                marginBottom: "1.25rem",
                marginTop: "1rem",
              }}
            >
              {product?.description}
            </Text>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

export default Page;
