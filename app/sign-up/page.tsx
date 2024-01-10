"use client";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Icon,
  InputAddon,
  Text,
  InputGroup,
  InputRightElement,
  Button,
  IconButton,
  useBoolean,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { signIn, useSession } from "next-auth/react";
import { Suspense, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import * as yup from "yup";
import { BiHide, BiShow } from "react-icons/bi";
import { redirect } from "next/navigation";

export default function Page() {
  const [loading, setLoading] = useBoolean(false);
  const { data: session, status } = useSession();
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is Required")
      .matches(/^[a-zA-Z ]+$/, "Should Only contain Alphabets and space"),
    email: yup.string().required("Email is Required").email("Invalid Email"),
    password: yup.string().required("Password is Required"),
    confirmPassword: yup
      .string()
      .required("Confirm Password is Required")
      .oneOf(
        [yup.ref("password")],
        "Confirm Password and Password are not same"
      ),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await handleRegistration(values);
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const { values, touched, errors, handleChange, handleSubmit } = formik;

  const handleRegistration = async (values: {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const signInResponse = await signIn("credentials", {
        email: values?.email,
        password: values?.password,
        redirect: true,
        callbackUrl: "/",
      });
      if (signInResponse?.error) {
        redirect("/");
      }
    }
  };

  return (
    <>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        maxW={"full"}
        sx={{
          padding: 5,
          borderRadius: "var(--radius)",
          marginTop: 2,
        }}
      >
        <Suspense fallback={<Loading />}>
          <Flex
            as="form"
            //@ts-ignore
            onSubmit={(e) => handleSubmit(e)}
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
              Sign Up
            </Text>
            <FormControl
              id="name"
              isInvalid={Boolean(errors.name && touched.name)}
            >
              <FormLabel htmlFor="name" color={"var(--clr-black)"}>
                Name
              </FormLabel>
              <Input
                name="name"
                type="text"
                value={values.name}
                placeholder="Enter name..."
                onChange={handleChange}
                borderRadius={"var(--radius)"}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
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
                  placeholder="Enter password..."
                  value={values.password}
                  onChange={handleChange}
                  borderRadius={"var(--radius)"}
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
            <FormControl
              id="confirmPassword"
              isInvalid={Boolean(
                errors.confirmPassword && touched.confirmPassword
              )}
              color={"var(--clr-black)"}
            >
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter confirm password..."
                  value={values.confirmPassword}
                  onChange={handleChange}
                  borderRadius={"var(--radius)"}
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
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              isLoading={loading}
              width={"full"}
              variant="outline"
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
              Sign Up
            </Button>
            <Text
              sx={{
                color: "var(--clr-grey-3)",
                textTransform: "capitalize",
              }}
            >
              Already have an account?{" "}
              <Text
                as={Link}
                href="/sign-in"
                color="var(--clr-primary-3)"
                _hover={{
                  textDecoration: "none",
                }}
              >
                Sign-in
              </Text>{" "}
              here
            </Text>
          </Flex>
        </Suspense>
      </Flex>
    </>
  );
}
