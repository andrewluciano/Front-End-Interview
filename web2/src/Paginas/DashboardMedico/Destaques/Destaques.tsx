import { useEffect, useRef, useState, type FC } from "react";
import Grid from "@mui/material/Grid";

import { useQuery } from "react-query";
import Typography from "@mui/material/Typography";
import Api from "../API/Bullets";

import { Ambulance } from "@phosphor-icons/react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

import { GridCustom } from "./Styles";
import { CardsProcedimentos } from "@/Componentes/CardsProcedimentosDashboard";

// import { BarraProgresso } from "@/Componentes/BarraProgresso";

export const Destaques: FC = () => {
  // const queryClient = useQueryClient();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeEdge, setActiveEdge] = useState<"left" | "right" | "middle">(
    "left",
  );

  const DashboardMedicoBullets = useQuery(
    ["DashboardMedicoBullets"],
    async () => {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetDashboardMedicoBullets();
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = DashboardMedicoBullets.isLoading;

  const hasContent = DashboardMedicoBullets?.data?.content ?? [];

  const PaymentSkeleton = () => (
    <Grid
      container
      size={{ sm: 12 }}
      sx={{
        height: "80px",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <Grid size={{ sm: 3 }} sx={{ padding: "0px 10px" }}>
        <LinearProgress />
      </Grid>
      <Grid size={{ sm: 3 }} sx={{ padding: "0px 10px" }}>
        <LinearProgress />
      </Grid>
      <Grid size={{ sm: 3 }} sx={{ padding: "0px 10px" }}>
        <LinearProgress />
      </Grid>
    </Grid>
  );

  const updateActiveEdge = () => {
    const container = carouselRef.current;
    if (!container) return;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (maxScrollLeft <= 1) {
      setActiveEdge("left");
      return;
    }
    if (container.scrollLeft <= 1) {
      setActiveEdge("left");
      return;
    }
    if (container.scrollLeft >= maxScrollLeft - 1) {
      setActiveEdge("right");
      return;
    }
    setActiveEdge("middle");
  };

  const scrollCarousel = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;
    const amount = Math.max(220, Math.floor(container.clientWidth * 0.8));
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateActiveEdge();
  }, [isFetching, hasContent.length]);

  return (
    <>
      <GridCustom
        sx={{
          gap: "10px",
          // backgroundColor:'background.paper',
          // boxShadow:'1',
          // px:2,
          // pt:1,
          // pb:0,
        }}
        container
        size={{ sm: 9, xs: 12 }}
      >
        <Ambulance size={26} weight="fill" />
        <Typography variant="h6">Procedimentos</Typography>

        {isFetching && <PaymentSkeleton />}
        {!isFetching && hasContent.length > 0 && (
          <Box sx={{ width: "100%" }}>
            <Box
              ref={carouselRef}
              onScroll={updateActiveEdge}
              sx={{ overflowX: "auto", width: "100%" }}
            >
              <Grid
                container
                sx={{
                  flexWrap: "nowrap",
                  flexDirection: "row",
                  flexGrow: 1,
                  gap: "10px",
                  p: 0.5,
                  pb: 1,
                  width: "100%",
                }}
              >
                {hasContent.map((item, index) => (
                  <CardsProcedimentos
                    key={index}
                    title={item.title}
                    value={item.value}
                    subitens={item.detalhes}
                    outher={item}
                  />
                ))}
              </Grid>
            </Box>
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "center",
                gap: 1,
                mt: 0.4,
                mb: 1,
              }}
            >
              <Box
                role="button"
                tabIndex={0}
                aria-label="Rolar para esquerda"
                onClick={() => scrollCarousel("left")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    scrollCarousel("left");
                  }
                }}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: activeEdge === "left" ? "success.main" : "grey.500",
                  opacity: activeEdge === "left" ? 1 : 0.65,
                  cursor: "pointer",
                }}
              />
              <Box
                role="button"
                tabIndex={0}
                aria-label="Rolar para direita"
                onClick={() => scrollCarousel("right")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    scrollCarousel("right");
                  }
                }}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: activeEdge === "right" ? "success.main" : "grey.500",
                  opacity: activeEdge === "right" ? 1 : 0.65,
                  cursor: "pointer",
                }}
              />
            </Box>
          </Box>
        )}

        {!isFetching && hasContent.length === 0 && (
          <Box sx={{ width: "100%" }}>
            <Box
              ref={carouselRef}
              onScroll={updateActiveEdge}
              sx={{ overflowX: "auto", width: "100%" }}
            >
              <Grid
                container
                sx={{
                  flexWrap: "nowrap",
                  flexDirection: "row",
                  flexGrow: 1,
                  gap: "10px",
                  p: 0.5,
                }}
              >
                <CardsProcedimentos key="1" title="Totalizadores" value={0} />
                <CardsProcedimentos key="2" title="A realizar" value={0} />
                <CardsProcedimentos key="3" title="Pagos" value={0} />
                <CardsProcedimentos key="4" title="Perdas" value={0} />
              </Grid>
            </Box>
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "center",
                gap: 1,
                mt: 1,
              }}
            >
              <Box
                role="button"
                tabIndex={0}
                aria-label="Rolar para esquerda"
                onClick={() => scrollCarousel("left")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    scrollCarousel("left");
                  }
                }}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: activeEdge === "left" ? "success.main" : "grey.500",
                  opacity: activeEdge === "left" ? 1 : 0.65,
                  cursor: "pointer",
                }}
              />
              <Box
                role="button"
                tabIndex={0}
                aria-label="Rolar para direita"
                onClick={() => scrollCarousel("right")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    scrollCarousel("right");
                  }
                }}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: activeEdge === "right" ? "success.main" : "grey.500",
                  opacity: activeEdge === "right" ? 1 : 0.65,
                  cursor: "pointer",
                }}
              />
            </Box>
          </Box>
        )}
      </GridCustom>
    </>
  );
};
