# E-commerce com Fake Store API

Este é um projeto de e-commerce desenvolvido com React, TypeScript e Vite, consumindo a Fake Store API. O projeto demonstra boas práticas de desenvolvimento front-end, incluindo testes automatizados, responsividade, PWA (Progressive Web App) e uma arquitetura escalável.

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
- [PWA](https://web.dev/progressive-web-apps/) - Progressive Web App

## 📱 PWA (Progressive Web App)

O projeto foi transformado em uma PWA completa com as seguintes funcionalidades:

### ✨ Funcionalidades PWA

- **📱 Instalável** - Pode ser instalado como app nativo
- **🔧 Service Worker** - Cache inteligente e funcionamento offline
- **🎨 Splash Screen** - Tela de carregamento personalizada
- **📲 Manifest** - Configuração completa para instalação
- **🔄 Atualizações Automáticas** - Notificações de novas versões
- **📶 Indicador Offline** - Feedback visual quando offline
- **⚡ Performance Otimizada** - Cache estratégico de recursos
- **🎯 Shortcuts** - Atalhos rápidos para funcionalidades principais

### 🛠️ Configuração PWA

```bash
# Gerar ícones PWA
npm run generate-icons

# Build com PWA
npm run build
```

### 📋 Checklist PWA

- [x] **Web App Manifest** - Configuração completa
- [x] **Service Worker** - Cache e funcionalidade offline
- [x] **Ícones PWA** - Múltiplos tamanhos (72x72 até 512x512)
- [x] **Meta Tags** - Configuração para iOS e Android
- [x] **Splash Screen** - Tela de carregamento personalizada
- [x] **Instalação** - Prompt de instalação automático
- [x] **Atualizações** - Notificações de novas versões
- [x] **Offline** - Funcionamento sem conexão
- [x] **Performance** - Cache estratégico de recursos

### 🎨 Ícones Gerados

- `icon-72x72.png` - Para dispositivos pequenos
- `icon-96x96.png` - Para Android
- `icon-128x128.png` - Para Windows
- `icon-144x144.png` - Para iOS
- `icon-152x152.png` - Para iPad
- `icon-192x192.png` - Para Android (alta resolução)
- `icon-384x384.png` - Para Android (2x)
- `icon-512x512.png` - Para Android (3x)
- `apple-touch-icon.png` - Para iOS
- `mask-icon.svg` - Para Safari

### 🔧 Service Worker

O service worker implementa estratégias de cache inteligentes:

- **API**: Network First com fallback para cache
- **Assets**: Cache First para melhor performance
- **Páginas**: Network First com fallback offline
- **Atualizações**: Detecção automática de novas versões

### 📱 Experiência Mobile

- **Instalação Nativa** - Prompt automático de instalação
- **Modo Standalone** - Remove a barra de navegação do navegador
- **Splash Screen** - Tela de carregamento personalizada
- **Shortcuts** - Atalhos para produtos e carrinho
- **Responsividade** - Interface otimizada para touch

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
- [x] **PWA (Progressive Web App)** - App instalável com funcionalidades nativas
  - [x] **Instalação Nativa** - Pode ser instalado como app
  - [x] **Funcionamento Offline** - Cache inteligente de recursos
  - [x] **Splash Screen** - Tela de carregamento personalizada
  - [x] **Atualizações Automáticas** - Notificações de novas versões
  - [x] **Indicador Offline** - Feedback visual quando sem conexão
  - [x] **Shortcuts** - Atalhos rápidos para funcionalidades principais

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

## ♿ Acessibilidade

O projeto implementa as seguintes melhorias de acessibilidade:

### Testes de Acessibilidade
- **Jest-Axe**: Testes automatizados para verificar violações de acessibilidade
- **Cobertura Completa**: Testes para todos os componentes principais
- **Validação Contínua**: Verificação automática em cada build

### Melhorias Implementadas
- **Labels Acessíveis**: Todos os campos de formulário têm labels apropriados
- **Navegação por Teclado**: Suporte completo à navegação via Tab
- **ARIA Labels**: Atributos ARIA para elementos interativos
- **Contraste**: Cores com contraste adequado
- **Estrutura Semântica**: HTML semântico correto
- **Ícones**: Ícones com aria-hidden ou aria-label apropriados

### Componentes Testados
- ✅ **ProductCard**: Links acessíveis, imagens com alt text
- ✅ **Navbar**: Links com aria-label, navegação por teclado
- ✅ **ProductForm**: Labels acessíveis, campos obrigatórios marcados
- ✅ **PWAInstallPrompt**: Estrutura semântica, botões acessíveis

### Padrões Seguidos
- **WCAG 2.1**: Conformidade com as diretrizes de acessibilidade
- **Section 508**: Padrões de acessibilidade para tecnologia da informação
- **React A11y**: Boas práticas específicas para React

## �� Testes

### Testes de Acessibilidade
```bash
npm test -- --testPathPattern="ProductCard|Navbar|ProductForm|PWAInstallPrompt"
```

### Testes E2E
```bash
npm run test:e2e
```

## 🚀 Como Executar

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd frontend-react-fake-store-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em modo de desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:5173
```

## 📦 Build para Produção

```bash
npm run build
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm test` - Executa testes unitários
- `npm run test:e2e` - Executa testes E2E
- `npm run test:coverage` - Executa testes com cobertura
- `npm run lint` - Executa o linter
- `npm run lint:fix` - Corrige problemas do linter

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI reutilizáveis
│   └── __tests__/      # Testes dos componentes
├── contexts/           # Contextos React
├── hooks/              # Hooks customizados
├── pages/              # Páginas da aplicação
├── lib/                # Utilitários e configurações
└── main.tsx           # Ponto de entrada
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Fake Store API](https://fakestoreapi.com/) - API para dados de produtos
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes de UI
- [Lucide Icons](https://lucide.dev/) - Ícones
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
