import { format, parseISO } from "date-fns";

export const getUTCDate = (dateString = Date.now()) => {
  const date = new Date(dateString);

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
};

export const currency = (value) => {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
  return formatter.format(value);
};

export const convertNumberToDolar1 = (value) => {
  const formatter = new Intl.NumberFormat("pt-BR");
  return formatter.format(value);
};

export const cutText = (valor, qtd) => {
  const pontos = valor.length > qtd ? "..." : "";

  valor = valor.slice(0, qtd);
  return valor + pontos;
};

export const convertNumberToDolar = (value) => {
  const formatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};

// var formatterVolta = new Intl.NumberFormat('en-IN', {
//   minimumFractionDigits: 2
// });

export const countRecords = (data) => {
  if (Array.isArray(data)) {
    return data.length;
  }
  return Object.keys(data).length;
};

export const dotToComma = (value) => {
  return value.toString().replace(".", ",");
};

export const dotToCommaDecimals = (value, decimal, withPercent) => {
  const val = value.toFixed(decimal);
  if (withPercent) {
    const percent = val.toString().replace(".", ",");
    return `${percent} %`;
  }
  return val.toString().replace(".", ",");
};

export const dateTime = (value) => {
  if (!value) {
    return "data invalida";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) {
    return "data invalida";
  }
  const result = format(date, "dd/MM/yyyy HH:mm");
  return result;
};

export const JustTime = (value) => {
  if (!value) {
    return "data invalida";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) {
    return "data invalida";
  }
  const result = format(date, "HH:mm");
  return result;
};

export const dateTimeSeconds = (value) => {
  const result = format(new Date(value), "dd/MM/yyyy HH:mm:ss");
  const v = result.split(" ");
  const r = `${v[0]} às ${v[1]}`;
  return r;
};

export const date = (value) => {
  // const localTime = format(new Date(value), 'dd/MM/yyyy'); // returns local time
  // const utcTime = format(getUTCDate(value), 'dd/MM/yyyy'); // returns UTC time
  const localValue = value + "T12:00:00";
  const date = new Date(localValue);
  const result = format(date, "dd/MM/yyyy");

  // const result = format(new Date(value), "dd/MM/yyyy");

  return result;
};

export const dateSimple = (value) => {
  if (!value) {
    return "-";
  }
  try {
    const date = getUTCDate(value);
    if (isNaN(date.getTime())) {
      return "-";
    }
    const utcTime = format(date, "dd/MM/yyyy"); // returns UTC time
    return utcTime;
  } catch (error) {
    return "-";
  }
};
export const date2 = (value) => {
  // const localTime = format(new Date(value), 'dd/MM/yyyy'); // returns local time
  const utcTime = format(getUTCDate(value), "yyyy-MM-dd"); // returns UTC time

  // const result = format(new Date(value), "yyyy-MM-dd");

  return utcTime;
};

export const timeT = (value) => {
  // const localTime = format(new Date(value), 'dd/MM/yyyy'); // returns local time
  // const utcTime = format(getUTCDate(value), 'dd/MM/yyyy'); // returns UTC time

  const result = format(new Date(value), "HH:mm");

  return result;
};

export const pmpTemMaisDeDuasCasasDecimais = (pmp) => {
  const casasDecimaisPmp = pmp.toString().split(".")[1];
  return casasDecimaisPmp && casasDecimaisPmp.length > 2;
};

export const convertDate = (value) => {
  if (value && typeof value === "string") {
    const v1 = value.split("/");
    return `${v1[2]}-${v1[1]}-${v1[0]}`;
  }
  return "";
};

export const revertDate = (value) => {
  if (value && typeof value === "string") {
    const v1 = value.split("-");
    return `${v1[2]}/${v1[1]}/${v1[0]}`;
  }
  return "";
};

export const formatCustomDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);

  const dayOfWeek = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
  }).format(d);
  const dayOfMonth = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
  }).format(d);
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    d,
  );
  const year = new Intl.DateTimeFormat("pt-BR", { year: "numeric" }).format(d);

  const formattedDayOfWeek =
    dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const formattedMonthName =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return `${formattedDayOfWeek} - ${dayOfMonth} de ${formattedMonthName} de ${year}`;
};

export const formatarParaCentenas = (valor) => {
  return new Intl.NumberFormat("pt-BR").format(valor);
};
