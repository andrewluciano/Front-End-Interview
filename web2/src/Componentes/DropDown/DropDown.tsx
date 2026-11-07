import { type FC } from "react";
import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { MenuButton } from "@mui/base/MenuButton";
import { MenuItem } from "@mui/base/MenuItem";

export const DropDown: FC = () => {
  const createHandleMenuClick = (menuItem: string) => {
    return () => {
      console.log(`Clicked on ${menuItem}`);
    };
  };

  return (
    <Dropdown>
      <MenuButton>Aguardando Autorização do Convênio</MenuButton>
      <Menu>
        <MenuItem onClick={createHandleMenuClick("Profile")}>Profile</MenuItem>
        <MenuItem onClick={createHandleMenuClick("Language settings")}>
          Language settings
        </MenuItem>
        <MenuItem onClick={createHandleMenuClick("Log out")}>Log out</MenuItem>
      </Menu>
    </Dropdown>
  );
};
