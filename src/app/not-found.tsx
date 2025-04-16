import ErrorPage from "@/components/ErrorPage";

export const metadata = {
  title: "Página não encontrada | Supermercado Elfa",
  description: "A página que você está procurando não existe ou foi movida.",
};

export default function NotFound() {
  return (
    <div className="container mx-auto py-12">
      <ErrorPage
        title="Página não encontrada"
        message="A página que você está procurando não existe ou foi movida."
        code={404}
        backUrl="/"
      />
    </div>
  );
}
