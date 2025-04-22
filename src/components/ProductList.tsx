"use client";
import {
  fetchProducts,
  updateExistingProduct,
  deleteExistingProduct,
} from "@/lib/api";
import { Product, ProductFilter } from "@/lib/types";
import { debouncedSearch, formatPrice } from "@/lib/utils";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Table from "./ui/Table";
import ProductForm from "./ProductForm";
import toast from "react-hot-toast";
import Pagination from "./Pagination";
import ImageWithFallback from "./ImageWithFallback";
import ErrorPage from "./ErrorPage";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    hasError: boolean;
    message?: string;
    code?: number;
  }>({ hasError: false });
  const [filter, setFilter] = useState<ProductFilter>({
    name: "",
    page: 1,
    limit: 5,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError({ hasError: false });

    try {
      const response = await fetchProducts(filter);
      if (response.status === 200) {
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("Erro ao buscar produtos:", response.message);
        setError({
          hasError: true,
          message: response.message || "Erro ao buscar produtos",
          code: response.status,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setError({
        hasError: true,
        message: "Erro de conexão. Verifique sua internet.",
        code: 500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(() => {
      setFilter((prev) => ({ ...prev, name: value, page: 1 }));
    }, value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setFilter((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateProduct = async (productData: any) => {
    if (!selectedProduct) return;

    setIsActionLoading(true);
    try {
      const response = await updateExistingProduct(
        selectedProduct.id,
        productData
      );

      if (response.status === 200) {
        setIsEditModalOpen(false);
        loadProducts();
      } else {
        toast.error(`Erro ao atualizar produto: ${response.message}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast.error("Ocorreu um erro ao atualizar o produto. Tente novamente.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setIsActionLoading(true);
    try {
      const response = await deleteExistingProduct(selectedProduct.id);

      if (response.status === 200) {
        setIsDeleteModalOpen(false);
        loadProducts();
        toast.success("Produto excluído com sucesso!");
      } else {
        toast.error(`Erro ao excluir produto: ${response.message}`);
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error("Ocorreu um erro ao excluir o produto. Tente novamente.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Se houver um erro, mostre a página de erro
  if (error.hasError && !isLoading) {
    return (
      <ErrorPage
        title="Erro ao carregar produtos"
        message={
          error.message || "Não foi possível carregar a lista de produtos."
        }
        code={error.code}
        retry={loadProducts}
      />
    );
  }

  const columns = [
    {
      header: "Imagem",
      accessor: (product: Product) => (
        <div className="">
          {product.image ? (
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              width={64}
              height={64}
              className="w-full h-full"
            />
          ) : (
            <p className="bg-gray-200 rounded-md text-gray-500 text-xs text-center p-1">
              Não contém imagem
            </p>
          )}
        </div>
      ),
      width: "10%",
    },
    {
      header: "Nome",
      accessor: "name" as keyof Product,
      width: "15%",
    },
    {
      header: "Marca",
      accessor: (product: Product) =>
        product.brand?.name || "Marca não informada",
      width: "15%",
    },
    {
      header: "Preço",
      accessor: (product: Product) => formatPrice(product.price),
      width: "10%",
    },
    {
      header: "Descrição",
      accessor: (product: Product) => product.description || "-",
      width: "30%",
    },
    {
      header: "Ações",
      accessor: (product: Product) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            className="px-2 py-1 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(product);
            }}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            className="px-2 py-1 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(product);
            }}
          >
            Excluir
          </Button>
        </div>
      ),
      width: "20%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full sm:w-64">
          <label
            htmlFor="name"
            className="block text-[var(--gray-dark-more)] font-medium mb-1"
          >
            Buscar produtos
          </label>
          <Input
            id="search"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Digite o nome do produto"
            className="bg-white"
          />
        </div>
        <Link href="/cadastro">
          <Button variant="primary">Novo Produto</Button>
        </Link>
      </div>

      <Table
        columns={columns}
        data={products}
        isLoading={isLoading}
        emptyMessage="Nenhum produto encontrado"
      />

      {!isLoading && products.length > 0 && (
        <Pagination
          currentPage={filter.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {searchTerm && products.length === 0 && !isLoading && (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            Nenhum produto encontrado para "{searchTerm}"
          </p>
          <button
            onClick={() => handleSearch("")}
            className="text-blue-500 underline mt-2"
          >
            Limpar busca
          </button>
        </div>
      )}

      {selectedProduct && (
        <>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => !isActionLoading && setIsDeleteModalOpen(false)}
            title="Confirmar Exclusão"
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isActionLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteProduct}
                  isLoading={isActionLoading}
                >
                  Confirmar Exclusão
                </Button>
              </>
            }
          >
            <p>
              Tem certeza que deseja excluir o produto{" "}
              <strong>{selectedProduct.name}</strong>?
            </p>
            <p className="mt-2 text-[var(--gray-dark-more)]">
              Esta ação não poderá ser desfeita.
            </p>
          </Modal>

          <Modal
            isOpen={isEditModalOpen}
            onClose={() => !isActionLoading && setIsEditModalOpen(false)}
            title="Editar Produto"
            maxWidth="max-w-4xl"
          >
            <ProductForm
              initialData={selectedProduct}
              onSubmit={handleUpdateProduct}
              isEditing={true}
              isSubmitting={isActionLoading}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default ProductList;
