import { Brand, Product } from "./types";
import { v4 as uuidv4 } from "uuid";

// Dados para marcas e produtos
const initialBrands: Brand[] = [
  { id: uuidv4(), name: "Coca-Cola" },
  { id: uuidv4(), name: "Nestlé" },
  { id: uuidv4(), name: "P&G" },
  { id: uuidv4(), name: "Unilever" },
  { id: uuidv4(), name: "Pepsico" },
];

const initialProducts: Product[] = [
  {
    id: uuidv4(),
    name: "Coca-Cola 2L",
    price: 9.99,
    description: "Refrigerante Coca-Cola garrafa 2 litros",
    brandId: initialBrands[0].id,
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWAAAACuCAYAAAAI9Nc8AAAdDUlEQVR4nO3df3BT54Hu8a+NMFFAJJYTQaVgw6KkCnV6MQWxOI1pMcGzA0zclubW3YZ2fOem05tOyfayvWxnspkMNy1L2GzIJJ2J/3BnSBunjds6G5isszU0TjCDSLAvOERp7MWikQsCy4ACBxsh3T/k35JsQWyODc9nxoPl856j95Xxo1fv+55zss6ePRsnjXg8edOuXbv45JNP0u0iIiIZyk63IVX4fvDBBw",
  },
  {
    id: uuidv4(),
    name: "Nescau 400g",
    price: 8.5,
    description: "Achocolatado em pó Nescau lata 400g",
    brandId: initialBrands[1].id,
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACW...",
  },
  {
    id: uuidv4(),
    name: "Sabão em Pó OMO 1kg",
    price: 15.75,
    description: "Sabão em Pó OMO Multiação pacote 1kg",
    brandId: initialBrands[3].id,
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACW...",
  },
  {
    id: uuidv4(),
    name: "Doritos 140g",
    price: 12.99,
    description: "Salgadinho Doritos sabor queijo nacho 140g",
    brandId: initialBrands[4].id,
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACW...",
  },
  {
    id: uuidv4(),
    name: "Suco de Laranja Del Valle 1L",
    price: 6.99,
    description: "Suco de Laranja Del Valle 1L",
    brandId: initialBrands[4].id,
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACW...",
  },
];

// Função para carregar dados do localStorage
const loadFromStorage = <T>(key: string, initialData: T): T => {
  if (typeof window === "undefined") {
    return initialData; // Retorna dados iniciais se não estiver no ambiente do navegador
  }

  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : initialData;
};

// Função para salvar dados no localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Carrega dados do localStorage ou usa dados iniciais
let brands: Brand[] = loadFromStorage("brands", initialBrands);
let products: Product[] = loadFromStorage("products", initialProducts);

// Função para comprimir dados base64 de imagens
const compressImageData = (base64Data: string): string => {
  // Se já for uma URL, não comprime
  if (base64Data.startsWith("http")) {
    return base64Data;
  }

  // Se for uma string base64 muito grande (> 1MB), converte para URL de placeholder
  if (base64Data.length > 1024 * 1024) {
    return `https://placehold.co/400x400/eee/fff?text=Produto`;
  }

  return base64Data;
};

// Exporta as funções para manipulação de produtos e marcas
export const getAllBrands = (): Brand[] => {
  return [...brands];
};

export const getAllProducts = (): Product[] => {
  return [...products];
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getBrandById = (id: string): Brand | undefined => {
  return brands.find((brand) => brand.id === id);
};

export const createProduct = (product: Omit<Product, "id">): Product => {
  const newProduct = {
    ...product,
    id: uuidv4(),
    // Comprime a imagem se existir
    image: product.image ? compressImageData(product.image) : undefined,
  };

  // Verifica unicidade
  const existingProduct = products.find(
    (p) => p.name === newProduct.name && p.brandId === newProduct.brandId
  );

  if (existingProduct) {
    throw new Error("Já existe um produto com este nome para esta marca");
  }

  products.push(newProduct);
  saveToStorage("products", products); // Salva no localStorage
  return newProduct;
};

export const updateProduct = (
  id: string,
  product: Partial<Omit<Product, "id">>
): Product => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Produto não encontrado");
  }

  // Verifica unicidade se estiver atualizando esses campos
  if (product.name || product.brandId) {
    const newName = product.name || products[index].name;
    const newBrandId = product.brandId || products[index].brandId;

    const existingProduct = products.find(
      (p) => p.id !== id && p.name === newName && p.brandId === newBrandId
    );

    if (existingProduct) {
      throw new Error("Já existe um produto com este nome para esta marca");
    }
  }

  // Comprime a imagem se estiver sendo atualizada
  const updatedProduct = {
    ...products[index],
    ...product,
  };

  if (product.image) {
    updatedProduct.image = compressImageData(product.image);
  }

  products[index] = updatedProduct;
  saveToStorage("products", products); // Salva no localStorage
  return products[index];
};

export const deleteProduct = (id: string): void => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Produto não encontrado");
  }

  products.splice(index, 1);
  saveToStorage("products", products); // Salva no localStorage
};
