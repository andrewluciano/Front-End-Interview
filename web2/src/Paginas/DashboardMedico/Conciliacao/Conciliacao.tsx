import { type FC } from "react";
import Grid from "@mui/material/Grid";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { Typography } from "@mui/material";
import { GridCustom } from "./Styles";
// import CheckIcon from "@mui/icons-material/Check";
// import { useNavigate } from "react-router-dom";
import {theme} from "@/stitches.config";

export const Conciliacao: FC = () => {
  // const navigate = useNavigate();

  return (
    <Grid
      sx={{
        p: 0,
        borderRadius: "0px",
        display: { xs: "none", md: "flex" },
        alignItems: "flex-end",
        mb:1,
      }}
      container
      size={{ sm: 3, xs: 12 }}
    >
      <Grid
        container
        size={{ sm: 12 }}
        sx={{ height: "30px", mb: "2px", display:'none' }}
        alignItems={"flex-start"}
      >
        <HandshakeIcon sx={{ width: "30px" }} />
        <Typography variant="h6">Conciliação</Typography>
      </Grid>
      <GridCustom
        container
        size={{ sm: 12 }}
        alignItems="center"
        justifyContent={"flex-start"}
        sx={{ backgroundColor: theme.colors.PaperColor.value, boxShadow: "1", borderRadius: "4px", b:0, pt: "8px", backgroundImage:'none'}}
      >
        <Grid container size={{ sm: 12, xs: 12 }} sx={{ gap: "10px", p:1}}>
          {/* <Typography variant="caption">
            Efetue a concilição entre agendas e faturamentos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ px: 2, py: 0.2 }}
            startIcon={<CheckIcon />}
            onClick={() => navigate("/Conciliacao")}
          >
            Conciliar
          </Button> */}

            <Grid container sx={{justifyContent:'flex-end'}} size={{sm:12, xs:12}}>
              <Typography variant="caption" sx={{textTransform:'uppercase', width:'100%', textAlign:'right'}}>
                Saldo a receber
              </Typography>
              
              <Typography variant="caption" sx={{fontStyle:'italic', width:'100%', textAlign:'right', fontSize:'0.65rem', color:'#999'}}>
                próximos 30 dias
              </Typography>
            </Grid>
            <Grid container sx={{alignItems:'flex-end', justifyContent:'flex-end'}} size={{sm:12, xs:12}}>
              <Typography variant="caption" sx={{textTransform:'uppercase', mb:0.6, mr:0.5}}>
                R$
              </Typography>              
              <Typography variant="h4" sx={{fontWeight:'bold'}}>
                31.211,23
              </Typography>
            </Grid>



        </Grid>
      </GridCustom>
    </Grid>
  );
};
