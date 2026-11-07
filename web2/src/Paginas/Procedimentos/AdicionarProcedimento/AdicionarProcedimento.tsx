import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";
import { type FC, type FormEvent, forwardRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { BotaoPadrao } from "@/Componentes/BotaoPadrao";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import Api from "../API/Procedimentos";

import { NumericFormat } from "react-number-format";

import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

// Icones
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useModal } from "@/Autenticacao/ModalContext";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CurrencyInput = forwardRef(function CurrencyInput(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value, // This gives you the unmasked numeric value
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale={true}
    />
  );
});
// const ToastLoading = "";

const cleanCurrency = (value: FormDataEntryValue): number => {
  // Ensure it's a string, then remove "R$", spaces, and dots. Finally, replace comma with dot for float parsing.
  const strValue = value as string;
  return Number(strValue.replace(/[R$\s.]/g, "").replace(",", "."));
};

export const AdicionarProcedimento: FC = () => {
  const { closeModal } = useModal();
  const [Estagio, setEstagio] = useState("");
  const [Status, setStatus] = useState("");

  const Formulario = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();

    const formData = new FormData(form.target);
    const formValues = Object.fromEntries(formData.entries());
    // setJsonBasico(formValues.filter(item => item.DataProcedimento = new Date(item.DataProcedimento).toISOString() ))
    // setJsonBasico(formValues.filter(item => item.DataProcedimento = new Date(item.DataProcedimento).toISOString() ))

    formValues.Documentos = "[]";
    formValues.Pendencias = "[]";

    formValues.Documentos = JSON.parse(formValues.Documentos as string);
    formValues.Pendencias = JSON.parse(formValues.Pendencias as string);

    // formValues.DataProcedimento = new Date(
    //   formValues.DataProcedimento,
    // ).toISOString();
    formValues.ValorEstimado = cleanCurrency(formValues.ValorEstimado);
    formValues.ValorGlosado = 0;
    formValues.ValorRecebido = 0;

    AcaoAdicionarProcedimento(formValues);
  };

  function handleChangeEstagios(event: SelectChangeEvent): void {
    setEstagio(event.target.value as string);
  }

  function handleChangeStatus(event: SelectChangeEvent): void {
    setStatus(event.target.value as string);
  }

  const queryClient = useQueryClient();

  let ToastLoading = "";

  const { mutate: AcaoAdicionarProcedimento } = useMutation(async (dados) => {
    ToastLoading = toast.loading("Adicionando Procedimento...");
    const apiInstance = await Api.create();

    const response = await apiInstance.AdicionarProcedimentos(dados);

    if (!response?.is_error) {
      toast.success("Procedimento adicionado com sucesso");
      queryClient.invalidateQueries();
      queryClient.refetchQueries();
      setTimeout(() => {
        toast.dismiss(ToastLoading);
        closeModal();
      }, 500);
    } else {
      setTimeout(() => {
        closeModal();
      }, 500);
      toast.dismiss(ToastLoading);
      queryClient.invalidateQueries();
    }
    return response;
  });

  // const EnvioDocumentosoUpload = (dados: File) => {
  //   setDocumentosUpload(dados);
  // };

  return (
    <form onSubmit={(form) => Formulario(form)}>
      <input name="identifier" value="" type="HIDDEN" />
      <input name="deleted_at" value={new Date().toISOString()} type="HIDDEN" />
      <input name="created_at" value={new Date().toISOString()} type="HIDDEN" />
      <input name="updated_at" value={new Date().toISOString()} type="HIDDEN" />

      <input name="assistant_message" value="" type="HIDDEN" />
      <input name="Documentos" value={"[]"} type="HIDDEN" />
      <input name="Pendencias" value={"[]"} type="HIDDEN" />

      <Grid container>
        <FormControl
          fullWidth
          sx={{
            m: 1,
            width: "49ch",
            justifyContent: "center",
            display: "none",
          }}
          variant="standard"
        >
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Carregar Arquivos
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => console.log(event.target.files)}
              multiple
            />
          </Button>
        </FormControl>

        <FormControl
          fullWidth
          sx={{ m: 1, width: "99.5ch" }}
          variant="standard"
        >
          <input
            type="hidden"
            name="PrazoProcedimentoEstagioLimite"
            value="2026-08-30T21:22:20.363Z"
          />
          <TextField
            required
            fullWidth
            name="Paciente"
            label="Nome do Paciente"
            variant="outlined"
          />
        </FormControl>

        <Grid container size={{ sm: 12 }}>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "48.9ch" }}
            variant="standard"
          >
            <TextField
              fullWidth
              name="Convenio"
              label="Convênio"
              type="Pesquisar"
            />
          </FormControl>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "48.9ch" }}
            variant="standard"
          >
            <TextField fullWidth name="Plano" label="Plano" type="Pesquisar" />
          </FormControl>
        </Grid>

        <FormControl fullWidth sx={{ m: 1, width: "49ch" }} variant="standard">
          <TextField
            fullWidth
            name="hospital"
            label="Local do Procedimento"
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1, width: "23ch" }} variant="standard">
          <TextField
            fullWidth
            name="DataProcedimento"
            label="Previsão do Procedimento"
            variant="outlined"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1, width: "24ch" }} variant="standard">
          <TextField
            fullWidth
            name="ValorEstimado"
            label="Faturamento Esperado"
            variant="outlined"
            InputProps={{
              inputComponent: CurrencyInput,
            }}
          />
        </FormControl>

        <FormControl
          fullWidth
          sx={{ m: 1, width: "99.5ch" }}
          variant="standard"
        >
          <TextField
            fullWidth
            name="Medico"
            label="Nome do Médico"
            type="Pesquisar"
          />
        </FormControl>
        <Grid container size={{ sm: 12 }}>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "23.8ch" }}
            variant="standard"
          >
            <TextField
              name="CodProcedimento"
              label="Código Procedimento"
              type="Pesquisar"
            />
          </FormControl>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "74ch" }}
            variant="standard"
          >
            <TextField
              fullWidth
              name="Procedimento"
              label="Nome Procedimento"
              type="Pesquisar"
            />
          </FormControl>
        </Grid>
        <FormControl
          fullWidth
          sx={{ m: 1, width: "99.5ch" }}
          variant="standard"
        >
          <TextField
            fullWidth
            name="Descricao"
            label="Descrição"
            variant="outlined"
            multiline
            rows={4}
          />
        </FormControl>

        <Grid container size={{ sm: 12 }}>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "48.9ch" }}
            variant="standard"
          >
            <InputLabel
              id="EstagioLabel"
              sx={{ padding: "0", margin: "-4px 0 0 15px" }}
            >
              Estágios
            </InputLabel>
            <Select
              labelId="EstagioLabel"
              id="demo-simple-select"
              value={Estagio}
              label="Estágios"
              onChange={handleChangeEstagios}
              variant="outlined"
              name="Estagio"
            >
              <MenuItem value="Aguardando Autorização Convênio">
                Aguardando Autorização Convênio
              </MenuItem>
              <MenuItem value="Aguardando Agendamento">
                Aguardando Agendamento
              </MenuItem>
              <MenuItem value="Aguardando Execução">
                Aguardando Execução
              </MenuItem>
              <MenuItem value="Executado">Executado</MenuItem>
              <MenuItem value="Aguardando Faturamento">
                Aguardando Faturamento
              </MenuItem>
              <MenuItem value="Negado">Negado</MenuItem>
              <MenuItem value="Glosado">Glosado</MenuItem>
              <MenuItem value="Pago">Pago</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "48.9ch" }}
            variant="standard"
          >
            <InputLabel
              id="StatusDoProcedimento"
              sx={{ padding: "0", margin: "-4px 0 0 15px" }}
            >
              Status
            </InputLabel>
            <Select
              labelId="StatusDoProcedimento"
              id="demo-simple-select"
              value={Status}
              label="Status"
              onChange={handleChangeStatus}
              variant="outlined"
              name="StatusProcedimento"
            >
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Em Andamento">Em Andamento</MenuItem>
              <MenuItem value="Crítico">Crítico</MenuItem>
              <MenuItem value="Glosado">Glosado</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
              <MenuItem value="Finalizado">Finalizado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <FormControl
          fullWidth
          // sx={{ m: 1, width: "32ch", border:'0.5px solid #bbb', borderRadius:'5px',padding:'0 20px', boxSizing:'border-box' }}
          sx={{ m: 1, width: "32ch", display: "none" }}
          variant="standard"
        >
          <TextField
            fullWidth
            name="Progresso"
            label="Progresso"
            variant="outlined"
            type="number"
            value="0"
            inputProps={{ max: 100, min: 0 }}
          />
          {/* <FormLabel component="label" sx={{fontSize:'0.75rem', position:'relative',top:'-5px', left:'-10px', boxSizing:'border-box', padding:'0 5px', backgroundColor:'#fff', width:'65px'}} >Progresso</FormLabel>
          <Slider
            size="small"
            defaultValue={0}
            aria-label="Small"
            valueLabelDisplay="auto"
            name="Progresso"
          />           */}
        </FormControl>

        {/* <FormControl fullWidth sx={{ m: 1, width: "32ch" }} variant="standard">
          <TextField
            fullWidth
            name="ValorRecebido"
            label="Faturamento Recebido"
            type="Pesquisar"
            InputProps={{
              inputComponent: CurrencyInput,
            }}
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1, width: "32ch" }} variant="standard">
          <TextField
            fullWidth
            name="ValorGlosado"
            label="Valor Glosado"
            type="Pesquisar"
            InputProps={{
              inputComponent: CurrencyInput,
            }}
          />
        </FormControl> */}
      </Grid>

      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <BotaoPadrao
          size="large"
          titulo="Adicionar Procedimento"
          variant="contained"
          type="submit"
          startIcon={<SaveIcon />}
        />
        <Button
          size="large"
          startIcon={<CloseIcon />}
          onClick={() => closeModal()}
        >
          Cancelar
        </Button>
      </Grid>
    </form>
  );
};
