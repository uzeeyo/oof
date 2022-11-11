import Meta from "./Meta";

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Meta
        title="oof"
        description="Anonymously post your wildest thoughts or questions."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <main> {children} </main>
    </>
  );
}
