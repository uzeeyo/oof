import Head from "next/head";
import React from "react";

type Props = {
  title: string;
  description: string;
};

function Meta({ title, description }: Props) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={`${description}`}/>
    </Head>
  );
}

export default Meta;
