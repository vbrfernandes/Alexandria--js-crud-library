# Plano de Testes de Software

Os testes funcionais a serem realizados na aplicação web são descritos a seguir.

**Pré-requisitos:** Navegador Web Atualizado (Chrome, Edge, Firefox).

| Caso de Teste | CT-01: Cadastro de Grupos e Subgrupos |
| --- | --- |
| **Requisito** | RF-01, RF-02 |
| **Objetivo** | Verificar se é possível criar a hierarquia da biblioteca. |
| **Passos** | 1. Clicar em "+ Cadastrar Grupo" na lateral direita.<br>2. Inserir "Direito". Salvar.<br>3. Clicar em "+ Cadastrar Subgrupo".<br>4. Selecionar "Direito" e inserir "Penal". Salvar. |
| **Resultado Esperado** | O Grupo e Subgrupo devem aparecer na lista lateral e também nos campos de seleção (Select) do formulário de cadastro de livros. |

| Caso de Teste | CT-02: Cadastro de Livro com Geração de Código |
| --- | --- |
| **Requisito** | RF-03, RF-04, RF-06 |
| **Objetivo** | Verificar se o sistema gera o código correto e salva o livro. |
| **Passos** | 1. Preencher Título: "Código Penal", Autor: "Planalto".<br>2. Selecionar Grupo: "Direito", Subgrupo: "Penal".<br>3. Clicar em "GERAR CÓDIGO".<br>4. Clicar em "CADASTRAR LIVRO". |
| **Resultado Esperado** | O campo Volume deve mostrar "1". O livro deve aparecer na tabela com o código "DIR-PEN-1". |

| Caso de Teste | CT-03: Busca e Filtragem |
| --- | --- |
| **Requisito** | RF-07 |
| **Objetivo** | Localizar um livro específico. |
| **Passos** | 1. Cadastrar pelo menos 3 livros diferentes.<br>2. No campo de busca, digitar o nome de um autor ou parte do título. |
| **Resultado Esperado** | A tabela deve ocultar os livros que não correspondem e exibir apenas o resultado da busca. |

| Caso de Teste | CT-04: Edição e Descarte |
| --- | --- |
| **Requisito** | RF-05, RF-09 |
| **Objetivo** | Alterar dados e descartar um volume. |
| **Passos** | 1. Clicar no título de um livro na tabela.<br>2. Alterar o status para "Lido: Sim". Salvar.<br>3. Reabrir o mesmo livro e clicar em "Descartar". Confirmar. |
| **Resultado Esperado** | Na primeira etapa, o status na tabela muda para verde ("Lido"). Na segunda etapa, o nome do livro deve ficar vermelho e riscado na tabela, indicando descarte. |

| Caso de Teste | CT-05: Backup (Exportar/Importar) |
| --- | --- |
| **Requisito** | RF-10 |
| **Objetivo** | Garantir a segurança dos dados. |
| **Passos** | 1. Clicar em "Salvar .JSON" no menu superior (download deve iniciar).<br>2. Clicar em "Carregar .JSON" e selecionar o arquivo baixado. |
| **Resultado Esperado** | O sistema deve confirmar a restauração e exibir os dados exatamente como estavam no momento do backup. |