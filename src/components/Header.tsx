import React, { useState, MouseEvent } from "react";
import style from "../styles/Header.module.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { FavoriteBorder, Logout, Settings } from "@mui/icons-material";

type Props = {};

const Header = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className={style.Header}>
      <div>
        <div className="flex flex-row items-center">
          <div className="p-2">
            <Link href="/" className="p-20">
              <a>
                <img src="/images/logo.png" className="w-20" />
              </a>
            </Link>
          </div>

          <div className="flex flex-row ml-auto mr-auto rounded-xl bg-slate-50 pt-1 pb-1 pr-3 pl-3">
            <SearchIcon htmlColor="white" color="primary" />
            <form>
              <input
                className="bg-slate-50 focus:outline-none w-80"
                placeholder="Search tags..."
              ></input>
            </form>
          </div>

          <div className={style.menu}>
            <IconButton onClick={handleClick}>
              <PersonIcon />
            </IconButton>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
          >
            <MenuItem>
              <FavoriteBorder /> Likes
            </MenuItem>
            <MenuItem>
              <Settings /> Settings
            </MenuItem>
            <MenuItem>
              <Logout /> Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
