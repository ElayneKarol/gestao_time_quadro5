# Quatro5 · Gestão de Times 🚀

Uma plataforma web ágil, limpa e responsiva desenvolvida especialmente para ajudar o **Ricardo** a gerenciar as demandas dos seus 10 colaboradores, mitigar gargalos de entrega e evitar o estouro de prazos críticos.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as tecnologias mais modernas do ecossistema Frontend para garantir performance e tipagem estrita:

*   **React** (Componentização eficiente e gerenciamento de estado)
*   **TypeScript** (Garantia de código seguro, livre de `any` e altamente tipado)
*   **Vite** (Build ultrarrápido para ambiente de desenvolvimento)
*   **Tailwind CSS v4** (Estilização utilitária de última geração com alta performance)

---

## 💡 Funcionalidades Implementadas (Dia 1)

O foco inicial foi construir a fundação da ferramenta e estruturar o fluxo de trabalho visual do time:

1.  **Quadro Kanban Funcional:** Divisão clara das atividades em 3 colunas (*A Fazer*, *Em Andamento* e *Concluído*), permitindo transições rápidas de status.
2.  **Formulário de Cadastro de Atividades:** Permite o registro imediato de novas tarefas vinculando obrigatoriamente um **Título**, um **Responsável** (selecionado a partir do time de 10 pessoas) e um **Prazo de Entrega**.
3.  **Alerta de Prazos Estourados:** Cartões que estão com a data de entrega menor que a data atual exibem um indicador visual vermelho piscante (`Atrasado!`), permitindo que o gestor aja rápido.
4.  **Dados de Exemplo Pré-carregados:** O sistema já inicia povoado com o time de 10 pessoas fictícias e tarefas em diferentes status para avaliação imediata.

---

## 📦 Como Rodar o Projeto Localmente

Para testar a ferramenta na sua máquina, certifique-se de ter o [Node.js](https://nodejs.org/) instalado e siga os passos abaixo no terminal:

1.  **Clonar o repositório:**
```bash
    git clone [https://github.com/ElayneKarol/gestao_time_quadro5.git](https://github.com/ElayneKarol/gestao_time_quadro5.git)
    ```
2.  **Entrar na pasta do projeto:**
```bash
    cd gestao-time-quatro5
    ```
3.  **Instalar as dependências:**
```bash
    npm install
    ```
4.  **Iniciar o servidor de desenvolvimento:**
```bash
    npm run dev
    ```
5.  Abra o navegador no endereço indicado no terminal (geralmente `http://localhost:5173`).

---
🔧 *Desenvolvido como solução prática para o case de Gestão de Times.*