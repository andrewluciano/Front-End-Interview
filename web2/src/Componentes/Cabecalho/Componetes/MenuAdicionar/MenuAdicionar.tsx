import * as React from "react";
import PropTypes from "prop-types";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

import { useNavigate } from "react-router-dom";

export const MenuAdicionar = (props: { onClose: any; open: any }) => {
  const navigate = useNavigate();

  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Incluir Procedimento</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disablePadding key={1}>
          <ListItemButton
            onClick={() => {
              navigate("?AdicionarAtendimentoUpload", { replace: true });
              handleClose();
            }}
          >
            <ListItemText primary={"Upload de Arquivo"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding key={2}>
          <ListItemButton
            onClick={() => {
              navigate("?AdicionarAtendimentoManual", { replace: true });
              handleClose();
            }}
          >
            <ListItemText primary={"Procedimento Manual"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
};

MenuAdicionar.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
