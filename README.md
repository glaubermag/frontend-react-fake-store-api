# E-commerce Product Store

Uma aplicação moderna de e-commerce construída com React, TypeScript e Vite, demonstrando boas práticas de desenvolvimento frontend e integração com APIs RESTful.

## 🚀 Tecnologias Utilizadas

- **Frontend Framework**: React 18 com TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS + shadcn/ui
- **Gerenciamento de Estado**: React Query (TanStack Query)
- **Roteamento**: React Router v6
- **Animações**: Framer Motion
- **Testes**: Vitest + Testing Library + Playwright (E2E)
- **Qualidade de Código**: ESLint + Prettier
- **CI/CD**: GitHub Actions

## ✨ Funcionalidades

### 🔐 Autenticação
- Sistema completo de login e registro
- Proteção de rotas para funcionalidades administrativas
- Persistência de sessão via localStorage

### 📱 Gerenciamento de Produtos
- **Listagem**: Visualização de produtos com paginação automática
- **Busca**: Sistema de busca por nome e categoria
- **Filtros**: Filtros por categoria em tempo real
- **Detalhes**: Página dedicada para cada produto
- **CRUD Completo**: Criar, editar e remover produtos (apenas para usuários autenticados)

### 🛒 Carrinho de Compras
- Adicionar/remover produtos
- Contador visual de itens
- Persistência entre sessões

### 🎨 Interface e UX
- Design responsivo para mobile, tablet e desktop
- Estados de loading, erro e dados vazios
- Feedback visual com toasts
- Animações suaves com Framer Motion
- Tema moderno com gradientes

## 🏗️ Arquitetura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── Navbar.tsx      # Navegação principal
│   ├── ProductForm.tsx # Formulário de produtos
│   └── ProtectedRoute.tsx # Proteção de rotas
├── contexts/           # Contextos React
│   ├── AuthContext.tsx # Gerenciamento de autenticação
│   └── CartContext.tsx # Gerenciamento do carrinho
├── pages/             # Páginas principais
│   ├── Dashboard.tsx  # Lista de produtos
│   ├── ProductDetail.tsx # Detalhes do produto
│   ├── Login.tsx      # Página de login
│   ├── Register.tsx   # Página de registro
│   └── Cart.tsx       # Carrinho de compras
├── hooks/             # Hooks personalizados
└── lib/               # Utilitários e configurações
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Execute o projeto:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Linting
npm run lint

# Formatação de código
npm run format
```

## 🧪 Testes

### Testes Unitários (Vitest + Testing Library)
```bash
npm run test
```
- Testa componentes isoladamente
- Verifica comportamentos de UI
- Mocks de APIs e contextos

### Testes E2E (Playwright)
```bash
npm run test:e2e
```
- Testa fluxos completos da aplicação
- Navegação entre páginas
- Integração com APIs reais

## 🔧 Configuração de Desenvolvimento

### ESLint + Prettier
O projeto está configurado com:
- ESLint para análise estática de código
- Prettier para formatação automática
- Hooks de pre-commit com lint-staged

### CI/CD
Pipeline automatizado no GitHub Actions:
- ✅ Lint e verificação de tipos
- ✅ Testes unitários e E2E
- ✅ Build de produção
- ✅ Deploy automático

## 🌐 Deploy

A aplicação está configurada para deploy automático em:
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**

## 🎯 Decisões de Arquitetura

### Por que Vite?
Escolhemos Vite sobre Next.js pelos seguintes motivos:
- **Performance**: Build e HMR mais rápidos
- **Simplicidade**: Configuração minimal para SPAs
- **Flexibilidade**: Maior controle sobre bundling
- **Tamanho**: Bundle menor para aplicações client-side
- **DX**: Melhor experiência de desenvolvimento

### Gerenciamento de Estado
- **React Query**: Para dados servidor (cache, sync, mutations)
- **Context API**: Para estado global simples (auth, cart)
- **useState**: Para estado local de componentes

### Estrutura de Componentes
- Separação clara entre UI e lógica de negócio
- Componentes pequenos e focados
- Reutilização através do design system shadcn/ui

## 🔗 API Utilizada

**Platzi Fake Store API**: `https://api.escuelajs.co/api/v1/`
- Endpoints de produtos, categorias e autenticação
- Dados realistas para demonstração
- Suporte completo a operações CRUD

## 📱 Responsividade

A aplicação é totalmente responsiva com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎨 Design System

Baseado no shadcn/ui com:
- Palette de cores consistente
- Tipografia escalável
- Componentes acessíveis
- Modo claro otimizado

## 📈 Performance

Otimizações implementadas:
- **Code Splitting**: Lazy loading de rotas
- **Image Optimization**: Loading lazy de imagens
- **Caching**: React Query para cache inteligente
- **Bundle Analysis**: Análise de tamanho do bundle

## 🔒 Segurança

- Validação de dados no frontend
- Sanitização de inputs
- Proteção contra XSS
- Headers de segurança configurados

## 🤝 Contribuição

1. Crie uma branch para sua feature
2. Commit suas mudanças
3. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu Perfil](https://linkedin.com/in/seu-perfil)
- Email: seu.email@exemplo.com

---

💡 **Sobre este projeto**: Desenvolvido como demonstração de habilidades em React, TypeScript e desenvolvimento frontend moderno, seguindo as melhores práticas da indústria.
