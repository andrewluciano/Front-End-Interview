import { type FC } from "react";

// import Api from "./API/Medicos";
// import { useQuery } from "react-query";

import { ResponsiveLine } from "@nivo/line";
import { Container } from "./Styles";

const data = [
  {
    id: "japan",
    data: [
      {
        x: "Jan",
        y: 12,
      },
      {
        x: "Fev",
        y: 3,
      },
      {
        x: "Mar",
        y: 23,
      },
      {
        x: "Abr",
        y: 76,
      },
      {
        x: "Mai",
        y: 43,
      },
      {
        x: "Jun",
        y: 23,
      },
      {
        x: "Jul",
        y: 87,
      },
      {
        x: "Ago",
        y: 54,
      },
      {
        x: "Set",
        y: 65,
      },
      {
        x: "Out",
        y: 62,
      },
      {
        x: "Nov",
        y: 34,
      },
      {
        x: "Dez",
        y: 95,
      },
    ],
  },
];

export const GraficoRequisicoesMes: FC = () => {
  return (
    <Container>
      <ResponsiveLine /* or Line for fixed dimensions */
        data={data}
        margin={{ top: 30, right: 30, bottom: 50, left: 50 }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        // axisBottom={{ legend: 'Meses', legendOffset: 36 }}
        // axisLeft={{ legend: 'Requisições', legendOffset: -40 }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "seriesColor" }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        // legends={[
        //     {
        //         anchor: 'bottom-right',
        //         direction: 'column',
        //         translateX: 100,
        //         itemWidth: 80,
        //         itemHeight: 12,
        //         symbolShape: 'circle'
        //     }
        // ]}
      />
    </Container>
  );
};
