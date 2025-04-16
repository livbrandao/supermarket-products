import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[var(--blue)] mb-4">
          Bem-vindo ao Supermercado Elfa
        </h1>
        <p className="text-lg text-[var(--gray-dark-more)] mb-6">
          Sistema de gerenciamento de produtos para o supermercado
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/produtos">
            <Button variant="primary" className="px-6 py-3">
              Ver Produtos
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button variant="secondary" className="px-6 py-3">
              Cadastrar Produto
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md transform-content hover:scale-105 transition-transform duration-300 ease-in-out">
          <h2 className="text-xl font-semibold text-[var(--blue)] mb-3">
            Gerenciamento Completo
          </h2>
          <p className="text-[var(--gray-dark-more)]">
            Cadastre, edite e remova produtos do catálogo com facilidade e
            rapidez.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md transform-content hover:scale-105 transition-transform duration-300 ease-in-out">
          <h2 className="text-xl font-semibold text-[var(--blue)] mb-3">
            Controle de Estoque
          </h2>
          <p className="text-[var(--gray-dark-more)]">
            Mantenha seu inventário organizado com nosso sistema intuitivo.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md transform-content hover:scale-105 transition-transform duration-300 ease-in-out">
          <h2 className="text-xl font-semibold text-[var(--blue)] mb-3">
            Preços Atualizados
          </h2>
          <p className="text-[var(--gray-dark-more)]">
            Mantenha os preços de seus produtos sempre atualizados.
          </p>
        </div>
      </div>
    </main>
  );
}
