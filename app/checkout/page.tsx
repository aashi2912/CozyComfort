"use client";
import { Flex, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.replace('/products');
        }, 5 * 1000)
    }, [router]);


    return (
        <>
            <Flex justifyContent={"center"} w={"full"} flexDirection={"column"} mt={10} color="var(--clr-grey-3)" textAlign="center">
                {searchParams.get("status") === 'success' &&
                    <>
                        <Text sx={{
                            fontWeight: "bold",
                            letterSpacing: 1.2,
                            fontSize: "2rem",

                        }}>
                            Thank you for placing an order!!!
                        </Text>
                        <Text fontSize={"0.8rem"}>You will be redirecting shortly...</Text>
                    </>

                }
            </Flex >
        </>
    )
}

export default Page;