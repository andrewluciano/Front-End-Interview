import { type FC } from "react";

import { Container, AreaDestaque, BlocoDestaque } from "./styles";

export const Filtros: FC = () => {
  return (
    <Container>
      <AreaDestaque>
        <BlocoDestaque tipo="destaque">
          <p>Autorização</p>
        </BlocoDestaque>
        <BlocoDestaque>
          <p>Agendamento</p>
        </BlocoDestaque>
        <BlocoDestaque>
          <p>Execução</p>
        </BlocoDestaque>
        <BlocoDestaque>
          <p>Pagamento</p>
        </BlocoDestaque>
      </AreaDestaque>
    </Container>
  );
};
