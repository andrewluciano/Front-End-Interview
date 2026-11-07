import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { theme } from "@/stitches.config";

export const SelectTipos = ({ change }: { change: (event: any) => void }) => {
  const [selectedTipo, setSelectedTipo] = useState("todos");
  const handleChange = (event: any) => {
    setSelectedTipo(event.target.value);
    change(event);
  };

  return (
    <FormControl sx={{ m: 0, ml: "3px", minWidth: 80 }} fullWidth>
      {/* <InputLabel id="SelectTiposId-label">Categoria</InputLabel> */}
      <Select
        labelId="SelectTiposId-label"
        id="SelectTiposId"
        value={selectedTipo}
        onChange={handleChange}
        fullWidth={true}
        label="Tipos"
        sx={{
          backgroundColor: "#fff",
          borderRadius: "4px",
          boxShadow: "1",
          fontWeight: "bold",
          border: "none !important",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      >
        <MenuItem
          sx={{
            "&.Mui-selected": {
              backgroundColor: `${theme.colors.primaryColor} !important`,
            },
          }}
          value={"todos"}
        >
          Categorias
        </MenuItem>
        <MenuItem
          sx={{
            "&.Mui-selected": {
              backgroundColor: `${theme.colors.primaryColor} !important`,
            },
          }}
          value={"procedimento"}
        >
          Procedimentos
        </MenuItem>
        <MenuItem
          sx={{
            "&.Mui-selected": {
              backgroundColor: `${theme.colors.primaryColor} !important`,
            },
          }}
          value={"consulta"}
        >
          Consultas
        </MenuItem>
        <MenuItem
          sx={{
            "&.Mui-selected": {
              backgroundColor: `${theme.colors.primaryColor} !important`,
            },
          }}
          value={"guiaHonorarioIndividual"}
        >
          Guia de Honorario Individual
        </MenuItem>
      </Select>
    </FormControl>
  );
};
