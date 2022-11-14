import React, {
  useState,
  MouseEvent,
  FormEventHandler,
  ChangeEvent,
} from "react";
import style from "../styles/Header.module.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import {
  BookmarkBorder,
  FavoriteBorder,
  Logout,
  Settings,
  Visibility,
} from "@mui/icons-material";
import { useRouter } from "next/router";

type Props = {};

const Header = (props: Props) => {
  //FOR: User menu
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //FOR: Tag Search
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (searchQuery.length > 0) {
      router.push(`/posts?tag=${searchQuery}`);
    } else {
      router.push("/posts");
    }
  };

  const onLogoutClick = (e: MouseEvent<HTMLElement>) => {
    fetch("/api/auth/logout", { method: "POST" }).then((res) => {
      if (res.ok) {
        router.push("/")
      }
    });
  };

  return (
    <header className={style.Header}>
      <div>
        <div className="flex flex-row items-center">
          <div className="p-2">
            <Link href="/" className="p-20">
              <a>
                <img src="/images/logo.png" className="w-10 md:w-20" />
              </a>
            </Link>
          </div>

          <div className="flex flex-row ml-auto mr-auto rounded-xl bg-slate-50 pt-1 pb-1 pr-3 pl-3">
            <SearchIcon htmlColor="white" color="primary" />
            <form onSubmit={onSubmit}>
              <input
                className="bg-slate-50 focus:outline-none md:w-80"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={onSearchChange}
              ></input>
            </form>
          </div>

          <div className="">
            <IconButton>
              <Visibility color="secondary" className="w-7 h-7" />
            </IconButton>
            <IconButton onClick={handleClick}>
              <PersonIcon className="w-7 h-7" />
            </IconButton>
          </div>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
          >
            <MenuItem>
              <FavoriteBorder className="mr-2" /> Likes
            </MenuItem>
            <MenuItem>
              <BookmarkBorder className="mr-2" /> Bookmarks
            </MenuItem>
            <MenuItem>
              <Settings className="mr-2" /> Settings
            </MenuItem>
            <MenuItem onClick={onLogoutClick}>
              <Logout className="mr-2"/> Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
