import { formatPrice } from "@/helpers/utils";
import { Product } from "@/types/product";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  return (
    <Box maxW={"300px"} w="full">
      <Image
        loading="lazy"
        src={product?.images[0]}
        alt={product?.name}
        height={"175px"}
        display="block"
        width={"100%"}
        objectFit="cover"
        transition={"var(--transition)"}
        borderRadius={"var(--radius)"}
        cursor="pointer"
        _hover={{
          opacity: 0.5,
          transform: "scale(1.1)",
        }}
        onClick={() => router.push(`/products/${product?._id}`)}
      />

      <Flex
        marginTop={"1rem"}
        justifyContent={"space-between"}
        alignItems="center"
      >
        <Text
          sx={{
            color: "var(--clr-grey-1)",
            fontSize: "1rem",
            fontWeight: 400,
            letterSpacing: "var(--spacing)",
            textTransform: "capitalize",
            lineHeight: "1.25",
          }}
        >
          {product?.name}
        </Text>
        <Text
          sx={{
            color: "var(--clr-primary-5)",
            letterSpacing: "var(--spacing)",
          }}
        >
          {formatPrice(product?.price, 2)}
        </Text>
      </Flex>
    </Box>
  );
};
export default ProductCard;
