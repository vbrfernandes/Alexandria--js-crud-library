# Introdução

O projeto **Alexandria** consiste em uma aplicação *front-end* (Single Page Application) desenvolvida para catalogar e gerenciar uma biblioteca pessoal composta por cerca de mil volumes. A coleção é dividida rigidamente em quatro grandes áreas temáticas: Romance, Neurociência, Teologia e Direito, cada uma com seus respectivos subgrupos.

O diferencial central da aplicação é a implementação de um sistema de codificação único e hierárquico (Volume/Grupo/Subgrupo), garantindo a rastreabilidade exata e a correspondência entre o sistema digital e a organização física nas prateleiras.

## Problema

O problema principal é a falta de um sistema de catalogação formal e dinâmico para gerenciar um acervo pessoal de grande porte. Sem uma ferramenta digital, a organização física torna-se suscetível a erros e a localização de volumes específicos é demorada.

Além disso, o desafio crítico é a **natureza dinâmica da coleção**. A inserção de novos livros em subgrupos já existentes costuma desordenar a numeração sequencial em métodos tradicionais. A falta de um mecanismo que reajuste ou mantenha a integridade da numeração sequencial lógica impede o crescimento organizado da biblioteca.

## Objetivos

O objetivo geral é desenvolver um sistema digital para a catalogação, gestão e busca eficiente dos volumes da biblioteca pessoal.

**Objetivos Específicos:**
* **Estrutura e Identificação:** Implementar a estrutura hierárquica (Grupos e Subgrupos) e gerar códigos alfanuméricos únicos (ex: `33 T. N`).
* **Escalabilidade:** Permitir a inserção de novos volumes sem quebrar a lógica sequencial existente.
* **Manutenção de Integridade:** Assegurar que o número de prateleira (ordem física) se mantenha estável ou logicamente coerente ao longo do tempo.
* **Gestão de Status:** Controlar quais obras já foram lidas e quais foram descartadas.

## Justificativa

O desenvolvimento desta aplicação justifica-se pela necessidade prática de estabelecer ordem e controle sobre o acervo. A automação do processo de codificação elimina erros manuais e o sistema de busca (filtros por título, autor e código) otimiza o tempo do proprietário. Além disso, a funcionalidade de backup (Importar/Exportar JSON) garante a segurança dos dados catalogados a longo prazo.

## Público-Alvo

O público-alvo é restrito e específico, focado no **Proprietário da Coleção**.
* **Perfil:** Bibliófilo com acervo de grande porte (~1000 volumes).
* **Necessidades:** Organização estrutural, codificação automática, flexibilidade de crescimento do acervo e acesso rápido via busca.