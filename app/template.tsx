"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useCartStore from "@/store/useCartStore";
import "./globals.css";


export default function Index({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { updateCart, setLoading } = useCartStore();

  const {
    data: cart,
    status: cartStatus,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await fetch(`/api/cart`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      });

      return response.json();
    },
    enabled: status === 'authenticated',
    refetchOnReconnect: true,
    retry: 5,
  })

  useEffect(() => {
    if (cartStatus === 'pending') {
      setLoading(true);
    }
    else if (cartStatus === 'success') {
      updateCart(cart?.order?.orderItems);
      setLoading(false);
    }
    else {
      setLoading(false);
    }
  }, [cart, cartStatus, updateCart, setLoading]);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <Box className="app">
      <Navbar session={session} status={status} />
      {children}
      <Footer />
    </Box>
  );
}
