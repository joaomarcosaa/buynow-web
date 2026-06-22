# BuyNow E-commerce API

Este é o projeto BuyNow, composto por uma API REST em Java (Spring Boot) e um frontend em React.

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

1. **Java JDK 21+**
2. **Node.js (versão LTS recomendada)**
3. **PostgreSQL** (para o banco de dados)

## 1. Configuração do Banco de Dados

1. Instale e inicie o PostgreSQL.
2. Crie um banco de dados chamado `buynow`:
   ```sql
   CREATE DATABASE buynow;
   ```
3. O projeto está configurado para utilizar o usuário `postgres` e senha `postgres` por padrão. Se necessário, altere as credenciais no arquivo `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/buynow
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   ```

## 2. Rodando o Backend (Spring Boot)

Na pasta raiz do projeto, execute o comando abaixo para compilar e iniciar a API:

```bash
# Windows
.\mvnw spring-boot:run

# Linux/macOS
./mvnw spring-boot:run
```
A API estará disponível em `http://localhost:8080`.

## 3. Rodando o Frontend (React)

Em um novo terminal na pasta raiz do projeto, instale as dependências e inicie a aplicação:

```bash
# Instalar dependências
npm install

# Iniciar o frontend
npm start
```
O navegador abrirá automaticamente em `http://localhost:3000`.

---
*Nota: Atualmente, o Spring Security está desabilitado no arquivo `application.properties` para fins de desenvolvimento.*

