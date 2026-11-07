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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import { NumericFormat } from "react-number-format";

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

export const DetalheMedico: FC = (props: Partial<Type>) => {
  const [Estagio, setEstagio] = useState("");
  const [Status, setStatus] = useState("");

  console.log("props", props?.DadosSelecionados?.id);

  const Formulario = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();

    const formData = new FormData(form.target);
    const formValues = Object.fromEntries(formData.entries());

    console.log("Formulario", formValues);
  };
  function handleChangeEstagios(event: SelectChangeEvent): void {
    setEstagio(event.target.value as string);
  }

  function handleChangeStatus(event: SelectChangeEvent): void {
    setStatus(event.target.value as string);
  }
  return (
    <form onSubmit={(form) => Formulario(form)}>
      <Grid container>
        <FormControl fullWidth sx={{ m: 1, width: "49ch" }} variant="standard">
          <TextField
            required
            fullWidth
            name="NomePaciente"
            label="Nome do Paciente"
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1, width: "49ch" }} variant="standard">
          <TextField
            required
            fullWidth
            name="NomeMedico"
            label="Nome do Médico"
            type="Pesquisar"
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1, width: "24ch" }} variant="standard">
          <TextField
            required
            fullWidth
            name="CodProcedimento"
            label="Código Procedimento"
            type="Pesquisar"
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1, width: "74ch" }} variant="standard">
          <TextField
            required
            fullWidth
            name="NomeProcedimento"
            label="Nome Procedimento"
            type="Pesquisar"
          />
        </FormControl>
        <FormControl
          fullWidth
          sx={{ m: 1, width: "99.5ch" }}
          variant="standard"
        >
          <TextField
            required
            fullWidth
            name="Descricao"
            label="Descrição"
            variant="outlined"
            multiline
            rows={6}
          />
        </FormControl>

        <FormControl fullWidth sx={{ m: 1, width: "49ch" }} variant="standard">
          <InputLabel
            id="demo-simple-select-label"
            sx={{ padding: "0", margin: "-4px 0 0 15px" }}
          >
            Estágios
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
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
            <MenuItem value="Aguardando Execução">Aguardando Execução</MenuItem>
            <MenuItem value="Aguardando Faturamento">
              Aguardando Faturamento
            </MenuItem>
            <MenuItem value="Negado">Negado</MenuItem>
            <MenuItem value="Glosado">Glosado</MenuItem>
            <MenuItem value="Pago">Pago</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ m: 1, width: "49ch" }} variant="standard">
          <InputLabel
            id="demo-simple-select-label"
            sx={{ padding: "0", margin: "-4px 0 0 15px" }}
          >
            Status
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={Status}
            label="Status"
            onChange={handleChangeStatus}
            variant="outlined"
            name="Status"
          >
            <MenuItem value="Pendente">Pendente</MenuItem>
            <MenuItem value="Em Andamento">Em Andamento</MenuItem>
            <MenuItem value="Crítico">Crítico</MenuItem>
            <MenuItem value="Glosado">Glosado</MenuItem>
            <MenuItem value="Cancelado">Cancelado</MenuItem>
            <MenuItem value="Finalizado">Finalizado</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ m: 1, width: "49ch" }} variant="standard">
          <TextField
            fullWidth
            name="FaturamentoEsperado"
            label="Faturamento Esperado"
            variant="outlined"
            InputProps={{
              inputComponent: CurrencyInput,
            }}
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1, width: "49ch" }} variant="standard">
          <TextField
            fullWidth
            name="FaturamentoRecebido"
            label="Faturamento Recebido"
            type="Pesquisar"
            InputProps={{
              inputComponent: CurrencyInput,
            }}
          />
        </FormControl>

        <FormControl fullWidth sx={{ m: 1, width: "49ch" }} variant="standard">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                sx={{ m: 0, width: "49ch" }}
                label="Data do Procedimento"
                name="DataProcedimento"
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
        <FormControl
          fullWidth
          sx={{ m: 1, width: "49ch", justifyContent: "center" }}
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
      </Grid>

      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <BotaoPadrao
          size="large"
          titulo="Adicionar Procedimento"
          variant="contained"
          type="submit"
        />
        <Button size="large">Cancelar</Button>
      </Grid>
    </form>
  );
};
