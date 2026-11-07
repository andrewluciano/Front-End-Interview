/* eslint-disable react-hooks/exhaustive-deps */
import { type FC, MouseEvent, useEffect, useState } from "react";

import Api from "./API/Consultas";
import { useQuery } from "react-query";

import LinearProgress from "@mui/material/LinearProgress";

import { BlocoConsultas } from "./Componentes/BlocoConsultas";
import { useNavigate, useSearchParams } from "react-router-dom";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PostAddIcon from "@mui/icons-material/PostAdd";

import { Content, BlocoSemProcedimentos } from "./styles";

import { Box, Button, Grid, Typography } from "@mui/material";

import { ModalUploadArquivos } from "@/Componentes/ModalUploadArquivos";
import { AdicionarConsulta } from "./AdicionarConsulta";
import { useModal } from "@/Autenticacao/ModalContext";
import { ProcessandoConsultas } from "./Componentes/ProcessandoConsultas";
import { Consulta } from "./Consulta/Consulta";

interface ConsultasProps {
  DadosSelecionados: never[];
  Close: () => void;
}

interface IProcedimentoItem {
  nome_paciente: string;
  cpf_rg: string;
  r_nascido: string;
  numero_carteira: string;
  data_nascimento: Date;
  idade: string;
  contato: string;
  convenio: string;
  unidade: string;
  local: string;
  tipo_encontro: string;
  data_consulta: Date;
  medico: string;
  medico_encaminhador: string;
  valor_receber: number;
  valor_recebido: number;
}

export const Consultas: FC<ConsultasProps> = () => {
  const navigate = useNavigate();

  const { openModal } = useModal();
  const [searchParams] = useSearchParams();

  const [DadosSelecionados, setDadosSelecionados] = useState(null);
  const [hasContent, setHasContent] = useState<IProcedimentoItem[]>([]);

  const actions = [
    {
      icon: <PostAddIcon />,
      name: "Adicionar Consulta Manual",
      link: () => navigate("?AdicionarConsultaManual", { replace: true }),
    },
    {
      icon: <UploadFileIcon />,
      name: "Upload Consulta",
      link: () => navigate("?AdicionarConsultaUpload", { replace: true }),
    },
  ];

  const dadosListaConsultasDashboard = useQuery(
    ["ListaProcedimentosDashboard"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetConsultas();
      return response;
    },
    { keepPreviousData: false },
  );

  const isFetching = dadosListaConsultasDashboard?.isLoading;

  useEffect(() => {
    const procedimentos = dadosListaConsultasDashboard?.data?.content;
    if (procedimentos && Array.isArray(procedimentos)) {
      const processados = ProcessandoConsultas(procedimentos);

      setHasContent((prev) => {
        // Evita atualização redundante quando o conteúdo não mudou
        if (prev.length === (processados?.length ?? 0)) {
          const same =
            prev.length === 0 ||
            prev.every(
              (p, idx) =>
                JSON.stringify(p) === JSON.stringify(processados[idx]),
            );
          if (same) return prev;
        }
        return processados ?? [];
      });
    }
  }, [dadosListaConsultasDashboard?.data?.content]);

  // Carrega Procedimento Especifico
  const handleAbreModalConsulta = (
    e: MouseEvent<HTMLButtonElement, MouseEvent>,
    dados: string,
  ) => {
    e.preventDefault();

    setDadosSelecionados(dados);
    // Atualiza a URL (substitui) e abre o modal imediatamente
    navigate(`?Consulta=${dados}`, { replace: true });
    handleOpenProductModalEditar();
  };

  const handleOpenProductModalAdicionar = () => {
    const modalContent = <AdicionarConsulta />;
    const TituloModal = "Nova Consulta";
    const SubTituloModal = "Nova Consulta Manual";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const handleOpenProductModalAdicionarUpload = () => {
    openModal(
      <ModalUploadArquivos />,
      "Upload de Arquivos",
      "Selecione os arquivos para upload",
    );
  };

  const handleOpenProductModalEditar = () => {
    const modalContent = (
      <Consulta
        Close={() => {
          setDadosSelecionados(null);
          // Limpa parâmetros da URL ao fechar o modal para evitar conflitos
          navigate({ search: "" }, { replace: true });
        }}
      />
    );
    const TituloModal = "Editar Consulta";
    const SubTituloModal = "Editar Consulta completa";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const handleOpenProductModalEscolha = () => {
    const modalContent = <AdicionarConsulta />;
    const TituloModal = "Nova Consulta";
    const SubTituloModal = "Consulta Manual";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  useEffect(() => {
    if (searchParams.has("AdicionarConsultaManual")) {
      handleOpenProductModalAdicionar();
    }
    if (searchParams.has("AdicionarConsultaUpload")) {
      handleOpenProductModalAdicionarUpload();
    }

    // Abre via deep-link apenas se não houver seleção em memória
    if (searchParams.has("Consulta") && !DadosSelecionados) {
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
        Nenhuma Consulta Registrada
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          handleOpenProductModalEscolha(e)
        }
      >
        Cadastrar nova consulta
      </Button>
    </BlocoSemProcedimentos>
  );

  return (
    <Content>
      <SpeedDial
        ariaLabel="Ações de Consulta"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        className="TooltipSpeed"
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={action.link}
            slotProps={{
              tooltip: {
                open: true,
                className: "TooltipSpeed",
                title: action.name,
              },
            }}
          />
        ))}
      </SpeedDial>

      {isFetching && <PaymentSkeleton />}

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
                  <BlocoConsultas
                    dados={item}
                    handleAbreModalConsulta={handleAbreModalConsulta}
                  />
                </>
              );
            })}
        </Grid>
      </Grid>
    </Content>
  );
};
