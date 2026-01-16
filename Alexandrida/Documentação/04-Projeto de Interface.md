# Projeto de Interface

## Fluxo do Usuário (User Flow)

Como se trata de uma aplicação de página única, o fluxo é otimizado para a produtividade do bibliófilo:

1.  **Dashboard Inicial:** O usuário visualiza a tabela completa de livros e a barra lateral de gestão de grupos.
2.  **Cadastro:** * O usuário preenche o formulário na lateral esquerda.
    * Seleciona Grupo e Subgrupo.
    * O sistema gera o código do volume automaticamente.
    * Ao salvar, a tabela é atualizada instantaneamente.
3.  **Busca:** O usuário digita no campo de busca superior e a tabela filtra em tempo real por Título, Autor ou Código.
4.  **Edição:** Ao clicar no título de um livro na tabela, abre-se um Modal para edição de dados, status de leitura ou descarte do volume.

## Identidade Visual

A interface foi projetada para evocar a seriedade e elegância de uma biblioteca clássica.

* **Layout:** Grid de 3 colunas (Cadastro, Tabela Principal, Gestão de Grupos).
* **Feedback Visual:** Efeitos de *hover* dourados, *glow* nos inputs selecionados e diferenciação de cores para livros "Lidos" (Verde) e "Não Lidos" (Vermelho).
* **Acessibilidade:** Inclusão de um modo noturno (**Dark Mode**) alternável.

## Wireframes / Estrutura das Telas

1.  **Cabeçalho:** * Logotipo "Alexandria".
    * Menu de navegação (Salvar JSON, Carregar JSON, Tema).
2.  **Coluna Esquerda (Painel de Controle):** * Formulário de cadastro fixo.
    * Campos: Título, Autor, Editora, Edição.
    * Seleção hierárquica de Grupo/Subgrupo e Geração de Código.
3.  **Coluna Central (Acervo):** * Barra de pesquisa global.
    * Tabela de dados (estilo "Cards") com ordenação por clique no cabeçalho.
    * Contador de livros no rodapé.
4.  **Coluna Direita (Estrutura):** * Listagem de Grupos e Subgrupos.
    * Botões rápidos para adicionar ou remover categorias.
5.  **Modais:** * Janelas sobrepostas para criação de novos grupos e edição detalhada de livros (incluindo campo de observações e botão de descarte).