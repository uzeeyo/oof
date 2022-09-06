import { ReactNode } from "react";
import Meta from './Meta'

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Meta title="oof" description="Anonymously post your wildest thoughts or questions." 
      />
      <main> {children} </main>
    </>
  );
}
