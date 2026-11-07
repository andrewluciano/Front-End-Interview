/* eslint-disable react-hooks/rules-of-hooks */
import { Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { LoadingPaginas } from "./Styles";

import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/material";

const ProtectedRouteContent = ({ children }: { children: React.ReactNode }) => {
  try {
    const { user, isLoading } = useAuth();

    console.log("user", user);

    if (isLoading) {
      return (
        <LoadingPaginas
          container
          size={{ sm: 12 }}
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "20%" }}>
            <LinearProgress />
          </Box>
        </LoadingPaginas>
      );
    }

    if (user) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    console.log(error);
    return (
      <AuthProvider>
        <ProtectedRouteContent children={children} />
      </AuthProvider>
    );
  }
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <ProtectedRouteContent children={children} />;
};
