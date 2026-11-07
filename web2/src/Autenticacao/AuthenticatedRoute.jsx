import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

import { Loader } from "@/Componentes/Loader";

import { getUser } from "./authService";

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const [user, setUser] = useState(null);
  const [buscou, setBuscou] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => {
        setLoading(false);
        setBuscou(true);
      });
  }, []);

  return (
    <>
      <Loader data-testid="loader" loading={loading} />
      {buscou && (
        <Route
          {...rest}
          render={(props) =>
            user !== null ? <Component {...props} /> : <Redirect to="/login" />
          }
        />
      )}
    </>
  );
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.func,
};

export default AuthenticatedRoute;
