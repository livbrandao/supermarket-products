# 🛒 Sistema de Gerenciamento de Produtos

[![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

Um sistema para gestão de produtos de supermercado com uma interface amigável e funcionalidades completas de CRUD.

## 📋 Funcionalidades

- ✨ **Listagem de Produtos**: Visualize todos os produtos com paginação
- 🔍 **Busca**: Encontre produtos por nome
- ➕ **Cadastro**: Adicione novos produtos com validação de formulário
- ✏️ **Edição**: Atualize informações de produtos existentes
- 🗑️ **Exclusão**: Remova produtos com confirmação
- 📱 **Responsivo**: Interface adaptável para dispositivos móveis e desktop
- 🖼️ **Upload de Imagens**: Adicione imagens aos produtos com preview
- 🔌 **Detecção Offline**: Notificações quando a conexão com a internet é perdida ou restaurada

## 🛠️ Tecnologias Utilizadas

- **Next.js 15.3.0**: Framework React com renderização do lado do servidor
- **React 19**: Biblioteca para construção de interfaces
- **TypeScript**: Tipagem estática para código mais seguro
- **Tailwind CSS**: Framework CSS utilitário para design responsivo
- **React Hook Form**: Validação e gerenciamento de formulários
- **React Hot Toast**: Notificações elegantes
- **UUID**: Geração de IDs únicos
- **LocalStorage**: Persistência de dados no navegador

## ⚙️ Estrutura do Projeto

- **`/components`**: Componentes reutilizáveis da UI
  - **`ProductForm`**: Formulário para criação e edição de produtos
  - **`ProductList`**: Lista de produtos com funcionalidades CRUD
  - **`ErrorPage`**: Página de erro customizável com opções de navegação
  - **`ImageWithFallback`**: Componente de imagem com fallback para casos de erro
  - **`OfflineDetector`**: Detector de conectividade com internet
  - **`Pagination`**: Componente de paginação reutilizável
  - **`UI`**: Componentes básicos (Button, Input, Modal, Table, etc.)
- **`/app`**: Estrutura de rotas da aplicação
  - **`page.tsx`**: Página inicial (Home)
  - **`produtos/page.tsx`**: Página de listagem de produtos
  - **`cadastro/page.tsx`**: Página de cadastro de produtos
  - **`error.tsx`**: Tratamento global de erros
  - **`not-found.tsx`**: Página 404 personalizada
- **`/lib`**: Funções utilitárias e tipos de dados
  - **`api.ts`**: Funções para comunicação com a API simulada
  - **`db.ts`**: Simulação de banco de dados com localStorage
  - **`types.ts`**: Definições de tipos TypeScript
  - **`utils.ts`**: Funções utilitárias (formatação, validação, etc.)

## 🚀 Como Executar

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/livbrandao/supermarket-products.git
   cd produtos-supermercado
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Execute em modo de desenvolvimento:**

   ```bash
   npm run dev
   ```

4. **Acesse a aplicação:**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📱 Demonstração

A aplicação permite:

- **Listar produtos** com imagem, nome, marca, preço e descrição
- **Filtrar produtos** por nome com busca instantânea
- **Adicionar produtos** com validação de campos obrigatórios
- **Editar informações** de produtos existentes
- **Excluir produtos** com confirmação
- **Gerenciar marcas** automaticamente ao criar/editar produtos

## 🧪 Características Técnicas

- **Persistência de dados** usando localStorage
- **Simulação de API** com atrasos realistas
- **Validação de formulários** em tempo real
- **Tratamento de erros** com mensagens amigáveis e páginas de erro customizadas
- **Compressão de imagens** base64 para melhor performance
- **Paginação** para melhor experiência do usuário
- **Design responsivo** para qualquer tamanho de tela
- **Detecção de conexão** com notificações quando offline/online
- **Fallback para imagens** quando não podem ser carregadas

## 🔄 Fluxo de Dados

```
UI (Componentes React)
   ↕️
API (api.ts)
   ↕️
DB (db.ts usando localStorage)
```

## 📦 Componentes Principais

### Componentes de UI

- **ErrorPage**: Exibe mensagens de erro personalizáveis com opções de tentar novamente ou voltar para a página inicial
- **ImageWithFallback**: Componente de imagem avançado que exibe um fallback quando a imagem falha ao carregar
- **OfflineDetector**: Detecta o status de conectividade com a internet e exibe notificações apropriadas
- **Pagination**: Componente reutilizável de paginação para navegar através de conteúdo em várias páginas

### Páginas

- **Home**: Página inicial com links para gerenciamento de produtos
- **Produtos**: Catálogo de produtos disponíveis
- **Cadastro**: Formulário para adicionar novos produtos ao sistema

### Tratamento de Erros

- **Global Error**: Trata erros inesperados em toda a aplicação
- **Not Found**: Página 404 personalizada para quando as rotas não existem

---

## 👩‍💻 Desenvolvedora

Desenvolvido com 💙 e TypeScript por Lívia Brandão

📧 Entre em contato: [LinkedIn](https://www.linkedin.com/in/liviatbrandao/)
