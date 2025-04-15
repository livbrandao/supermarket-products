import { Brand, Product } from "./types";
import { v4 as uuidv4 } from "uuid";

// Mock do banco de dados local
let brands: Brand[] = [
  { id: uuidv4(), name: "Coca-Cola" },
  { id: uuidv4(), name: "Nestlé" },
  { id: uuidv4(), name: "P&G" },
  { id: uuidv4(), name: "Unilever" },
  { id: uuidv4(), name: "Pepsico" },
];

let products: Product[] = [
  {
    id: uuidv4(),
    name: "Coca-Cola 2L",
    price: 9.99,
    description: "Refrigerante Coca-Cola garrafa 2 litros",
    brandId: brands[0].id,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/...",
  },
  {
    id: uuidv4(),
    name: "Nescau 400g",
    price: 8.5,
    description: "Achocolatado em pó Nescau lata 400g",
    brandId: brands[1].id,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/...",
  },
  {
    id: uuidv4(),
    name: "Sabão em Pó OMO 1kg",
    price: 15.75,
    description: "Sabão em Pó OMO Multiação pacote 1kg",
    brandId: brands[3].id,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/...",
  },
  {
    id: uuidv4(),
    name: "Doritos 140g",
    price: 12.99,
    description: "Salgadinho Doritos sabor queijo nacho 140g",
    brandId: brands[4].id,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/...",
  },
];

// Exporta funções para interagir com o banco de dados
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
  };

  // Verifica unicidade
  const existingProduct = products.find(
    (p) => p.name === newProduct.name && p.brandId === newProduct.brandId
  );

  if (existingProduct) {
    throw new Error("Já existe um produto com este nome para esta marca");
  }

  products.push(newProduct);
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

  products[index] = {
    ...products[index],
    ...product,
  };

  return products[index];
};

export const deleteProduct = (id: string): void => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Produto não encontrado");
  }

  products.splice(index, 1);
};
