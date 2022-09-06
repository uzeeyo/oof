import React from "react";
import { List, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import {Tag, Notes} from '@mui/icons-material'

import style from "../styles/Navigation.module.css";

type Props = {};

function Navigation({}: Props) {
  return (
    <div className={`${style.navlist} flex-col`}>
        <div className={`${style['navlist-title']}`}/>
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <Tag color="secondary" />
            </ListItemIcon>
            Posts
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <Notes color="secondary" />
            </ListItemIcon>
            Threads
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}

export default Navigation;
