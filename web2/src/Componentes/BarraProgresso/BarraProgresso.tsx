import { Container, AreaBarra, Barra } from "./Styles";
import { Tooltip } from "@mui/material";

interface IBarraProgressoProps {
  progresso: number;
  prazo: number;
}

export const BarraProgresso: React.FC<IBarraProgressoProps> = (props) => {
  const PrazoAcao = () => {
    if (props.prazo <= 49) {
      return "bom";
    } else if (props.prazo > 49 && props.prazo <= 74) {
      return "medio";
    } else if (props.prazo > 74) {
      return "alto";
    }
  };

  const prog = props.progresso + "%";

  return (
    <Container>
      <Tooltip title={PrazoAcao()}>
        <AreaBarra>
          <Barra prazo={PrazoAcao()} css={{ $$progesso: prog, width: prog }} />
        </AreaBarra>
      </Tooltip>
    </Container>
  );
};
