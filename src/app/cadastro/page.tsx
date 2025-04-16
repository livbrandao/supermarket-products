"use client";
import React from "react";
import ProductForm from "@/components/ProductForm";
import { useRouter } from "next/navigation";
import { createNewProduct } from "@/lib/api";
import toast from "react-hot-toast";

export default function CadastroPage() {
  const router = useRouter();

  const handleSubmit = async (productData: any) => {
    try {
      const response = await createNewProduct(productData);

      if (response.status === 201) {
        toast.success("Produto cadastrado com sucesso!");
        router.push("/produtos");
      } else {
        toast.error(`Erro ao cadastrar produto: ${response.message}`);
      }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      toast.error("Ocorreu um erro ao cadastrar o produto. Tente novamente.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[var(--blue)] mb-6">
        Cadastrar Novo Produto
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
