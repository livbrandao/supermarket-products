"use client";
import Button from "./ui/Button";
import Link from "next/link";

interface ErrorPageProps {
  title?: string;
  message?: string;
  code?: number;
  retry?: () => void;
  backUrl?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = "Ocorreu um erro",
  message = "Não foi possível completar a operação solicitada.",
  code,
  retry,
  backUrl = "/",
}) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
      {code && (
        <p className="text-7xl font-bold text-[var(--blue-pastel)]">{code}</p>
      )}
      <h1 className="text-2xl font-bold text-[var(--blue-dark)] mt-4">
        {title}
      </h1>
      <p className="text-[var(--gray-dark-more)] mt-2 max-w-md">{message}</p>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        {retry && (
          <Button variant="primary" onClick={retry}>
            Tentar novamente
          </Button>
        )}
        <Link href={backUrl}>
          <Button variant={retry ? "outline" : "primary"}>
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
