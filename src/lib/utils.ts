import { debounce } from "lodash";

// Formata preço em moeda br
export const formatPrice = (price: number): string => {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

// Formata data
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("pt-BR");
};

// Valida se o string é um UUID válido
export const isUUID = (id: string) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Converte imagem para base64
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Verificação de tamanho
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("A imagem não pode ter mais de 5MB"));
      return;
    }

    // Verificação de tipo
    if (!file.type.startsWith("image/")) {
      reject(new Error("O arquivo deve ser uma imagem válida"));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Verificação adicional para garantir que leu corretamente
      if (typeof reader.result !== "string") {
        reject(new Error("Falha na leitura da imagem"));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Debounce para input de busca
export const debouncedSearch = debounce((callback: Function, value: string) => {
  callback(value);
}, 300);

// Valida se é um número positivo
export const isPositiveNumber = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};
