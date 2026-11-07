import { type FC } from "react";

// import Api from "./API/Medicos";
// import { useQuery } from "react-query";

import { useQuery } from "react-query";
import Api from "../API/Destaques";

import { ResponsiveBar } from "@nivo/bar";
import { Container } from "./Styles";

export const GraficoEstagios: FC = () => {
  const dadosDestaquesHome = useQuery(
    ["listaDestaquesHome"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetDestaques();
      return response;
    },
    { keepPreviousData: true },
  );

  //   const isFetching = dadosDestaquesHome?.isLoading;

  const hasContent = dadosDestaquesHome?.data?.content ?? [];

  return (
    <Container>
      <ResponsiveBar
        data={hasContent.filter(
          (item: { type: string }) => item?.type === "Estágio",
        )}
        keys={["value"]}
        indexBy="label"
        margin={{ top: 20, right: 20, bottom: 50, left: 160 }}
        padding={0.4}
        valueScale={{ type: "linear" }}
        colors="#3182CE"
        animate={true}
        layout={"horizontal"}
        enableLabel={false}
        axisTop={null}
        axisRight={null}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,

          legendPosition: "middle",
          legendOffset: -40,
        }}
      />
    </Container>
  );
};
