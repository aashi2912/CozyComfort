"use client";
import Loading from "@/components/Loading";
import { formatPrice } from "@/helpers/utils";
import { Link } from "@chakra-ui/next-js";
import { Box, Button, Container, Divider, Flex, HStack, Heading, Image, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const { data, status } = useQuery({
        queryKey: [`orders-history`, session?.user?.id],
        queryFn: async () => {
            const response = await fetch(`/api/order-history`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            });
            return response.json();
        },
        retry: 5,

    })

    if (status === 'pending') {
        return <Loading />
    }

    if (status === 'error') {
        router.push("/");
        return;
    }

    return (
        <>
            <Container maxW={"container.xl"}>
                {data && data?.orders?.length > 0 ? data?.orders?.map((item: any, index: number) => (
                    <OrderItem item={item} key={index} />
                )) :
                    <Flex h="full" w="full" mt={10} justifyContent={"center"} flexDirection={"column"}>
                        <Heading color={"var(--clr-grey-3)"} textAlign={"center"}>You have no orders...</Heading>
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
                }
            </Container >
        </>
    )
}

function OrderItem({ item }: { item: any }) {
    return (
        <>
            <Flex key={item?._id} flexDirection={"column"}
                rowGap={5}
                border="1px solid var(--clr-grey-9)"
                px={4}
                py={2}
                my={5}
                borderRadius="15px">
                <Box
                    sx={{
                        fontSize: "1.1rem",
                        color: "var(--clr-primary-1)",
                    }}
                >
                    <Stack
                        direction={{ base: "column", md: "row" }}
                        justifyContent={"space-between"}
                        fontSize={{ base: "smaller" }}
                    >
                        <Flex flexDirection={"column"}>
                            <Flex >
                                <Text
                                    display={"inline"}
                                    fontWeight={"bold"}
                                    textTransform={"capitalize"}
                                    pb={0}
                                    mb={0}
                                >
                                    Order Id:
                                </Text>
                                <Text mb={0}>{item?._id}</Text>
                            </Flex>
                            <Flex>
                                <Text
                                    display={"inline"}
                                    fontWeight={"bold"}
                                    textTransform={"capitalize"}
                                    mb={0}
                                >
                                    Order placed on:
                                </Text>
                                <Text mb={0}>
                                    {new Date(item?.createdAt).toLocaleString(undefined, { hourCycle: "h12" })}
                                </Text>
                            </Flex>
                        </Flex>
                        <HStack>
                            <Text
                                display={"inline"}
                                fontWeight={"bold"}
                                textTransform={"capitalize"}
                            >
                                Delivery Status:
                            </Text>
                            <Text fontWeight={"normal"}>{item?.isDelivered ? 'Delivered' : 'Not Delivered'}</Text>
                        </HStack>
                    </Stack>
                </Box>
                <Divider />
                <Box>
                    {/* Order Items */}
                    <Box>
                        {item?.orderItems.map((item: any, key: number) => {
                            return (
                                <>
                                    <Flex key={key}>
                                        <Image
                                            src={item?.productId?.images[0]}
                                            height={{ base: 50, md: 90 }}
                                            width={{ base: 50, md: 100 }}
                                            alt={item?.productId?.name}
                                        />
                                        <Flex flexDir={"column"} ml={5}>
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
                                                {item?.productId?.name}
                                            </Text>
                                            <Text
                                                sx={{
                                                    color: "var(--clr-primary-5)",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Price: <span>{formatPrice(item?.unitPrice, 2)}</span>
                                            </Text>
                                            <Text
                                                sx={{
                                                    color: "var(--clr-grey-5)",
                                                    letterSpacing: "var(--spacing)",
                                                    textTransform: "capitalize",
                                                    fontSize: 14,
                                                }}
                                            >
                                                Quantity: <span>{item.quantity}</span>
                                            </Text>
                                        </Flex>
                                        <Text ml="auto" fontWeight={"bold"} color={"var(--clr-grey-3)"}>
                                            {formatPrice(item?.totalPrice, 2)}
                                        </Text>
                                    </Flex>
                                </>
                            );
                        })}
                    </Box>
                    <Flex
                        justifyContent={{ base: "center", md: "space-between" }}
                        flexDirection={{
                            base: "column",
                            md: "row",
                        }}
                    >
                        {/* Address */}
                        {item?.shippingDetails &&
                            <Box>
                                <Text
                                    sx={{
                                        color: "var(--clr-primary-1)",
                                        fontWeight: "bold",
                                        textTransform: "capitalize",
                                        letterSpacing: "var(--spacing)",
                                        fontSize: "1rem"
                                    }}
                                >
                                    Shipping Address
                                </Text>
                                {item?.shippingDetails?.line1 && `${item?.shippingDetails?.line1}, `}
                                {item?.shippingDetails?.line2 && `${item?.shippingDetails?.line2}, `}
                                <br />
                                {item?.shippingDetails?.city && `${item?.shippingDetails?.city}, `}
                                {item?.shippingDetails?.state && `${item?.shippingDetails?.state}, `}
                                {item?.shippingDetails?.country && `${item?.shippingDetails?.country}, `}
                                {item?.shippingDetails?.postal_code && `${item?.shippingDetails?.postal_code}`}
                                <br />
                                {item?.phoneNumber && <a href={`tel: ${item?.phoneNumber}`} >{item?.phoneNumber}</a>}
                            </Box>}
                        {/* Total */}
                        <Box ml={{ base: 0, md: "auto" }} mt={{ base: 5, md: 0 }} >
                            <Text
                                sx={{
                                    color: "var(--clr-primary-1)",
                                    fontWeight: "bold",
                                    textTransform: "capitalize",
                                    letterSpacing: "var(--spacing)",
                                    fontSize: "1rem"
                                }}
                            >
                                Order Summary
                            </Text>
                            <SimpleGrid
                                columns={2}
                                sx={{
                                    columnGap: 2,
                                    color: "var(--clr-primary-1)",
                                    textTransform: "capitalize",
                                }}
                            >
                                <Text mb={0}>Item(s) total: </Text>
                                <Text mb={0}>{formatPrice(item?.subTotal, 2)}</Text>
                                <Text mb={0}>Shipping Charges: </Text>
                                <Text mb={0}>
                                    {formatPrice(item?.charges, 2)}
                                </Text>
                                <Text mb={0} fontWeight={"bold"}>Total: </Text>
                                <Text mb={0} fontWeight={"bold"}>
                                    {formatPrice(item?.total, 2)}
                                </Text>
                            </SimpleGrid>
                        </Box>
                    </Flex>
                </Box>
            </Flex >
        </>
    );
}

export default Page;