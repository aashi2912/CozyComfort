import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Container,
  Image,
  Icon,
  Flex,
  Text,
  Menu,
  MenuDivider,
  MenuList,
  MenuItem,
  MenuButton,
  Button,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerOverlay,
  DrawerCloseButton,
  Badge,
} from "@chakra-ui/react";
import type { Session, User } from "next-auth";
import { BsFillCartPlusFill } from "react-icons/bs";
import { FaUser, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { HamburgerIcon } from "@chakra-ui/icons";
import { signIn, signOut } from "next-auth/react";
import Loading from "./Loading";
import useCartStore from "@/store/useCartStore";
import { useRouter } from "next/navigation";

export default function Navbar({
  session,
  status,
}: {
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
}) {
  const { cart } = useCartStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };
  return (
    <>
      <Box backgroundColor={"var(--clr-grey-10)"}>
        <Container maxWidth={"full"}>
          <Flex
            height="5rem"
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box>
              <Link href={"/"}>
                <Image src={"/cozy-comfort-logo.svg"} alt="Cozy Comfort" width={"-moz-fit-content"} height={"45"} />
              </Link>
            </Box>
            <Icon
              display={{ base: "block", md: "none" }}
              as={HamburgerIcon}
              boxSize={10}
              sx={{
                cursor: "pointer",
                color: "var(--clr-grey-1)",
                transition: "var(--transition)",
              }}
              onClick={onOpen}
            />
            <MobileNavbar
              isOpen={isOpen}
              onClose={onClose}
              handleSignOut={handleSignOut}
              user={session?.user}
            />
            <Flex
              display={{ base: "none", md: "flex" }}
              sx={{
                color: "var(--clr-grey-3)",
                letterSpacing: "var(--spacing)",
                columnGap: 3,
                textTransform: "capitalize",
                justifyContent: "center",
              }}
            >
              <Link href={"/"} className="nav-links">
                Home
              </Link>
              <Link href={"/about"} className="nav-links">
                About
              </Link>
              <Link href={"/products"} className="nav-links">
                Products
              </Link>
            </Flex>
            {status === "loading" ? (
              <Loading />
            ) : session?.user ? (
              <Flex
                alignItems={"center"}
                display={{ base: "none", md: "flex" }}
                letterSpacing={"var(--spacing)"}
              >
                <Flex mr={4}>
                  <Icon as={BsFillCartPlusFill} display={{ base: "none", md: "block" }}
                    role="button"
                    color={"var(--clr-grey-3)"}
                    boxSize={5}
                    onClick={() => router.push(`/cart`)}
                  />
                  {cart && cart?.length > 0 &&
                    <Badge borderRadius={"full"}
                      position={"relative"}
                      right={2}
                      bottom={3}
                      colorScheme="green" fontSize="0.8em"
                    >
                      {cart?.length}
                    </Badge>
                  }
                </Flex>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <FaUser />
                  </MenuButton>
                  <Text ml={2} mb={0} _hover={{ textDecoration: "none" }}>
                    Welcome, {session?.user?.name}
                  </Text>
                  <MenuList>
                    <MenuItem as={Link} href={"/orders"}>
                      Orders
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            ) : (
              <Icon
                as={FaUserPlus}
                display={{ base: "none", md: "block" }}
                role="button"
                boxSize={5}
                onClick={async () =>
                  await signIn()
                }
              />
            )}
          </Flex>
        </Container>
      </Box >
    </>
  );
}

function MobileNavbar({
  isOpen,
  onClose,
  handleSignOut,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleSignOut: () => void;
  user: User | undefined;
}) {
  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} closeOnEsc>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <Flex
              sx={{
                color: "var(--clr-grey-3)",
                letterSpacing: "var(--spacing)",
                columnGap: 3,
                textTransform: "capitalize",
                flexDirection: "column",
                height: "full",
              }}
            >
              <Link href={"/"} onClick={onClose} className="nav-links">
                Home
              </Link>
              <Link href={"/about"} onClick={onClose} className={"nav-links"}>
                About
              </Link>
              <Link
                href={"/products"}
                onClick={onClose}
                className={"nav-links"}
              >
                Products
              </Link>
              {user ? (
                <>
                  <Link href="/cart" className="nav-links" onClick={onClose}>
                    Cart
                  </Link>
                  <Link
                    href="/orders"
                    className="nav-links"
                    onClick={onClose}
                  >
                    Orders
                  </Link>
                  <Link
                    href={"/sign-out"}
                    className={"nav-links"}
                    style={{ marginTop: "auto" }}
                    onClick={handleSignOut}
                  >
                    <Icon as={FaUserMinus} marginRight={3} />
                    Log Out
                  </Link>
                </>
              ) : (
                <Link
                  href={"/sign-in"}
                  className={"nav-links"}
                  style={{ marginTop: "auto" }}
                  onClick={onClose}
                >
                  <Icon as={FaUserPlus} marginRight={3} />
                  Log In
                </Link>
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
