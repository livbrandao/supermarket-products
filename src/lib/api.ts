import {
  getAllBrands,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./db";
import {
  ApiResponse,
  Brand,
  PaginatedResponse,
  Product,
  ProductFilter,
} from "./types";

// Simula atraso da API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API de Produtos
export const fetchProducts = async (
  filters: ProductFilter
): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  await delay(500); // Simula delay de rede

  try {
    let products = getAllProducts();

    // Aplica filtro por nome
    if (filters.name) {
      const searchTerm = filters.name.toLowerCase();
      products = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
    }

    // Calcula total de páginas
    const total = products.length;
    const totalPages = Math.ceil(total / filters.limit);

    // Aplica paginação
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    const paginatedProducts = products.slice(start, end);

    return {
      status: 200,
      data: {
        data: paginatedProducts,
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Erro ao buscar produtos",
      data: {
        data: [],
        total: 0,
        page: filters.page,
        limit: filters.limit,
        totalPages: 0,
      },
    };
  }
};

export const fetchProductById = async (
  id: string
): Promise<ApiResponse<Product>> => {
  await delay(300);

  try {
    const product = getProductById(id);

    if (!product) {
      return {
        status: 404,
        message: "Produto não encontrado",
        data: {} as Product,
      };
    }

    return {
      status: 200,
      data: product,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Erro ao buscar produto",
      data: {} as Product,
    };
  }
};

export const createNewProduct = async (
  product: Omit<Product, "id">
): Promise<ApiResponse<Product>> => {
  await delay(700);

  try {
    const newProduct = createProduct(product);

    return {
      status: 201,
      data: newProduct,
    };
  } catch (error) {
    return {
      status: 400,
      message: error instanceof Error ? error.message : "Erro ao criar produto",
      data: {} as Product,
    };
  }
};

export const updateExistingProduct = async (
  id: string,
  product: Partial<Omit<Product, "id">>
): Promise<ApiResponse<Product>> => {
  await delay(600);

  try {
    const updatedProduct = updateProduct(id, product);

    return {
      status: 200,
      data: updatedProduct,
    };
  } catch (error) {
    return {
      status:
        error instanceof Error && error.message === "Produto não encontrado"
          ? 404
          : 400,
      message:
        error instanceof Error ? error.message : "Erro ao atualizar produto",
      data: {} as Product,
    };
  }
};

export const deleteExistingProduct = async (
  id: string
): Promise<ApiResponse<null>> => {
  await delay(500);

  try {
    deleteProduct(id);

    return {
      status: 200,
      data: null,
    };
  } catch (error) {
    return {
      status:
        error instanceof Error && error.message === "Produto não encontrado"
          ? 404
          : 500,
      message:
        error instanceof Error ? error.message : "Erro ao excluir produto",
      data: null,
    };
  }
};

// API de Marcas
export const fetchBrands = async (): Promise<ApiResponse<Brand[]>> => {
  await delay(300);

  try {
    const brands = getAllBrands();

    return {
      status: 200,
      data: brands,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Erro ao buscar marcas",
      data: [],
    };
  }
};
