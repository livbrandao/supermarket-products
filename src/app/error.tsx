"use client";

import ErrorPage from "@/components/ErrorPage";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="container mx-auto py-12">
          <ErrorPage
            title="Algo deu errado"
            message="Ocorreu um erro inesperado. Nossa equipe foi notificada."
            retry={reset}
          />
        </div>
      </body>
    </html>
  );
}
