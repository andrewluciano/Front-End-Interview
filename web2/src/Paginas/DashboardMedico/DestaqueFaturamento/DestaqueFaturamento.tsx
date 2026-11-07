import { useState, type FC } from "react";
import Grid from "@mui/material/Grid";

import { GridCustom, TabListCustom } from "./Styles";

import TabContext from "@mui/lab/TabContext";

import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";

import { BlocoFaturamento } from "./Componentes/BlocoFaturamento";
// import { BarraProgresso } from "@/Componentes/BarraProgresso";

export const DestaqueFaturamento: FC = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <GridCustom sx={{ gap: "10px" }} container size={{ sm: 12 }}>
        <TabContext value={value}>
          <Grid size={{ sm: 12 }} spacing={2} sx={{}}>
            <TabListCustom
              onChange={handleChange}
              aria-label="Status do Faturamento"
              variant="fullWidth"
              scrollButtons
              allowScrollButtonsMobile
              sx={{ borderRadius: "5px", p: 0, minHeight: "40px" }}
            >
              <Tab sx={{ p: 0 }} label="A Pagar" value="1" />
              <Tab sx={{ p: 0 }} label="Glosado" value="2" />
              <Tab sx={{ p: 0 }} label="Pagos" value="3" />
            </TabListCustom>
          </Grid>
          <TabPanel
            value="1"
            sx={{ width: "100%", flexDirection: "column", p: 0.5 }}
          >
            <BlocoFaturamento tipo="a-pagar" />
          </TabPanel>
          <TabPanel
            value="2"
            sx={{ width: "100%", flexDirection: "column", p: 0.5 }}
          >
            <BlocoFaturamento tipo="glosado" />
          </TabPanel>
          <TabPanel
            value="3"
            sx={{ width: "100%", flexDirection: "column", p: 0.5 }}
          >
            <BlocoFaturamento tipo="pagos" />
          </TabPanel>
        </TabContext>
      </GridCustom>
    </>
  );
};
