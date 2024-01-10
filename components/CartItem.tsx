import { formatPrice } from "@/helpers/utils";
import { Flex, Image, Text } from "@chakra-ui/react";
import Quantity from "./Quantity";
import { DeleteIcon } from "@chakra-ui/icons";
import { UseMutationResult } from "@tanstack/react-query";

const CartItem = ({ item, index, mutation, }: { item: any, index: number, mutation: UseMutationResult<any, any, any, unknown> }) => {
    const { mutateAsync, isPending } = mutation;
    return (
        <>
            <Flex key={index} my={5}>
                <Flex flex={3}>
                    <Image
                        src={item?.productId?.images[0]}
                        alt={item?.productId?.name}
                        height={{ base: 45, md: 100 }}
                        width={{ base: 55, md: 150 }}
                    />
                    <Flex ml={5} flexDirection={"column"}>
                        <Text
                            as={"h5"}
                            fontSize={{ base: "0.8rem", md: "1rem" }}
                            sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                                color: "var(--clr-grey-3)",
                                lineHeight: 1.25,
                                letterSpacing: "var(--spacing)",
                                mb: 0,
                                pb: 0,
                            }}
                        >
                            {item?.productId?.name}
                        </Text>
                        <Text
                            as={"h6"}
                            fontSize={{ base: "0.7rem", md: "0.9rem" }}
                            sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                                color: "var(--clr-grey-3)",
                                lineHeight: 1.25,
                                letterSpacing: "var(--spacing)",
                                mb: 0,
                                pb: 0,
                                mt: 2
                            }}
                        >
                            {formatPrice(item?.unitPrice, 2)}
                        </Text>
                    </Flex>

                </Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} display={{ base: "none", md: "flex" }}>
                    <Quantity item={item} isPending={isPending} handleChange={async ({ productId, quantity }) => await mutateAsync({ productId, quantity })} />
                    <DeleteIcon ml={3} h="full" role="button" onClick={async () => {
                        await mutateAsync(
                            { productId: item?.productId?._id, quantity: 0 })
                    }} />
                </Flex>
                <Flex flex={1} justifyContent={"flex-end"} alignItems={"center"}>
                    <Text
                        ml={3}
                        as={"h5"}
                        fontSize={{ base: "1rem", md: "1.2rem" }}
                        sx={{
                            textTransform: "capitalize",
                            fontWeight: "bold",
                            color: "var(--clr-grey-3)",
                            lineHeight: 1.25,
                            letterSpacing: "var(--spacing)",
                            mb: 0,
                            pb: 0,
                        }}
                    >
                        {formatPrice(item?.totalPrice, 2)}
                    </Text>
                </Flex>
            </Flex>
            <Flex justifyContent={"center"} alignItems={"center"} display={{ base: "flex", md: "none" }} mt={2}>
                <Quantity item={item} isPending={isPending} handleChange={async ({ productId, quantity }) => await mutateAsync({ productId, quantity })} />
                <DeleteIcon ml={3} h="full" role="button" onClick={async () => {
                    await mutateAsync(
                        { productId: item?.productId?._id, quantity: 0 })
                }} />
            </Flex>
        </>
    )
}

export default CartItem;    