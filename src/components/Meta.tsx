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
      <meta name="description" content={`${description}`} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}

export default Meta;