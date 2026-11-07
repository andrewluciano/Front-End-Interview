import { Button, FormControl, Grid, TextField } from "@mui/material";
import { type FC, type FormEvent } from "react";
import { BotaoPadrao } from "@/Componentes/BotaoPadrao";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

// import { type IAdicionarMedicos } from "interfaces/ListaMedicos";

import { PhoneMaskCustom } from "@/Componentes/MaskInput";

import Api from "../API/AdicionarMedico";

import toast from "react-hot-toast";

let ToastLoading = "";
import { useMutation, useQueryClient } from "react-query";
import { useModal } from "@/Autenticacao/ModalContext";
// import {AdicionaListaTuss} from "./AdicionaListaTuss";

export const AdicionarMedicos: FC = () => {
  // const [speciality, setSpeciality] = useState<string[]>([]);

  const { closeModal } = useModal();

  const queryClient = useQueryClient();

  const { mutate: AcaoAdicionarMedicos } = useMutation(async (dados) => {
    ToastLoading = toast.loading("Adicionando Médico...");
    const apiInstance = await Api.create();
    const response = await apiInstance.PostMedicos(dados);

    if (!response?.is_error) {
      toast.success("Médico adicionado com sucesso");
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

  const Formulario = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();

    // Usa currentTarget para manter tipagem do formulário no evento
    const formData = new FormData(form.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    // formValues.speciality = speciality[0];
    AcaoAdicionarMedicos(formValues);
  };

  return (
    <form onSubmit={(form) => Formulario(form)}>
      <Grid container size={{ xs: 12, md: 12 }}>
        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <TextField
            required
            fullWidth
            name="full_name"
            label="Nome do Medicos"
            variant="outlined"
          />
        </FormControl>
        <Grid container size={{ sm: 6, xs: 12 }} sx={{ m: 0 }}>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "49ch" }}
            variant="standard"
          >
            <TextField
              required
              fullWidth
              name="email"
              label="Email do Medicos"
              type="Pesquisar"
            />
          </FormControl>
        </Grid>
        <Grid container size={{ sm: 6, xs: 12 }}>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "49ch" }}
            variant="standard"
          >
            <TextField
              required
              fullWidth
              name="phone"
              label="Telefone do Medico"
              type="Pesquisar"
              InputProps={{
                inputComponent: PhoneMaskCustom,
              }}
            />
          </FormControl>
        </Grid>
        <Grid container size={{ sm: 6, xs: 12 }}>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "49ch" }}
            variant="standard"
          >
            <TextField
              required
              fullWidth
              name="crm"
              label="CRM do Medicos"
              variant="outlined"
            />
          </FormControl>
        </Grid>
        <Grid container size={{ sm: 6, xs: 12 }}>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "49ch" }}
            variant="standard"
          >
            <TextField
              required
              fullWidth
              name="crm_state"
              label="Estado do CRM"
              variant="outlined"
            />
          </FormControl>
        </Grid>

        <Grid container size={{ sm: 12, xs: 12 }}>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "100ch" }}
            variant="standard"
          >
            <TextField
              required
              fullWidth
              name="speciality"
              label="Especialidade do Medico"
              type="Pesquisar"
            />
            {/* <input type="hidden" name="speciality" value={speciality} />
            <AdicionaListaTuss 
              change={(selectedOptions) => {
                const tussCodes = selectedOptions.map(option => option.nome);
                setSpeciality(tussCodes);
              }} 
            /> */}
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <BotaoPadrao
          size="large"
          titulo="Adicionar Medicos"
          variant="contained"
          type="submit"
          startIcon={<SaveIcon />}
        />
        <Button
          size="large"
          onClick={() => closeModal()}
          startIcon={<CloseIcon />}
        >
          Cancelar
        </Button>
      </Grid>
    </form>
  );
};
