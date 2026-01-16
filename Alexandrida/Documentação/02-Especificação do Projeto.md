# Especificação do Projeto

A definição exata do problema e os requisitos foram levantados através da análise da documentação "Alexandria - Documentação de Contexto".

## Perfis de Usuários

| Perfil | Descrição | Necessidades |
| --- | --- | --- |
| **Proprietário** | Usuário único e administrador do sistema, detentor da coleção. | 1. Cadastrar e gerenciar Grupos e Subgrupos.<br>2. Obter códigos automáticos para novos livros.<br>3. Manter a integridade sequencial dos volumes.<br>4. Filtrar e localizar livros rapidamente.<br>5. Realizar backup dos dados. |

## Histórias de Usuários

| Eu como... `QUEM` | Quero/Preciso... `O QUE` | Para... `PORQUE` |
| --- | --- | --- |
| Proprietário | Cadastrar grupos (ex: Teologia) e subgrupos | Estruturar o catálogo digital conforme a organização física da estante. |
| Proprietário | Que o sistema gere o código único (Vol/Grp/Sub) | Evitar erros manuais de codificação e duplicidade. |
| Proprietário | Manter o número sequencial dos livros existentes inalterado | Garantir que a integridade física da prateleira seja mantida sem necessidade de reordenação manual massiva. |
| Proprietário | Cadastrar título, autor, editora e edição | Identificar claramente cada item do acervo. |
| Proprietário | Filtrar e buscar por código, título ou autor | Localizar rapidamente qualquer exemplar na coleção. |
| Proprietário | Visualizar e alterar o status de leitura (Lido/Não Lido) | Organizar minhas metas de leitura e evitar reler livros involuntariamente. |
| Proprietário | Editar dados de um livro (ex: mudar título ou subgrupo) | Corrigir erros ou atualizar informações. |

## Requisitos do Projeto

### Requisitos Funcionais

| ID | Descrição | Prioridade |
| --- | --- | --- |
| **RF-01** | O sistema deve permitir o cadastro, edição e exclusão dos quatro Grupos principais da coleção (Romance, Neurociência, Teologia, Direito). | ALTA |
| **RF-02** | O sistema deve permitir o cadastro, edição e exclusão dos Subgrupos vinculados a cada Grupo principal. | ALTA |
| **RF-03** | O sistema deve permitir o cadastro de um novo livro, exigindo o fornecimento do Título/Nome/Autor/Editora. | ALTA |
| **RF-04** | O sistema deve gerar e exibir automaticamente o código de identificação único (Volume/Grupo/Subgrupo) de cada livro no momento do cadastro. | MÉDIA |
| **RF-05** | O sistema deve permitir a edição dos dados cadastrais de um livro existente. | MÉDIA |
| **RF-06** | O sistema deve, após a inserção de um novo livro, manter a numeração sequencial (Volume) de todos os livros existentes inalterada naquele Subgrupo. | ALTA |
| **RF-07** | O sistema deve permitir a busca de livros utilizando filtros como Código, Título, Grupo e Subgrupo. | MÉDIA |
| **RF-08** | O sistema deve exibir uma visualização de inventário que mostre a contagem total de livros no acervo. | BAIXA |
| **RF-09** | O sistema deve permitir a exclusão (descarte) de um livro do acervo. | ALTA |
| **RF-10** | O sistema deve permitir visualizar e alterar o status de leitura ("Lido" ou "Não Lido"). | ALTA |

### Requisitos Não Funcionais

| ID | Descrição | Prioridade |
| --- | --- | --- |
| **RNF-01** | **Usabilidade:** A interface deve ser intuitiva e de fácil uso para um único proprietário. | ALTA |
| **RNF-02** | **Consistência:** A lógica de reajuste numérico deve ser confiável, sem códigos duplicados. | ALTA |
| **RNF-03** | **Escalabilidade:** O sistema deve suportar o crescimento da coleção para além dos 1000 volumes sem degradação de desempenho. | ALTA |