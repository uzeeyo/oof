import React from "react";

import style from  "../styles/Footer.module.css";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className={style.Footer}>
      <div className={`${style.m20} ${style["flex-col"]}`}>
        <h3 className="text-dark max-w30">
          Our vision is to be a social media platform that allow users to
          anonymously submit their ideas and questions without worrying about
          woke-ism and cancel culture.
        </h3>
      </div>
    </div>
  );
};

export default Footer;
