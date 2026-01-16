# Metodologia

## Gerenciamento de Projeto

Dado que o projeto é gerido e utilizado por um único proprietário/desenvolvedor, optou-se por uma metodologia ágil adaptada, baseada em práticas do **Scrum**. O desenvolvimento foi iterativo, focando primeiro na estrutura de dados (Grupos/Livros), seguido pela lógica de negócios (Codificação) e finalizando com a interface (UI/UX).

### Equipe do Projeto
* **Vitor de Barros** - Desenvolvedor Full Stack (Front-end + Lógica) / Product Owner.
* **Vitor de Barros** - Documentação e Testes.

### Ferramentas Utilizadas

| Função | Ferramenta | Descrição |
| --- | --- | --- |
| **Editor de Código** | VS Code | Desenvolvimento do HTML, CSS e JavaScript. |
| **Controle de Versão** | Git / GitHub | Armazenamento do código fonte e documentação. |
| **Design de Interface** | CSS Customizado | Implementação direta seguindo o guia de estilos (Paleta Azul/Dourado). |
| **Banco de Dados** | LocalStorage / JSON | Armazenamento local no navegador para persistência de dados. |

### Estratégia de Organização

A arquitetura do projeto segue o padrão **SPA (Single Page Application)** sem frameworks pesados (Vanilla JS), garantindo leveza e portabilidade:

1.  **Estrutura (HTML):** Um único arquivo `index.html` contendo a semântica da página, modais e containers.
2.  **Estilo (CSS):** Arquivo `style_alexandria.css` contendo variáveis CSS (`:root`) para temas (Dark/Light mode) e responsividade.
3.  **Comportamento (JS):** Arquivo `alexandria.js` contendo o objeto `AlexandriaAPI` (CRUD) e as funções de manipulação do DOM.