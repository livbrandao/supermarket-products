import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-[var(--blue)] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Supermarcado Elfa
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--blue-pastel)] transition-colors"
                >
                  Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/cadastro"
                  className="hover:text-[var(--blue-pastel)] transition-colors"
                >
                  Novo Produto
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
