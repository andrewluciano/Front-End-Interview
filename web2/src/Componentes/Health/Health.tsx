import { type FC, useEffect, useState } from "react";
import { baseURL } from "@/APIS/BaseApis";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Grid, Tooltip, Typography } from "@mui/material";

export const HealthStatus: FC = () => {
  const [status, setStatus] = useState<"ok" | "not-ok" | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const url = `${baseURL}/health`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        const resultStatus =
          typeof data === "string"
            ? data
            : typeof data?.status === "string"
              ? data.status
              : "";

        if (isMounted) {
          setStatus(resultStatus === "ok" ? "ok" : "not-ok");
        }
      })
      .catch(() => {
        if (isMounted) setStatus("not-ok");
      });

    const urlVersion = `${baseURL}/version`;
    axios
      .get(urlVersion)
      .then((response) => {
        if (isMounted) {
          setVersion(response.data?.version);
        }
      })
      .catch(() => {
        // Ignora erros de versão
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const fillColor = status === "ok" ? "green" : "gray";

  return (
    <Tooltip title={status === "ok" ? "Apis Ok" : "Apis NOK"}>
      <Grid
        container
        alignItems="center"
        sx={{
          position: "absolute",
          bottom: "0px",
          backgroundColor: "#fff",
          px: 1,
          borderRadius: "4px 4px 0 0",
          boxShadow: 1,
        }}
      >
        <FavoriteIcon
          sx={{
            width: "10px",
            height: "10px",
            // bottom: "5px",
            marginRight: "5px",
            fill: fillColor,
          }}
        />
        <Typography
          sx={{ color: "#333", fontSize: "0.65rem" }}
          variant="caption"
        >
          versão {version}
        </Typography>
      </Grid>
    </Tooltip>
  );
};
