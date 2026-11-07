import { type FC } from "react";
import { Breadcrumbs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Container } from "./Styles";

// interface IMyProps {}

export const RastroPagina: FC = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  return (
    <Container size={{ sm: 12, xs: 12 }} sx={{ padding: "0 5px" }}>
      <Breadcrumbs aria-label="breadcrumb" separator="»">
        <Link color="inherit" to="/Dashboard-Medico">
          Home
        </Link>
        {segments?.map((value: string, index: number) => {
          const to = `/${segments.slice(0, index + 1).join("/")}`;
          const label = value.replace("-", " ");
          const isLast = index === segments.length - 1;
          return isLast ? (
            <span>{label}</span>
          ) : (
            <Link key={`${value}-${index}`} color="inherit" to={to}>
              {label}
            </Link>
          );
        })}

        {/* <Typography sx={{ color: "text.primary" }}>
          {props?.current}
        </Typography> */}
      </Breadcrumbs>
    </Container>
  );
};
