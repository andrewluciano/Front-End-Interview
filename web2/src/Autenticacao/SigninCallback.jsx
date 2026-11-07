import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import { ReactLoadingCuston } from "@/Componentes/Loader";
import { genericSigninCallback, getUser } from "./authService";

const SignCallback = () => {
  const [user, setUser] = useState(undefined);
  const [redirecionar, setRedirecionar] = useState(false);
  const [urlRedirecionamento, setUrlRedirecionamento] = useState("/");

  useEffect(() => {
    const url = (window && window.location && window.location.href) || "";
    setUrlRedirecionamento(localStorage.getItem("historico_navegacao"));

    genericSigninCallback(url)
      .then(() => getUser().then((loggedUser) => setUser(loggedUser)))
      .catch(() => setRedirecionar(true));
  }, []);

  if (!user) {
    return (
      <ReactLoadingCuston
        isLoading={true}
        bgOpacity={1}
        positionFixed
        showLabel={false}
      />
    );
  }

  if (redirecionar) {
    return <Redirect to="/login" push />;
  }

  return <Redirect to={urlRedirecionamento} push />;
};

export default SignCallback;

// return (
//   <>
//     {/* eslint-disable-next-line no-nested-ternary */}
//     {!user ? (
//       <ReactLoadingCuston isLoading={true} bgOpacity={1} positionFixed />
//     ) : redirecionar ? (
//       <Redirect to="/login" push />
//     ) : (
//       <Redirect to={urlRedirecionamento} push />
//     )}
//   </>
// );
