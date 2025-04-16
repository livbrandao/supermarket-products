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
import Image from "next/image";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetchProducts(filter);
      if (response.status === 200) {
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("Erro ao buscar produtos:", response.message);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
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

    try {
      const response = await updateExistingProduct(
        selectedProduct.id,
        productData
      );

      if (response.status === 200) {
        setIsEditModalOpen(false);
        loadProducts();
        toast.success("Produto atualizado com sucesso!");
      } else {
        toast.error(`Erro ao atualizar produto: ${response.message}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast.error("Ocorreu um erro ao atualizar o produto. Tente novamente.");
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

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
    }
  };

  const columns = [
    {
      header: "Imagem",
      accessor: (product: Product) => (
        <div className="w-16 h-16 relative flex-shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
              width={64}
              height={64}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}
        </div>
      ),
      width: "10%",
    },
    {
      header: "Nome",
      accessor: "name" as keyof Product,
      width: "20%",
    },
    {
      header: "Preço",
      accessor: (product: Product) => formatPrice(product.price),
      width: "15%",
    },
    {
      header: "Descrição",
      accessor: (product: Product) => product.description || "-",
      width: "35%",
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
      <div className="flex flex-col sm:flex-row   justify-between items-start md:items-center gap-4">
        <div className="w-full sm:w-64">
          <Input
            id="search"
            label="Buscar produtos"
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

      {!isLoading && (
        <Pagination
          currentPage={filter.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {selectedProduct && (
        <>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Confirmar Exclusão"
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button variant="danger" onClick={handleDeleteProduct}>
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
            onClose={() => setIsEditModalOpen(false)}
            title="Editar Produto"
            maxWidth="max-w-4xl"
          >
            <ProductForm
              initialData={selectedProduct}
              onSubmit={handleUpdateProduct}
              isEditing={true}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default ProductList;
