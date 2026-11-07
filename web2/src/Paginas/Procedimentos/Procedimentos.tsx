/* eslint-disable react-hooks/exhaustive-deps */
import { type FC, MouseEvent, useEffect, useState } from "react";

import Api from "./API/Procedimentos";
import { useQuery } from "react-query";

import LinearProgress from "@mui/material/LinearProgress";

import { BlocoProcedimnetos } from "./Componentes/BlocoProcedimentos";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Content,
  BtnAdicionaProcedimento,
  BlocoSemProcedimentos,
} from "./styles";

import { Box, Button, Grid, Tooltip, Typography } from "@mui/material";

import { AdicionarProcedimento } from "./AdicionarProcedimento";
import { Escolha } from "./Escolha";
import { Procedimento } from "./Procedimento";

// Icones
import { ProcedimentosVivIA } from "./ProcedimentosVivIA";
import { useModal } from "@/Autenticacao/ModalContext";
import { ProcessandoProcedimentos } from "./Componentes/ProcessandoProcedimentos";

interface ProcedimentoProps {
  DadosSelecionados: never[];
  Close: () => void;
}

interface IProcedimentoItem {
  Estagio: string | number | null | undefined;
  DataProcedimento: string;
  PrazoProcedimentoEstagioLimite: Date;
  deleted_at: null;
  Procedimento: string;
  Paciente: string;
  Plano: string;
  StatusProcedimento: string;
  Medico: string;
  ValorRecebido: number;
  Progresso: number;
  Convenio: string;
  identifier: string;
  ValorGlosado: number;
  created_at: Date;
  ValorEstimado: number;
}

export const Procedimentos: FC<ProcedimentoProps> = () => {
  const { openModal } = useModal();
  const [searchParams] = useSearchParams();

  const [DadosSelecionados, setDadosSelecionados] = useState(null);
  const [hasContent, setHasContent] = useState<IProcedimentoItem[]>([]);

  const dadosListaProcedimentosDashboard = useQuery(
    ["ListaProcedimentosDashboard"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetProcedimentos();
      return response;
    },
    { keepPreviousData: false },
  );

  const isFetching = dadosListaProcedimentosDashboard?.isLoading;

  const navigate = useNavigate();

  useEffect(() => {
    const procedimentos = dadosListaProcedimentosDashboard?.data?.content;
    if (procedimentos && Array.isArray(procedimentos)) {
      const processados = ProcessandoProcedimentos(procedimentos);
      setHasContent(processados ?? []);
    }
  }, [dadosListaProcedimentosDashboard?.data?.content]);

  // Carrega Procedimento Especifico
  const handleAbreModalProcedimento = (
    e: MouseEvent<HTMLButtonElement, MouseEvent>,
    dados: string,
  ) => {
    e.preventDefault();

    setDadosSelecionados(dados);
    // Atualiza a URL (substitui) e abre o modal imediatamente
    navigate(`?Procedimento=${dados}`, { replace: true });
    handleOpenProductModalEditar();
  };

  const handleOpenProductModalAdicionar = () => {
    const modalContent = <AdicionarProcedimento />;
    const TituloModal = "Novo Procedimento";
    const SubTituloModal = "Novo Procedimento Manual";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const handleOpenProductModalEditar = () => {
    const modalContent = (
      <Procedimento
        Close={() => {
          setDadosSelecionados(null);
          // Limpa parâmetros da URL ao fechar o modal para evitar conflitos
          navigate({ search: "" }, { replace: true });
        }}
      />
    );
    const TituloModal = "Editar Procedimento";
    const SubTituloModal = "Editar Procedimento completo";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const handleOpenProductModalVivIA = () => {
    const modalContent = (
      <ProcedimentosVivIA
        Close={function (): void {
          throw new Error("Function not implemented.");
        }}
        OpenManual={function (): void {
          throw new Error("Function not implemented.");
        }}
        OpenVivIA={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    const TituloModal = "Procedimento VivIA";
    const SubTituloModal = "";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const handleOpenProductModalEscolha = () => {
    const modalContent = <Escolha />;
    const TituloModal = "Novo Procedimento";
    const SubTituloModal = "Você pode escolher o modo de subir o procedimento";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  useEffect(() => {
    if (searchParams.get("AdicionaProcedimento") === "true") {
      handleOpenProductModalAdicionar();
    }
    if (searchParams.get("AdicionaProcedimentoVivIA") === "true") {
      handleOpenProductModalVivIA();
    }
    // Abre via deep-link apenas se não houver seleção em memória
    if (searchParams.has("Procedimento") && !DadosSelecionados) {
      handleOpenProductModalEditar();
    }
    if (searchParams.has("Escolha")) {
      handleOpenProductModalEscolha();
    }
  }, [searchParams, DadosSelecionados]);

  const PaymentSkeleton = () => (
    <Box
      sx={{
        position: "fixed",
        zIndex: "999",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        boxSizing: "border-box",
        alignItems: "center",
        justifyContent: "center",
        width: "200px",
        p: "10px",
        backgroundColor: "rgba(255,255,255,0.4)",
      }}
    >
      <LinearProgress sx={{ maxWidth: "200px" }} />
    </Box>
  );

  const SemProcedimentos = () => (
    <BlocoSemProcedimentos container>
      <Typography variant="h6" component={"h6"} sx={{ fontWeight: "bold" }}>
        Nenhum procedimento <br /> registrado
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          handleOpenProductModalAdicionar(e)
        }
      >
        Criar um novo procedimento
      </Button>
    </BlocoSemProcedimentos>
  );

  return (
    <Content>
      {isFetching && <PaymentSkeleton />}

      {/* <Titulos titulo="Procedimentos" icone={undefined} /> */}
      <Tooltip title="Crie agora um novo procedimento">
        <BtnAdicionaProcedimento
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleOpenProductModalAdicionar(e)
          }
        >
          <AddCircleOutlinedIcon
            sx={{ width: "60px", height: "60px", color: "#50893E" }}
          />
        </BtnAdicionaProcedimento>
      </Tooltip>
      <Grid
        container
        direction="row"
        spacing={1}
        sx={{
          width: "93vw",
          boxSizing: "border-box",
          padding: "0px 20px 0px 0 ",
          overflowX: "auto",
          scrollbarWidth: "thin",
        }}
      >
        <Grid
          container
          size={{ sm: 12, xs: 12 }}
          sx={{
            gap: "15px",
            flexDirection: "row",
            flexWrap: "nowrap",
          }}
        >
          {!isFetching && hasContent?.length === 0 && <SemProcedimentos />}
          {!isFetching &&
            hasContent.map((item) => {
              return (
                <>
                  <BlocoProcedimnetos
                    dados={item}
                    handleAbreModalProcedimento={handleAbreModalProcedimento}
                  />
                </>
              );
            })}
        </Grid>
      </Grid>
    </Content>
  );
};
