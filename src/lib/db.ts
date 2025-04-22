import { Brand, Product } from "./types";
import { v4 as uuidv4 } from "uuid";

// Cria IDs fixos para marcas
const brandIds = {
  apple: uuidv4(),
  samsung: uuidv4(),
  nike: uuidv4(),
  adidas: uuidv4(),
  nestle: uuidv4(),
  cocaCola: uuidv4(),
  sony: uuidv4(),
  microsoft: uuidv4(),
  dell: uuidv4(),
  hp: uuidv4(),
};

// Dados iniciais para marcas
const initialBrands: Brand[] = [
  { id: brandIds.apple, name: "Apple" },
  { id: brandIds.samsung, name: "Samsung" },
  { id: brandIds.nike, name: "Nike" },
  { id: brandIds.adidas, name: "Adidas" },
  { id: brandIds.nestle, name: "Nestlé" },
  { id: brandIds.cocaCola, name: "Coca-Cola" },
  { id: brandIds.sony, name: "Sony" },
  { id: brandIds.microsoft, name: "Microsoft" },
  { id: brandIds.dell, name: "Dell" },
  { id: brandIds.hp, name: "HP" },
];

// Dados iniciais para produtos
const initialProducts: Product[] = [
  {
    id: uuidv4(),
    name: "iPhone 15 Pro",
    price: 999.99,
    description: "Smartphone Apple com processador A17 Pro e câmera de 48MP",
    brand: initialBrands.find((b) => b.id === brandIds.apple)!,
    brandId: brandIds.apple,
    image: "https://placehold.co/400x400/eee/fff?text=iPhone+15",
  },
  {
    id: uuidv4(),
    name: "Galaxy S24 Ultra",
    price: 1199.99,
    description: "Smartphone Samsung com tela Dynamic AMOLED 2X e S Pen",
    brand: initialBrands.find((b) => b.id === brandIds.samsung)!,
    brandId: brandIds.samsung,
    image: "https://placehold.co/400x400/eee/fff?text=Galaxy+S24",
  },
  {
    id: uuidv4(),
    name: "Air Jordan 1",
    price: 189.99,
    description: "Tênis Nike Air Jordan 1 High OG para basquete",
    brand: initialBrands.find((b) => b.id === brandIds.nike)!,
    brandId: brandIds.nike,
    image: "https://placehold.co/400x400/eee/fff?text=Air+Jordan",
  },
  {
    id: uuidv4(),
    name: "Ultraboost 24",
    price: 220.0,
    description: "Tênis de corrida Adidas com tecnologia Boost",
    brand: initialBrands.find((b) => b.id === brandIds.adidas)!,
    brandId: brandIds.adidas,
    image: "https://placehold.co/400x400/eee/fff?text=Ultraboost",
  },
  {
    id: uuidv4(),
    name: "Nescafé Gold",
    price: 12.99,
    description: "Café solúvel premium 100g",
    brand: initialBrands.find((b) => b.id === brandIds.nestle)!,
    brandId: brandIds.nestle,
    image: "https://placehold.co/400x400/eee/fff?text=Nescafé",
  },
  {
    id: uuidv4(),
    name: "Coca-Cola Zero 2L",
    price: 8.99,
    description: "Refrigerante zero açúcar garrafa 2 litros",
    brand: initialBrands.find((b) => b.id === brandIds.cocaCola)!,
    brandId: brandIds.cocaCola,
    image: "https://placehold.co/400x400/eee/fff?text=Coca+Zero",
  },
  {
    id: uuidv4(),
    name: "PlayStation 5",
    price: 499.99,
    description: "Console Sony PlayStation 5 com leitor de disco",
    brand: initialBrands.find((b) => b.id === brandIds.sony)!,
    brandId: brandIds.sony,
    image: "https://placehold.co/400x400/eee/fff?text=PS5",
  },
  {
    id: uuidv4(),
    name: "Xbox Series X",
    price: 499.99,
    description: "Console Microsoft Xbox Series X 1TB",
    brand: initialBrands.find((b) => b.id === brandIds.microsoft)!,
    brandId: brandIds.microsoft,
    image: "https://placehold.co/400x400/eee/fff?text=Xbox",
  },
  {
    id: uuidv4(),
    name: "XPS 13",
    price: 1299.99,
    description: "Notebook Dell XPS 13 com processador Intel Core i7",
    brand: initialBrands.find((b) => b.id === brandIds.dell)!,
    brandId: brandIds.dell,
    image: "https://placehold.co/400x400/eee/fff?text=XPS+13",
  },
  {
    id: uuidv4(),
    name: "Spectre x360",
    price: 1399.99,
    description: "Notebook conversível HP com tela touchscreen OLED",
    brand: initialBrands.find((b) => b.id === brandIds.hp)!,
    brandId: brandIds.hp,
    image: "https://placehold.co/400x400/eee/fff?text=Spectre",
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

// Verifica se os produtos existentes têm marcas válidas
const validateProductBrands = () => {
  let hasInvalidBrands = false;

  // Obtém todos os IDs de marcas existentes
  const brandIds = brands.map((brand) => brand.id);

  products = products.map((product) => {
    // Verifica se a marca do produto é válida
    if (!product.brand || !brandIds.includes(product.brand.id)) {
      hasInvalidBrands = true;
      // Atribui a primeira marca como padrão caso a marca não seja válida
      return { ...product, brand: brands[0], brandId: brands[0].id };
    }
    return product;
  });

  // Se houve correções, salva os produtos atualizados
  if (hasInvalidBrands) {
    saveToStorage("products", products);
    console.log("Produtos com marcas inválidas foram corrigidos");
  }
};

// Chama a validação ao inicializar
validateProductBrands();

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

// Função para encontrar ou criar uma marca
const findOrCreateBrand = (brandName: string): Brand => {
  // Procura por marcas com o mesmo nome (case insensitive)
  const existingBrand = brands.find(
    (b) => b.name.toLowerCase() === brandName.toLowerCase()
  );

  if (existingBrand) {
    return existingBrand;
  }

  // Se não encontrar, cria uma nova marca
  const newBrand: Brand = {
    id: uuidv4(),
    name: brandName.trim(),
  };

  brands.push(newBrand);
  saveToStorage("brands", brands);

  return newBrand;
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
  // Processa a marca - encontra ou cria uma nova
  const brand = findOrCreateBrand(product.brand.name);

  const newProduct = {
    ...product,
    id: uuidv4(),
    brand,
    brandId: brand.id,
    // Comprime a imagem se existir
    image: product.image ? compressImageData(product.image) : undefined,
  };

  // Verifica unicidade de [name, brandId]
  const existingProduct = products.find(
    (p) =>
      p.name.toLowerCase() === newProduct.name.toLowerCase() &&
      p.brandId === newProduct.brandId
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

  const updatedProduct = { ...products[index] };

  // Se estiver atualizando o nome da marca
  if (product.brand?.name) {
    const brand = findOrCreateBrand(product.brand.name);
    updatedProduct.brand = brand;
    updatedProduct.brandId = brand.id;
  }

  // Atualiza outros campos
  if (product.name !== undefined) updatedProduct.name = product.name;
  if (product.price !== undefined) updatedProduct.price = product.price;
  if (product.description !== undefined)
    updatedProduct.description = product.description;

  // Verifica unicidade de [name, brandId]
  if (product.name || product.brand?.name) {
    const duplicateProduct = products.find(
      (p) =>
        p.id !== id &&
        p.name.toLowerCase() === updatedProduct.name.toLowerCase() &&
        p.brandId === updatedProduct.brandId
    );

    if (duplicateProduct) {
      throw new Error("Já existe um produto com este nome para esta marca");
    }
  }

  // Comprime a imagem se estiver sendo atualizada
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
