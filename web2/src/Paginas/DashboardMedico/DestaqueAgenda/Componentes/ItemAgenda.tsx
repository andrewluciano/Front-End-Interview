import { CardContent, Grid, Typography } from "@mui/material";
import { type FC } from "react";
import { CardCustom } from "./Styles";

import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import WorkIcon from "@mui/icons-material/Work";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";

import { formatCustomDate } from "@/helpers/format";
import { CutText } from "@/Componentes/CutText";
import { useNavigate } from "react-router-dom";

export const ItemAgenda: FC = ({ dados }) => {
  const navigate = useNavigate();

  const AbreModalInfoProcedimentos = (id: string) => {
    navigate(`/procedimentos?Procedimento=${id}`, { replace: true });
  };
  return (
    <Grid
      container
      sx={{
        p: 2,
        backgroundColor: "#f5f5f5",
        borderRadius: "5px",
        minWidth: { xs: "250px", md: "auto" },
        boxShadow: "1",
      }}
      alignContent={"flex-start"}
      size={{ sm: 12 }}
      spacing={0.5}
    >
      <CardCustom
        sx={{
          width: "100%",
          padding: "0",
          height: "35px",
          boxShadow: "none",
          backgroundColor: "transparent",
        }}
      >
        <CardContent
          sx={{
            padding: "0px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "0.85rem" }}>
            {formatCustomDate(new Date(dados?.date))}
          </Typography>
        </CardContent>
      </CardCustom>
      {dados?.appointments.map((dadosI, indexI) => (
        <CardCustom
          key={indexI}
          sx={{ width: "100%", padding: "0", cursor: "pointer" }}
          type={dadosI?.color}
          onClick={() => AbreModalInfoProcedimentos(dadosI?.relationed_id)}
        >
          <CardContent
            sx={{
              padding: "12px 12px 12px 12px !important",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid
              container
              size={{ sm: 12 }}
              sx={{
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <QueryBuilderIcon sx={{ width: "14px" }} />
              {/* <Typography
                component="div"
                variant="caption"
                sx={{ fontSize: "0.8rem" }}
              >
                <strong>{dadosI?.time}</strong> &nbsp;
              </Typography> */}

              <PersonIcon sx={{ width: "14px" }} />
              <Typography
                component="div"
                variant="caption"
                sx={{ fontSize: "0.65rem" }}
              >
                <CutText
                  value={dadosI?.patient_name}
                  props={[]}
                  contagem={50}
                  position={undefined}
                  cont={0}
                />
              </Typography>
            </Grid>
            <Grid
              container
              size={{ sm: 12 }}
              sx={{
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <WorkIcon sx={{ width: "14px" }} />
              <Typography
                component="div"
                variant="caption"
                sx={{ fontSize: "0.65rem" }}
              >
                <CutText
                  value={dadosI?.procedure}
                  props={[]}
                  contagem={50}
                  position={undefined}
                  cont={0}
                />
              </Typography>
            </Grid>
            <Grid
              container
              size={{ sm: 12 }}
              sx={{
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <PlaceIcon sx={{ width: "14px" }} />
              <Typography
                component="div"
                variant="caption"
                sx={{ fontSize: "0.65rem" }}
              >
                <CutText
                  value={dadosI?.local}
                  props={[]}
                  contagem={50}
                  position={undefined}
                  cont={0}
                />
              </Typography>
            </Grid>
          </CardContent>
        </CardCustom>
      ))}
    </Grid>
  );
};
