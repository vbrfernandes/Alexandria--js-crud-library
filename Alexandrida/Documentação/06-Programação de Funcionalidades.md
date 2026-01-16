# Programação de Funcionalidades

Abaixo está o mapeamento entre os requisitos funcionais e a implementação técnica no código fonte.

### Estrutura de Arquivos
* `index.html`: Estrutura semântica.
* `css/style_alexandria.css`: Estilização e Temas.
* `js/alexandria.js`: Lógica de negócio e API local.

---

### Cadastro de Livros (RF-03, RF-04)
* **Implementação:** Formulário HTML `.cadastroLivros`.
* **Lógica:** O botão "GERAR CÓDIGO" aciona uma varredura no array de livros, identifica o maior número de volume para o Subgrupo selecionado e soma +1. O cadastro cria um objeto JSON com status `lido: false` e `descartado: false`.

### Gestão de Grupos e Subgrupos (RF-01, RF-02)
* **Implementação:** Botões na sidebar direita acionam Modais.
* **Lógica:** As funções `adicionarGrupo()` e `adicionarSubgrupo()` atualizam as listas em tempo real e salvam no `localStorage`, populando automaticamente os `<select>` do formulário de cadastro.

### Busca e Filtragem (RF-07)
* **Implementação:** Input de pesquisa superior.
* **Lógica:** A função `filtrarLivros()` utiliza o método `.filter()` do JavaScript para varrer Título, Autor ou Código em tempo real (`keyup`), renderizando novamente a tabela.

### Integridade Sequencial (RF-06, RNF-02)
* **Implementação:** Sistema de ID Alfanumérico.
* **Lógica:** O sistema não reordena volumes antigos. Novos livros recebem o próximo número disponível. Livros descartados mantêm seu código para não quebrar a sequência física da prateleira, apenas mudando visualmente (riscado/vermelho).

### Persistência e Backup (RF-10)
* **Implementação:** LocalStorage + Arquivo JSON.
* **Lógica:** * **Auto-save:** Toda ação (adicionar/editar/remover) chama `salvarTudo()` no LocalStorage.
    * **Exportar:** Gera um Blob `.json` com data atual e força download.
    * **Importar:** Lê arquivo via `FileReader` e substitui o banco de dados local.