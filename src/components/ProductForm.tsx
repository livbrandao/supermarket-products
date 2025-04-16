"use client";
import { fetchBrands } from "@/lib/api";
import { Brand } from "@/lib/types";
import { imageToBase64, isPositiveNumber } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import toast from "react-hot-toast";

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    price: number;
    description?: string;
    brandId: string;
    image?: string;
  };
  onSubmit: (data: any) => void;
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {
    name: "",
    price: "",
    description: "",
    brandId: "",
    image: "",
  },
  onSubmit,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialData.image
  );
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  useEffect(() => {
    const loadBrands = async () => {
      const response = await fetchBrands();
      if (response.status === 200) {
        setBrands(response.data);
      }
    };

    // Quando estiver editando, define um nome de arquivo fictício
    if (isEditing && initialData.image && !selectedFileName) {
      const hasBase64Prefix = initialData.image.startsWith("data:image");
      if (hasBase64Prefix) {
        setSelectedFileName("imagem.png");
      }
    }

    loadBrands();
  }, [isEditing, initialData.image, selectedFileName]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Aceita apenas números e um único ponto decimal
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
    const parts = sanitizedValue.split(".");
    const formattedValue =
      parts.length > 1
        ? `${parts[0]}.${parts.slice(1).join("")}`
        : sanitizedValue;

    const parsedValue = parseFloat(formattedValue) || 0;

    setFormData((prev) => ({
      ...prev,
      price: parsedValue,
    }));

    validateField(name, parsedValue);
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData]);
  };

  const validateField = (name: string, value: any) => {
    if (!touchedFields[name]) return;

    let errorMessage = "";

    switch (name) {
      case "name":
        if (!value || !value.trim()) {
          errorMessage = "Campo obrigatório";
        }
        break;
      case "price":
        if (!isPositiveNumber(value)) {
          errorMessage = "Preço deve ser um número positivo";
        }
        break;
      case "brandId":
        if (!value) {
          errorMessage = "Campo obrigatório";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file); // salva o arquivo
      setSelectedFileName(file.name);
      setErrors((prev) => ({ ...prev, image: "" }));

      try {
        const base64 = await imageToBase64(file);
        setImagePreview(base64);
      } catch (error) {
        console.error("Erro ao converter imagem:", error);
        toast.error("Erro ao converter imagem:");
      }
    }
  };

  const validateForm = () => {
    const fields = ["name", "price", "brandId"];
    const newTouchedFields = { ...touchedFields };
    fields.forEach((field) => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);

    const newErrors: Record<string, string> = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Campo obrigatório";
    }

    if (!isPositiveNumber(formData.price)) {
      newErrors.price = "Preço deve ser um número positivo";
    }

    if (!formData.brandId) {
      newErrors.brandId = "Campo obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let productData = { ...formData };

      // Se tiver uma nova imagem selecionada, converte para base64
      if (imageFile) {
        const base64Image = await imageToBase64(imageFile);
        productData.image = base64Image;
      }

      await onSubmit(productData);
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      toast.error(
        "Ocorreu um erro ao processar o formulário. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="name"
          name="name"
          label="Nome do Produto"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          placeholder="Ex: Coca-Cola 2L"
          required
        />

        <Input
          id="price"
          name="price"
          label="Preço (R$)"
          type="text"
          value={formData.price.toString()}
          onChange={handlePriceChange}
          onBlur={handleBlur}
          error={errors.price}
          placeholder="Ex: 9.99"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="brandId"
          className="block text-[var(--gray-dark-more)] font-medium mb-1"
        >
          Marca
        </label>
        <select
          id="brandId"
          name="brandId"
          value={formData.brandId}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`border border-[var(--gray-border)] rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--blue-pastel)] text-[var(--blue-dark)] ${
            errors.brandId && "border border-[var(--red)]"
          }`}
        >
          <option value="">Selecione uma marca</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
        {errors.brandId && (
          <p className="text-[var(--red)] text-sm mt-1">{errors.brandId}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-[var(--gray-dark-more)] font-medium mb-1"
        >
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="border border-[var(--gray-border)] rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--blue-pastel)] text-[var(--blue-dark)]"
          placeholder="Descrição detalhada do produto"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="image"
          className="block text-[var(--gray-dark-more)] font-medium mb-1"
        >
          Imagem do Produto
        </label>
        <div className={`border rounded-md px-3 py-2 w-full flex items-center`}>
          <div className="flex-grow flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 text-[var(--gray-dark-more)]"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            <span className="text-[var(--gray-dark-more)] truncate">
              {selectedFileName || "Nenhum arquivo selecionado"}
            </span>
          </div>
          <label
            htmlFor="image"
            className="cursor-pointer px-4 py-1 bg-[var(--blue-pastel)] text-white rounded-md hover:bg-[var(--blue)] transition-colors"
          >
            Escolher arquivo
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            onBlur={handleBlur}
          />
        </div>

        {imagePreview && (
          <div className="mt-3">
            <p className="text-sm text-[var(--gray-dark-more)] mb-2">
              Pré-visualização:
            </p>
            <img
              src={imagePreview}
              alt="Pré-visualização"
              className="w-40 h-40 object-cover border border-[var(--gray-border)] rounded-md"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {isEditing ? "Salvar Alterações" : "Cadastrar Produto"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
