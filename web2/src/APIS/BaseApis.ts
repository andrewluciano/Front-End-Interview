import CONFIG from "@/Config/config";
import { getItem } from "@/helpers/armazenamento";

const jsonBasico = { id: null, email: null, full_name: null, role: null };

export const baseURL = `${CONFIG.API_BASE_URL_NOVO}`;
export const baseURLV1 = `${CONFIG.API_BASE_URL}`;

export const getDadosUsuariosDoArmazenamento = () => {
  const sessionStr = getItem(`dados_users`) || JSON.stringify(jsonBasico);
  return JSON.parse(sessionStr);
};

export const useDadosUsuarios = () => {
  // const sessionStr = getItem(`dados_users`) || JSON.stringify(jsonBasico);
  // const [DadosUsuariosDados, setDadosUsuariosDados] = useState(() => JSON.parse(sessionStr));

  // useEffect(() => {
  //     setDadosUsuariosDados(JSON.parse(sessionStr));
  //     console.log('DadosUsuariosDados',JSON.parse(sessionStr))
  // }, [sessionStr]);

  // return DadosUsuariosDados;
  const sessionStr = getItem(`dados_users`) || JSON.stringify(jsonBasico);
  return JSON.parse(sessionStr);
};

export const token_ = getItem("auth-token");
