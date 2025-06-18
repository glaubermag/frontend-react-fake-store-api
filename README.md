# E-commerce com Fake Store API

Este é um projeto de e-commerce desenvolvido com React, TypeScript e Vite, consumindo a Fake Store API. O projeto demonstra boas práticas de desenvolvimento front-end, incluindo testes automatizados, responsividade e uma arquitetura escalável.

## 🚀 Tecnologias

- [React](https://reactjs.org) - Biblioteca para interfaces de usuário
- [TypeScript](https://www.typescriptlang.org) - Tipagem estática para JavaScript
- [Vite](https://vitejs.dev) - Build tool e dev server
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS utilitário
- [Shadcn/ui](https://ui.shadcn.com) - Componentes UI reutilizáveis
- [React Router](https://reactrouter.com) - Roteamento da aplicação
- [React Query](https://tanstack.com/query/latest) - Gerenciamento de estado e cache
- [Jest](https://jestjs.io) - Framework de testes unitários
- [Playwright](https://playwright.dev) - Framework de testes E2E
- [Husky](https://typicode.github.io/husky) - Git hooks para qualidade de código

## ⚡ Por que Vite?

O Vite foi escolhido como bundler por oferecer:
- **Desenvolvimento extremamente rápido** com HMR (Hot Module Replacement)
- **Build otimizado** para produção com tree-shaking automático
- **Suporte nativo** a TypeScript e JSX
- **Configuração simples** e intuitiva
- **Excelente performance** em desenvolvimento e produção
- **Code splitting automático** e lazy loading
- **Suporte a CSS modules** e PostCSS out-of-the-box

## 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/frontend-react-fake-store-api.git

# Entre no diretório
cd frontend-react-fake-store-api

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o ESLint
- `npm run format` - Formata o código com Prettier
- `npm test` - Executa testes unitários com Jest
- `npm run test:e2e` - Executa testes E2E com Playwright
- `npm run test:e2e:ui` - Executa testes E2E com interface visual
- `npm run test:e2e:headed` - Executa testes E2E em modo headed

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://api.escuelajs.co/api/v1
```

## 🏗️ Arquitetura

```
src/
  ├── components/     # Componentes reutilizáveis
  │   ├── ui/        # Componentes base (shadcn/ui)
  │   ├── Navbar.tsx # Navegação principal
  │   ├── ProductForm.tsx # Formulário de produtos
  │   └── ProtectedRoute.tsx # Rota protegida
  ├── contexts/      # Contextos do React
  │   ├── AuthContext.tsx # Autenticação
  │   └── CartContext.tsx # Carrinho de compras
  ├── hooks/         # Custom hooks
  │   ├── use-mobile.tsx # Hook para detectar mobile
  │   └── use-toast.ts # Hook para notificações
  ├── lib/           # Utilitários e configurações
  │   └── utils.ts   # Funções utilitárias
  ├── pages/         # Páginas da aplicação
  │   ├── Index.tsx  # Página inicial
  │   ├── Login.tsx  # Página de login
  │   ├── Register.tsx # Página de registro
  │   ├── Dashboard.tsx # Lista de produtos
  │   ├── ProductDetail.tsx # Detalhes do produto
  │   ├── Cart.tsx   # Carrinho de compras
  │   └── NotFound.tsx # Página 404
  └── types/         # Definições de tipos TypeScript
```

## 🧪 Testes

### Testes Unitários (Jest + Testing Library)

```bash
# Executa os testes unitários
npm test

# Executa em modo watch
npm run test:watch

# Executa com cobertura
npm run test:coverage
```

**Resultados dos Testes Unitários:**
- ✅ **3 testes passaram**
- ✅ **1 suite de teste**
- ✅ **Tempo de execução: ~2.5s**
- ✅ **Cobertura: Componente Button testado**

### Testes E2E (Playwright)

```bash
# Executa os testes E2E
npm run test:e2e

# Executa com interface visual
npm run test:e2e:ui

# Executa em modo headed (com navegador visível)
npm run test:e2e:headed
```

**Resultados dos Testes E2E:**
- ✅ **9 testes passaram**
- ✅ **3 suites de teste**
- ✅ **Tempo de execução: ~17s**
- ✅ **Cobertura: Navegação, produtos, fluxo completo**

**Testes E2E Implementados:**
1. **Navegação**
   - Navegação para página de produtos
   - Navegação para carrinho
   - Navegação para página de login

2. **Produtos**
   - Exibição da lista de produtos
   - Busca de produtos
   - Adição de produtos ao carrinho

3. **Fluxo Completo**
   - Navegação completa da aplicação
   - Teste de busca e carrinho

## 📱 Funcionalidades

- [x] **Autenticação** - Login e registro de usuários
- [x] **Dashboard** - Listagem de produtos com busca e filtros
- [x] **CRUD de Produtos** - Criar, editar, remover produtos
- [x] **Página de Detalhes** - Visualização detalhada de produtos
- [x] **Carrinho de Compras** - Adicionar, remover e gerenciar itens
- [x] **Responsividade** - Interface adaptável para mobile e desktop
- [x] **Feedback Visual** - Loading states, estados vazios, tratamento de erros
- [x] **Menu Mobile** - Navegação otimizada para dispositivos móveis

## 🔄 CI/CD

O projeto utiliza GitHub Actions para:
- **Lint e formatação** de código
- **Build e testes unitários**
- **Testes E2E** com Playwright
- **Deploy automático** (configurável)

## 📊 Qualidade do Código

- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **Husky** - Git hooks para qualidade
- **TypeScript** - Tipagem estática
- **Testes automatizados** - Unitários e E2E

## 🚀 Build de Produção

```bash
npm run build
```

**Resultados do Build:**
- ✅ **Build bem-sucedido**
- ✅ **Tempo de build: ~7.7s**
- ✅ **Bundle otimizado** com code splitting
- ✅ **Assets comprimidos** (gzip)

**Estatísticas do Bundle:**
- **CSS**: 68.07 kB (11.74 kB gzipped)
- **JavaScript**: 364.74 kB (116.02 kB gzipped)
- **Total**: ~432 kB (127.76 kB gzipped)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se você tiver alguma dúvida ou problema, por favor abra uma issue no GitHub.

## 🏎️ Otimizações de Performance

- Lazy loading de páginas com React.lazy
- Memoização de componentes e dados derivados
- Virtualização de listas com react-window
- Hooks personalizados para debounce, throttle, memoização e lazy loading

## 🧩 Exemplos de uso dos hooks de performance

### useDebounce
```tsx
import { useDebounce } from './src/hooks/usePerformance';

const debouncedSearch = useDebounce((value: string) => {
  // chamada de API ou lógica pesada
}, 500);

<input onChange={e => debouncedSearch(e.target.value)} />
```

### useThrottle
```tsx
import { useThrottle } from './src/hooks/usePerformance';

const throttledScroll = useThrottle(() => {
  // lógica de scroll
}, 200);

window.addEventListener('scroll', throttledScroll);
```

### useMemoizedObject
```tsx
import { useMemoizedObject } from './src/hooks/usePerformance';

const memoUser = useMemoizedObject(user, [user.id, user.name]);
```

### useLazyImage
```tsx
import { useLazyImage } from './src/hooks/usePerformance';

const { imageSrc, isLoading, error } = useLazyImage(urlImagem);
<img src={imageSrc} alt="Imagem" />
```

### useIntersectionObserver
```tsx
import { useIntersectionObserver } from './src/hooks/usePerformance';

const { observe, unobserve } = useIntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // lógica ao entrar na tela
    }
  });
});

// use observe(ref.current) para observar um elemento
```
