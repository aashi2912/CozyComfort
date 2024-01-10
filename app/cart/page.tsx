"use client";
import CartItem from "@/components/CartItem";
import Loading from "@/components/Loading";
import { formatPrice } from "@/helpers/utils";
import useCartStore from "@/store/useCartStore";
import { Link } from "@chakra-ui/next-js";
import { Button, Container, Divider, Flex, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const Page = () => {
    const { cart, loading } = useCartStore();
    const queryClient = useQueryClient();
    const subTotalPrice = useMemo(() => cart?.reduce((prev, curr) => prev + curr.totalPrice, 0), [cart]);
    const mutation = useMutation<any, any, any>({
        mutationKey: [`add-update-cart-item`],
        mutationFn: async ({ productId, quantity }) => {
            console.log(productId, quantity);
            const response = await fetch(`/api/cart/add-update`, {
                method: "POST",
                body: JSON.stringify({ productId, quantity }),
                headers: {
                    'content-type': "application/json"
                }
            })
            return response.json();
        },
        onSettled: () => {
            queryClient.refetchQueries({
                queryKey: ["cart"],
                exact: true,
            });
        },
        onSuccess() {

        },
    })

    const { mutateAsync: checkoutMutateAsync, isPending: checkoutPending, isError } = useMutation({
        mutationKey: [`checkout-session`],
        mutationFn: async () => {
            const response = await fetch(`api/orders/place`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json'
                }
            })
            return response.json();
        }
    })

    if (loading) {
        return <Loading />
    }

    if (cart?.length === 0) {
        return (
            <Container maxW={"container.xl"} >
                <Flex mt={5} justifyContent={"center"} flexDir={"column"}>
                    <Text sx={{
                        letterSpacing: "var(--spacing)",
                        color: "var(--clr-grey-3)",
                        fontSize: "2rem",
                        textAlign: "center",
                    }}>
                        Your cart is empty...
                    </Text>
                    <Button as={Link} href={`/products`} size="sm"
                        mx="auto"
                        sx={{
                            color: "var(--clr-white)",
                            backgroundColor: "var(--clr-primary-5)",
                            lineHeight: 1.25,
                            letterSpacing: "var(--spacing)",
                            textTransform: "capitalize",
                            borderRadius: "var(--radius)",
                            borderColor: "transparent",
                            width: "fit-content",
                            paddingY: 5,
                            _hover: {
                                color: "var(--clr-white)",
                                backgroundColor: "var(--clr-primary-5)",
                                textDecoration: "none"
                            },
                        }}>
                        Shop Now
                    </Button>
                </Flex>

            </Container>
        )
    }

    return (
        <>
            <Container maxW={"container.xl"} mb={5}>
                <Flex justifyContent={"space-between"} my={3} flexDirection={{ base: "column", md: "row" }}>
                    <Text sx={{
                        letterSpacing: "var(--spacing)",
                        color: "var(--clr-grey-3)",
                        fontSize: "2rem",
                        textAlign: "center",
                    }}>
                        Your Cart
                    </Text>
                    <Button as={Link} href={`/products`} size="sm"
                        mx={{ base: "auto", md: 0 }}
                        sx={{
                            color: "var(--clr-white)",
                            backgroundColor: "var(--clr-primary-5)",
                            lineHeight: 1.25,
                            letterSpacing: "var(--spacing)",
                            textTransform: "capitalize",
                            borderRadius: "var(--radius)",
                            borderColor: "transparent",
                            width: "fit-content",
                            paddingY: 5,
                            _hover: {
                                color: "var(--clr-white)",
                                backgroundColor: "var(--clr-primary-5)",
                                textDecoration: "none"
                            },
                        }}>
                        Continue Shopping
                    </Button>
                </Flex>
                <Flex>
                    <Flex flex={3}>
                        <Text
                            as={"h5"}
                            sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                                color: "var(--clr-primary-1)",
                                lineHeight: 1.25,
                                letterSpacing: "var(--spacing)",
                                mb: 0,
                                pb: 0,
                                fontSize: "1rem",
                            }}
                        >
                            PRODUCT
                        </Text>
                    </Flex>
                    <Flex flex={1} justifyContent={"center"} display={{ base: "none", md: "flex" }}>
                        <Text
                            as={"h5"}
                            sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                                color: "var(--clr-primary-1)",
                                lineHeight: 1.25,
                                letterSpacing: "var(--spacing)",
                                mb: 0,
                                pb: 0,
                                fontSize: "1rem",
                            }}
                        >
                            QUANTITY
                        </Text>
                    </Flex>
                    <Flex flex={1} justifyContent={"flex-end"}>
                        <Text
                            as={"h5"}
                            sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                                color: "var(--clr-primary-1)",
                                lineHeight: 1.25,
                                letterSpacing: "var(--spacing)",
                                mb: 0,
                                pb: 0,
                                fontSize: "1rem",
                            }}
                        >
                            TOTAL
                        </Text>
                    </Flex>
                </Flex>
                <Divider my={2} />
                {cart && cart.map((item, index) => (
                    <CartItem key={index} item={item} index={index} mutation={mutation} />
                ))}
                <Divider my={2} />
                <Flex justifyContent={"flex-end"} flexDirection={"column"}>
                    <Flex justifyContent={"flex-end"}>
                        <Text
                            as={"h5"}
                            sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                                color: "var(--clr-grey-3)",
                                lineHeight: 1.25,
                                letterSpacing: "var(--spacing)",
                                mb: 0,
                                pb: 0,
                                fontSize: "1rem",
                            }}>
                            Sub Total:
                        </Text>
                        <Text
                            as={"h5"}
                            sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                                color: "var(--clr-grey-3)",
                                lineHeight: 1.25,
                                letterSpacing: "var(--spacing)",
                                mb: 0,
                                pb: 0,
                                fontSize: "1rem",
                            }}
                        >
                            {formatPrice(subTotalPrice, 2)}
                        </Text>
                    </Flex>
                    <Button
                        type="button"
                        ml="auto"
                        onClick={async () => {
                            const stripe = await stripePromise;
                            const response = await checkoutMutateAsync();
                            const stripeResponse = await stripe?.redirectToCheckout({
                                sessionId: response?.checkoutId
                            })
                            if (stripeResponse?.error) {

                            }
                        }}
                        isLoading={checkoutPending}
                        sx={{
                            w: "fit-content",
                            marginTop: 2,
                            textAlign: "center",
                            fontWeight: 700,
                            color: "var(--clr-primary-10)",
                            backgroundColor: "var(--clr-primary-5)",
                            borderColor: "transparent",
                            borderRadius: "var(--radius)",
                            letterSpacing: "var(--spacing)",
                            fontSize: "1rem",
                            padding: "0.35rem 0.75rem",
                            transition: "var(--transition)",
                            _hover: {
                                backgroundColor: "var(--clr-primary-7)",
                                color: "var(--clr-primary-1)",
                            },
                        }}
                    >
                        Proceed to checkout
                    </Button>
                </Flex>
            </Container >
        </>
    )
}

export default Page;