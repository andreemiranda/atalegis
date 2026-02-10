
# 🏛️ Legislativo IA - Gerador de Atas Inteligente

Uma aplicação web moderna projetada para auxiliar câmaras municipais e órgãos públicos na redação de atas oficiais utilizando inteligência artificial (Google Gemini API).

## 🚀 Objetivo do Projeto

Automatizar a transcrição e formatação de sessões legislativas, transformando anotações informais em documentos oficiais com linguagem jurídica e técnica adequada, garantindo agilidade e padronização.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19 (Hooks, Context API)
- **Estilização**: Tailwind CSS (Design Responsivo e Moderno)
- **Roteamento**: React Router v7 (HashRouter para compatibilidade)
- **Inteligência Artificial**: @google/genai (Modelo Gemini 3 Flash)
- **Segurança**: Sistema de autenticação simulado com níveis de acesso (User/Admin) via LocalStorage.

## ✨ Funcionalidades

- **🔐 Autenticação**:
  - Login e Cadastro de usuários.
  - Diferenciação entre usuários comuns e administradores.
  - Acesso rápido para fins de demonstração.

- **📝 Gerador de Atas**:
  - Formulário estruturado (Título, Data, Local, Participantes).
  - Campo de relato livre para inserção de fatos.
  - Processamento por IA para converter relatos em texto formal legislativo.

- **📄 Visualização e Cópia**:
  - Exibição da ata gerada em fonte serifada (estilo documento).
  - Botão de "Copiar Texto" com um clique.
  - Layout otimizado para leitura.

- **🛡️ Painel Administrativo**:
  - Listagem de usuários cadastrados (mockup).
  - Gestão de permissões de acesso.

## 📦 Como Instalar e Executar

Este projeto foi construído para rodar nativamente no navegador utilizando ESM (ES Modules).

1. **Pré-requisitos**: Um servidor web simples ou ambiente de preview que suporte módulos JS.
2. **Configuração**:
   - A aplicação utiliza o `process.env.API_KEY` para chamadas de IA. Certifique-se de que a chave está configurada no ambiente de execução.
3. **Execução**:
   - Abra o `index.html` através de um servidor local.

## 📖 Instruções de Uso

1. Faça login ou utilize o "Acesso Rápido".
2. No painel principal, preencha os dados da sessão legislativa.
3. No campo de relato, insira o que aconteceu na sessão (ex: "Vereador João propôs reforma da praça, Maria votou contra").
4. Clique em **"Gerar Ata Formal"**.
5. Aguarde o processamento da IA e revise o texto gerado no card de resultado.

## 🛡️ Segurança e Privacidade

- **Dados Sensíveis**: A API Key não é exposta diretamente no código fonte, sendo injetada pelo ambiente.
- **LocalStorage**: As informações de sessão são salvas localmente no navegador do usuário.

---
Desenvolvido com foco em eficiência pública e transparência legislativa.
