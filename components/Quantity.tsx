import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import { Flex, IconButton, Input } from "@chakra-ui/react"

const Quantity = ({ item, isPending, handleChange }: { item: any, isPending: boolean, handleChange: ({ productId, quantity }: { productId: string, quantity: number }) => void }) => {
    return (
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
                isLoading={isPending}
                onClick={() =>
                    handleChange({ productId: item?.productId?._id, quantity: item?.quantity - 1 })
                }
            >
                <MinusIcon />
            </IconButton>
            <Input
                type="number"
                value={item?.quantity}
                onChange={(e) =>
                    handleChange({ productId: item?.productId?._id, quantity: Number(e.target.value) })
                }
                h="inherit"
                w="full"
                textAlign={"center"}
                border="none"
                outline={"none"}
                _focusVisible={{
                    outline: "none",
                }}
                isDisabled={isPending}
                min={0}
            />
            <IconButton
                aria-label="Increase quantity"
                bgColor={"transparent"}
                h="inherit"
                _hover={{
                    bgColor: "transparent",
                }}
                isLoading={isPending}
                onClick={() =>
                    handleChange({ productId: item?.productId?._id, quantity: item?.quantity + 1 })
                }
            >
                <AddIcon />
            </IconButton>
        </Flex>
    )
}

export default Quantity;