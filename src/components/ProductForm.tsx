"use client";
import { fetchBrands } from "@/lib/api";
import { Brand } from "@/lib/types";
import { imageToBase64, isPositiveNumber } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import toast from "react-hot-toast";
import ErrorPage from "./ErrorPage";

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    price: number;
    description?: string;
    brand: Brand;
    brandId?: string;
    image?: string;
  };
  onSubmit: (data: any) => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
  brandOptions?: Brand[];
}

const defaultFormData = {
  name: "",
  price: 0,
  description: "",
  brand: { id: "", name: "" },
  brandId: "",
  image: "",
};

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
  isSubmitting = false,
  brandOptions,
}) => {
  const filledInitialData = {
    ...defaultFormData,
    ...initialData,
    description: initialData?.description ?? "",
    image: initialData?.image ?? "",
    brandId: initialData?.brand?.id ?? "",
  };

  const [formData, setFormData] =
    useState<typeof defaultFormData>(filledInitialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadError, setLoadError] = useState({
    hasError: false as boolean,
    message: "",
  });
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialData?.image
  );
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");

  useEffect(() => {
    // Quando estiver editando, define um nome de arquivo fictício
    if (isEditing && initialData?.image && !selectedFileName) {
      const hasBase64Prefix = initialData.image.startsWith("data:image");
      const isUrl = initialData.image.startsWith("http");

      if (hasBase64Prefix) {
        setSelectedFileName("imagem_atual.png");
      } else if (isUrl) {
        // Extrai o nome do arquivo da URL
        const urlParts = initialData.image.split("/");
        const fileName =
          urlParts[urlParts.length - 1].split("?")[0] || "imagem_atual.png";
        setSelectedFileName(fileName);
      }
    }
  }, [isEditing, initialData?.image, selectedFileName]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "brandName") {
      setFormData((prev) => ({
        ...prev!,
        brand: { ...prev!.brand, name: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev!, [name]: value }));
    }

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

    setFormData((prev) => ({ ...prev!, price: parsedValue }));
    validateField(name, parsedValue);
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    if (formData) validateField(name, formData[name as keyof typeof formData]);
  };

  const validateField = (name: string, value: any) => {
    if (!touchedFields[name]) return;

    let errorMessage = "";

    switch (name) {
      case "name":
        if (!value || !value.trim()) errorMessage = "Campo obrigatório";
        else if (value.trim().length < 3)
          errorMessage = "Nome deve ter pelo menos 3 caracteres";
        break;
      case "price":
        if (!isPositiveNumber(value))
          errorMessage = "Preço deve ser um número positivo";
        break;
      case "brandName":
        if (!value || !value.trim()) errorMessage = "Campo obrigatório";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    return errorMessage;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const newTouchedFields = {
      ...touchedFields,
      name: true,
      price: true,
      brandName: true,
    };
    setTouchedFields(newTouchedFields);

    if (!formData.name || !formData.name.trim())
      newErrors.name = "Campo obrigatório";
    else if (formData.name.trim().length < 3)
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";

    if (!isPositiveNumber(formData.price))
      newErrors.price = "Preço deve ser um número positivo";

    if (!formData.brand.name || !formData.brand.name.trim())
      newErrors.brandName = "Campo obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Verifique os campos do formulário");
      return;
    }

    // Verificar se uma marca foi preenchida
    if (!formData.brand.name.trim()) {
      toast.error("Por favor, digite o nome da marca.");
      return;
    }

    setIsLoading(true);

    try {
      // Verificação do preço
      const price = parseFloat(formData.price.toString());
      if (isNaN(price)) {
        toast.error("Preço inválido.");
        setIsLoading(false);
        return;
      }

      // Preparar dados para envio
      const productData = {
        ...formData,
        price,
        image: imagePreview || undefined,
      };

      await onSubmit(productData);

      if (!isEditing) {
        // Limpa o formulário após sucesso se estiver criando um novo produto
        setFormData({
          name: "",
          price: 0,
          description: "",
          brand: { id: "", name: "" },
          brandId: "",
          image: "",
        });
        setImageFile(null);
        setImagePreview(undefined);
        setSelectedFileName("");
        setTouchedFields({});
      }

      toast.success(
        isEditing
          ? "Produto atualizado com sucesso!"
          : "Produto cadastrado com sucesso!"
      );
    } catch (error: any) {
      if (error.response) {
        toast.error(`Erro ao salvar produto: ${error.response.data.message}`);
      } else {
        toast.error("Erro ao salvar produto. Tente novamente.");
      }
      console.error("Erro ao salvar produto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImageError("");

    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setImageError("A imagem deve ter no máximo 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setImageError("O arquivo selecionado não é uma imagem válida");
        return;
      }

      setImageFile(file);
      setSelectedFileName(file.name);

      try {
        const base64 = await imageToBase64(file);
        setImagePreview(base64);
      } catch (error) {
        console.error("Erro ao converter imagem:", error);
        toast.error("Erro ao converter imagem");
        setImageError("Erro ao processar a imagem");
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(undefined);
    setSelectedFileName("");
  };

  // Se houver erro ao carregar as marcas
  if (loadError.hasError) {
    return (
      <ErrorPage
        message={loadError.message}
        retry={() => window.location.reload()}
      />
    );
  }

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
          placeholder="Digite o nome do produto"
          disabled={isLoading || isSubmitting}
          error={errors.name}
          required
        />

        <Input
          id="price"
          name="price"
          label="Preço (R$)"
          type="text"
          value={formData.price}
          onChange={handlePriceChange}
          onBlur={handleBlur}
          placeholder="0.00"
          disabled={isLoading || isSubmitting}
          error={errors.price}
          required
        />
      </div>

      <div className="mb-4">
        <Input
          id="brandName"
          name="brandName"
          label="Marca"
          value={formData.brand.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Digite o nome da marca"
          disabled={isLoading || isSubmitting}
          error={errors.brandName}
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-[var(--blue-dark)] font-medium mb-1"
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
          className="block text-[var(--blue-dark)] font-medium mb-1"
        >
          Imagem do Produto
        </label>

        <div className="mt-2 flex flex-col space-y-4">
          {/* Preview da imagem */}
          {imagePreview && (
            <div className="relative">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                title="Remover imagem"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-w-[300px] h-auto object-contain border rounded"
              />
            </div>
          )}

          {/* Input de arquivo */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-xs md:text-lg px-2 md:px-4 py-1 bg-[var(--blue-pastel)] text-white rounded-md hover:bg-[var(--blue)] transition-colors ml-2 md:ml-0 text-center"
              >
                {imagePreview ? "Trocar imagem" : "Selecionar imagem"}
              </label>
              {selectedFileName && (
                <span className="text-sm text-gray-600 truncate max-w-xs">
                  {selectedFileName}
                </span>
              )}
            </div>

            <input
              id="image-upload"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading || isSubmitting}
              className="hidden"
            />

            <p className="text-gray-500 text-xs">
              Formatos aceitos: JPG, PNG, GIF | Tamanho máximo: 5MB
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          disabled={isLoading || isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || isSubmitting}
          isLoading={isLoading || isSubmitting}
        >
          {isEditing ? "Atualizar" : "Cadastrar"} Produto
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
