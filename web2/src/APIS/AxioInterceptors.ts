import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getItem } from "@/helpers/armazenamento";

// Aplica interceptadores de request/response a uma instância do axios
const applyInterceptors = (api: AxiosInstance) => {
  // Request: injeta Authorization automaticamente, se existir token
  api.interceptors.request.use((config) => {
    const token = getItem("auth-token");
    if (token) {
      config.headers = config.headers ?? {};
      // Evita sobrescrever se já foi definido manualmente
      if (!config.headers["Authorization"]) {
        (config.headers as Record<string, string>)["Authorization"] =
          `Bearer ${token}`;
      }
    }
    return config;
  });

  // Response: captura 401 e força redirecionamento para /logout
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        try {
          window.location.href = "/Logout";
        } catch {
          // ignore storage errors
        }
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/Logout"
        ) {
          window.location.href = "/Logout";
        }
      }
      return Promise.reject(error);
    },
  );
};

// Aplica nos requests feitos via axios padrão
applyInterceptors(axios);

// Monkey-patch: aplica automaticamente nas instâncias criadas com axios.create
const originalCreate = axios.create.bind(axios);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(axios as any).create = (config?: AxiosRequestConfig) => {
  const instance: AxiosInstance = originalCreate(config);
  applyInterceptors(instance);
  return instance;
};
