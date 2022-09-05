import React from "react";
import style from "../styles/Header.module.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className={style.Header}>
      <div>
        <div className={style.titlebar}>
          <div className={style.logo}>
            <Link href="/">
              <img src="/images/logo.png" />
            </Link>
          </div>

          <div className={style.menu}>
            <div className={style.searchbar}>
              <SearchIcon htmlColor="white" />
              <form>
                <input></input>
              </form>
            </div>

            <PersonIcon />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
