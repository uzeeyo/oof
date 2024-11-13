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
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import {
  BookmarkBorder,
  FavoriteBorder,
  Logout,
  Settings,
  Visibility,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { useAuth } from "../lib/AuthProvider";

type Props = {};

const Header = (props: Props) => {
  const { isLoggedIn } = useAuth();

  //FOR: User menu
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { logOut } = useAuth();

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

  return (
    <header className="fixed w-full z-50 py-2 flex flex-row items-center backdrop-blur bg-black bg-opacity-70">
      <div className="p-2">
        <Link href="/" className="p-20">
          <a>
            <img src="/logo.png" alt="Logo" className="w-10 md:w-20" />
          </a>
        </Link>
      </div>

      <div className="flex flex-row mx-auto rounded-2xl py-1 px-3 border border-slate-200">
        <SearchIcon className="mr-1" htmlColor="white" color="primary" />
        <form onSubmit={onSubmit}>
          <input
            className="focus:outline-none md:w-80 bg-transparent text-gray-200"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={onSearchChange}
          ></input>
        </form>
      </div>

      <div className="mr-2">
        <IconButton>
          <Visibility color="secondary" className="w-7 h-7" />
        </IconButton>

        {isLoggedIn && (
          <IconButton onClick={handleClick}>
            <PersonIcon className="w-7 h-7" color="primary" />
          </IconButton>
        )}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <Link href={"/posts/liked"}>
          <MenuItem>
            <FavoriteBorder className="mr-2" /> Likes
          </MenuItem>
        </Link>
        <MenuItem>
          <BookmarkBorder className="mr-2" /> Bookmarks
        </MenuItem>
        <Link href={"/settings"}>
          <MenuItem>
            <Settings className="mr-2" /> Settings
          </MenuItem>
        </Link>
        <MenuItem onClick={() => logOut()}>
          <Logout className="mr-2" /> Logout
        </MenuItem>
      </Menu>
    </header>
  );
};

export default Header;
