import {
  Flex,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link,
} from "@chakra-ui/react";

export default function PageHero({
  page = null,
  title = null,
}: {
  page?: string | null;
  title?: string | null;
}) {
  return (
    <>
      <Flex
        fontSize={{ base: "100%", md: "1.1rem" }}
        sx={{
          color: "var(--clr-primary-1)",
          backgroundColor: "var(--clr-primary-10)",
          width: "100%",
          alignItems: "center",
          fontWeight: "bold",
          minHeight: "50px",
          textTransform: "capitalize",
          overflow: "auto",
        }}
      >
        <Container maxW={"container.xl"}>
          <Breadcrumb>
            <BreadcrumbItem
              className="breadcrumb-item"
              textTransform={"capitalize"}
            >
              <BreadcrumbLink as={Link} href={"/"}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem
              isCurrentPage={title === null && page !== null}
              className={`breadcrumb-item ${
                Boolean(page !== null && title === null) ? "active" : ""
              }`}
              textTransform={"capitalize"}
            >
              <BreadcrumbLink as={Link} href={`/${page}`}>
                {page}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {title && (
              <BreadcrumbItem
                isCurrentPage={Boolean(title)}
                className={`breadcrumb-item ${
                  Boolean(page !== null && title !== null) ? "active" : ""
                }`}
                textTransform={"capitalize"}
              >
                <BreadcrumbLink as={Link} href={`/${title}`}>
                  {title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </Breadcrumb>
        </Container>
      </Flex>
    </>
  );
}
