"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import * as yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import Loading from "@/components/Loading";
import { Link } from "@chakra-ui/next-js";
import { FcGoogle } from "react-icons/fc";
import { BiShow, BiHide } from "react-icons/bi";
import { google } from "@/helpers/constants";
export default function Page() {
  const searchParams = useSearchParams();
  const raiseToast = useToast();
  const [loading, setLoading] = useState(false);
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid Email"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await handleLogin(values);
    },
  });
  const handleLogin = async (values: any) => {
    setLoading(true);
    await signIn("credentials", {
      email: values?.email,
      password: values?.password,
      redirect: true,
      callbackUrl: searchParams.get("callbackUrl") ?? "/",
    });
    setLoading(false);
  };
  const handleSSOLogin = async (type: string) => {
    try {
      const response = await signIn(type, {
        redirect: false,
        callbackUrl: searchParams.get("callbackUrl") ?? "/",
      });
    } catch (error) {
      raiseToast({
        status: "error",
        description: "Error while login.",
      });
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const { values, touched, errors, handleChange, handleSubmit } = formik;
  return (
    <>
      <Box
        maxW={"full"}
        sx={{
          padding: 5,
          borderRadius: "var(--radius)",
          marginTop: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Flex
          as="form"
          //@ts-ignore
          onSubmit={handleSubmit}
          direction={"column"}
          justifyContent={"center"}
          rowGap={2}
          maxW={"sm"}
          flex={1}
        >
          <Text
            fontSize={"xx-large"}
            color="var(--clr-primary-1)"
            fontWeight={"400"}
            textAlign={"center"}
          >
            Sign In
          </Text>
          <FormControl
            id="email"
            isInvalid={Boolean(errors.email && touched.email)}
            color={"var(--clr-black)"}
          >
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter email..."
              borderRadius={"var(--radius)"}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl
            id="password"
            isInvalid={Boolean(errors.password && touched.password)}
            color={"var(--clr-black)"}
          >
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                placeholder="Enter password..."
                borderRadius={"var(--radius)"}
                onChange={handleChange}
              />
              <InputRightElement>
                <IconButton
                  size="sm"
                  backgroundColor={"var(--clr-white)"}
                  icon={showPassword ? <BiHide /> : <BiShow />}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="password"
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          {searchParams.has("error") &&
            <Text color={"red.400"}>
              Invalid login attempt.
            </Text>}
          <Button
            type="submit"
            isLoading={loading}
            width={"full"}
            variant="outline"
            spinnerPlacement="start"
            size={"sm"}
            sx={{
              marginTop: 3,
              textTransform: "capitalize",
              letterSpacing: "var(--spacing)",
              borderRadius: "var(--radius)",
              backgroundColor: "var(--clr-primary-5)",
              color: "var(--clr-primary-10)",
              fontSize: "1.2rem",
              fontWeight: "600",
              border: "transparent",
              transition: "var(--transition)",
              _hover: {
                backgroundColor: "var(--clr-primary-7)",
                color: "var(--clr-black)",
              },
            }}
          >
            Sign In
          </Button>
          <Divider />
          <Button
            type="button"
            colorScheme={"white"}
            leftIcon={<FcGoogle size="20" />}
            onClick={() => handleSSOLogin(google)}
            size={"sm"}
            sx={{
              textTransform: "capitalize",
              letterSpacing: "var(--spacing)",
              borderRadius: "var(--radius)",
              color: "var(--clr-primary-1)",
              fontSize: "1rem",
              fontWeight: "400",
              border: "1px solid var(--clr-primary-1)",
              transition: "var(--transition)",
            }}
          >
            Sign in with google
          </Button>
          <Text
            sx={{
              color: "var(--clr-grey-3)",
              textTransform: "capitalize",
            }}
          >
            Don&apos;t have an account?{" "}
            <Text as={Link} href="/sign-up" color="var(--clr-primary-3)">
              Sign-up
            </Text>{" "}
            here
          </Text>
        </Flex>
      </Box>
    </>
  );
}
