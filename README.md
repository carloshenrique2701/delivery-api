---

# Desafio De Desenvolvimento de API

## Delivery API

---

## Sumary

* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Armazenamento](#armazenamento)
* [Bibliotecas do NodeJs](#bibliotecas-do-nodejs)
* [Bibliotecas utilizadas no frontend](#bibliotecas-utilizadas-no-frontend)
* [APIs externas](#apis-externas)
* [Descrição](#descrição)
* [Detalhes Técnicos](#detalhes-técnicos)
* [Backend](#backend)
* [Frontend](#frontend)
* [Docker](#docker)
* [Como Executar](#como-executar)
* [Considerações Finais](#considerações-finais)

---

## Tecnologias Utilizadas

NodeJs
HTML/CSS/JS puro
Docker
Docker compose

--

## Armazenamento

pedidos.json (para o teste o mais aplicável era a utilização desse arquivo, porém, para um desenvolvimento mais sério, utilizaria MongoDB)

--

## Bibliotecas do NodeJs

Cors
Express
Uuid

--

## Bibliotecas utilizadas no frontend

ChartJs


## APIs externas

Nominatim

--

## Descrição

CRUD simples que tinha como abjetivo: criar, editar, atualizar status e excluir pedidos de um delivery. O backend foi estruturado e separado por responsabilidades: controllers, routes, data, services e utils. No frontend foi utilizado o básico (HTML/CSS/JS puro), também separado por responsabilidades e componentes.

--

## Detalhes Técnicos

---

## Tópicos Atalhos

* [Backend](#backend)
* [Get Route](#get-route)
* [Get Route ID (/:id)](#get-route-id-id)
* [POST Route](#post-route)
* [DELETE Route (/:id)](#delete-route-id)
* [PATCH Route (/:id/status)](#patch-route-idstatus)
* [PUT Route (/:id)](#put-route-id)
* [Frontend](#frontend)
* [Docker](#docker)

---

# Backend

## Tree

```bash
.
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
├── server.js
└── src
    ├── app.js
    ├── controllers
    │   └── orderController.js
    ├── data
    │   └── pedidos.json
    ├── routes
    │   └── orderRoutes.js
    ├── services
    │   └── fileService.js
    └── utils
        ├── filterOrders.js
        ├── newOrderConstruction.js
        ├── newOrderSchemaValidation.js
        ├── orderUpdater.js
        ├── orderUpdaterSchemaValidation.js
        └── stateMachine.js

7 directories, 15 files
```

* Separação por responsabilidade;
* Tratamentos de erros;
* Regras de negócio bem definidas;
* Requisições inválidas redirecionadas;
* Validações de permissões;

---

# Get Route

## Descrição

Rota para listar todos os pedidos com filtros dinâmicos:

```json
{ 
    status, (Status do pedido)
    minValue, (Valor minimo dos pedidos)
    maxValue, (Valor máximo dos pedidos)
    itens, (Quantidade de itens)
    startDate, (Todos os pedidos a partir dessa data)
    endDate (Todos os pedidos até essa data)
}
```

## Fluxo

server.js -> app.js -> orderRoutes.js -> orderController.js -> fileService.js -> orderController.js -> filterOrders.js -> orderController.js

* O server.js recebe a requisição na porta 3000;

* Redireciona apra o app.js que redireciona para o gerenciador de rotas correto, '/orders' e desse para a função especifica do controller;

* O orderController.js recebe os dados pela url. Ex: /orders?status="CANCELED";

* O controller aciona o fileService.js para ler o arquivo pedidos.json e retornar os pedidos registrados;

* O controller aciona filterOrders.js para aplicar somente os filtros que foram passados na url;

* O fitro retorna os pedidos e retorna a requisição;

---

# Get Route ID (/:id)

## Descrição

Rota retornar um pedido especificado pelo seu id como parametro na url:

## Fluxo

server.js -> app.js -> orderRoutes.js -> orderController.js -> fileService.js -> orderController.js

* O server.js recebe a requisição na porta 3000;

* Redireciona apra o app.js que redireciona para o gerenciador de rotas correto, '/orders' e desse para a função especifica do controller;

* O orderController.js verifica se foi passado o id como parametro, retorna caso não tenha sido passado;

* O controller aciona o fileService.js para ler o arquivo pedidos.json e retornar os pedidos registrados e procurar pelo pedido usando o id, retorna caso não tenha encontrado;

* Retorna o pedido específico;

---

# POST Route

## Descrição

Rota retornar um pedido especificado pelo seu id como parametro na url:

## Fluxo

server.js -> app.js -> orderRoutes.js -> orderController.js -> newOrderSchemaValidation.js -> newOrderConstruction.js -> fileOrders.js -> orderController.js

* O server.js recebe a requisição na porta 3000;

* Redireciona apra o app.js que redireciona para o gerenciador de rotas correto, '/orders' e desse para a função especifica do controller;

* O orderController.js direciona para newOrderSchemaValidation.js e verifica se foi passado o pedido com a estrutura correta para o registro. Exemplo de estrutura:

```json
{
  "order": {
    "payments": [
      {
        "prepaid": true,
        "value": 75.5,
        "origin": "CREDIT_CARD"
      }
    ],
    "store": {
      "name": "Coco Bambu Teste",
      "id": "f052054c-e0a0-4768-ab55-7cb7ead57371"
    },
    "items": [
      {
        "code": 1234,
        "name": "Pizza Margherita",
        "price": 65.0,
        "quantity": 1,
        "discount": 0,
        "condiments": []
      },
      {
        "code": 5678,
        "name": "Coca Cola 2L",
        "price": 12.5,
        "quantity": 2,
        "discount": 2.0,
        "condiments": []
      }
    ],
    "customer": {
      "name": "João Silva",
      "temporary_phone": "+5511999999999"
    },
    "delivery_address": {
      "reference": "Próximo ao mercado",
      "street_name": "Rua das Flores",
      "postal_code": "01234-567",
      "country": "BR",
      "city": "São Paulo",
      "neighborhood": "Centro",
      "street_number": "123",
      "state": "SP",
      "coordinates": {
        "latitude": -23.5505,
        "longitude": -46.6333,
        "id": 123456
      }
    }
  }
}
```

* Caso retorne false, o fluxo éinterrompido e retorna erro. Retornando true, a estrutura está correta, ele constroi a estrutura final do pedido no newOrderConstruction.js.;

* Retonando a estrutura final, o fileService é acionado para o salvamento, e retorna a mensagem final requisição;

---

# DELETE Route (/:id)

## Descrição

Rota remover um pedido especificado pelo seu id do arquivo:

## Fluxo

server.js -> app.js -> orderRoutes.js -> orderController.js -> fileService.js -> orderController.js -> stateMachine.js -> orderController.js -> fileService.js

* O server.js recebe a requisição na porta 3000;

* Redireciona apra o app.js que redireciona para o gerenciador de rotas correto, '/orders' e desse para a função especifica do controller;

* O controller ler o arquivo pelo fileService, e faz uma requisição para a stateMachine.js para verificar se o pedido pode ser removido;

* Regra de negócio:
  *O pedido pode ser excluido se status = 'RECEIVED' || 'CONFIRMED';
  *O pedido não pode ser excluido se status = 'DISPATCHED' || 'DELIVERED' || 'CANCELED';
  *Motivo: empresas geralmente guardam registros por motivos judiciais, etc...

* O controller separa esse pedido específico dos outros e manda o fileService salvar o arquivo novo;

---

# PATCH Route (/:id/status)

## Descrição

Rota atualizar somente o status do pedido:

## Fluxo

server.js -> app.js -> orderRoutes.js -> orderController.js -> fileService.js -> orderController.js -> stateMachine.js -> orderController.js -> fileService.js

* O server.js recebe a requisição na porta 3000;

* Redireciona apra o app.js que redireciona para o gerenciador de rotas correto, '/orders' e desse para a função especifica do controller;

* O controller verifica se o id, e o status (recebido no body da requisição), foram recebidos, retorna se não;

* Se sim, verifica na stateMachine se o status pode ser atualizado para o novo;

* Regra de negócio:
  *RECEIVED: pode atualizar para 'CONFIRMED' || 'CANCELED';
  *CONFIRMED: pode atualizar para 'DISPATCHED' || 'CANCELED';
  *DISPATCHED: pode atualizar para 'DELIVERED' || 'CANCELED';
  *DELIVERED: não pode atualizar para nenhum estado;
  *CANCELED: não pode atualizar para nenhum estado;

* Se onovo status for inválido retorna erro,se for valido salva no fileService.js;

---

# PUT Route (/:id)

## Descrição

Rota atualizar ALGUNS campos do pedido:

## Fluxo

server.js -> app.js -> orderRoutes.js -> orderController.js -> fileService.js -> orderController.js -> stateMachine.js -> orderController.js -> orderUpdaterSchemaValidation.js -> orderController.js -> orderUpdater.js ->  fileService.js

* O server.js recebe a requisição na porta 3000;

* Redireciona apra o app.js que redireciona para o gerenciador de rotas correto, '/orders' e desse para a função especifica do controller;

* O controller recebe, somente, os campos que podem ser atualizados: customer, delivery_address, payments. E verifica se o id foi passado como parametro, retorna se não;

* O controller valida na stateMachine os campos que esse pedido específico pode atualizar;

* Regra de negócio:

  * RECEIVED pode autalizar: 'payments', 'delivery_address', 'customer';
  * CONFIRMED pode autalizar: 'payments', 'customer';
  * DISPATCHED pode autalizar: NDA;
  * DELIVERED pode autalizar: NDA;
  * CANCELED pode autalizar: NDA;
  * Motivo: Pedidos enviados, cancelado e entregues não tem motivo para atualizar pois podem causar algum prejuizo judicial, financeiro, durante a entrega, etc...

* Caso os campos enviados não recebam autorização para serem atualizados, retorna erro. Caso recebam a permissão, o controller aciona orderUpdaterSchemaValidation.js para fazer a validação da estrutura de cada campo. Ex:

```json
{
  "customer": {
    "name": "Roberto Almeida Santos",
    "temporary_phone": "+5561999999999"
  },
  "delivery_address": {
    "reference": "Edifício Office Tower - Sala 505",
    "street_name": "SCN Quadra 2",
    "postal_code": "70.712-900",
    "country": "BR",
    "city": "Brasília",
    "neighborhood": "Asa Norte",
    "street_number": "Sala 505",
    "state": "Distrito Federal",
    "coordinates": {
      "latitude": -15.79,
      "longitude": -47.885,
      "id": 1323180
    }
  },
  "payments": [
    {
      "prepaid": false,
      "value": 200.0,
      "origin": "CASH"
    }
  ]
}
```

* Retorno inválido: retorna erro. Retorno válido,o controller pega o pedido aser atualizado juntamente com os novos dados e envia para o orderUpdate.js para montar o novo pedido;

* Após a montagem, o pedido atualizado e juntado com os outros e enviado para o fileService para o salvamento;

---

# Frontend

## Descrição

Interface simples com gráficos de análise de pedidos usando HTML/CSS/JS puro + a biblioteca ChartJS. O foco principal era ter umainterface emque fosse utilizada todas as rotas da API.

---

## Estrutura

```bash
.
├── css
│   ├── components
│   │   ├── buttons.css
│   │   ├── graphs.css
│   │   ├── inputs.css
│   │   ├── modals.css
│   │   ├── selects.css
│   │   └── tables.css
│   ├── pages
│   │   ├── edit-order.css
│   │   └── new-order.css
│   └── style.css
├── Dockerfile
├── .dockerignore
├── index.html
├── js
│   ├── api
│   │   ├── client.js
│   │   └── orders.js
│   ├── components (componentes gráficos das páginas)
│   │   ├── newOrderElements.js
│   │   ├── orderGraphs.js
│   │   ├── orderModalDetails.js (Modal para visualização dos detalhes do pedidos)
│   │   └── orderTable.js
│   ├── pages (Usados em cada página)
│   │   ├── address.js
│   │   ├── edit-order.js
│   │   ├── main.js
│   │   └── new-order.js
│   └── utils 
│       └── addressAPI.js
└── pages
    ├── edit-order.html
    └── new-order.html

10 directories, 24 files
```

* 3 páginas HTML:
  *1 para listar,visualizar detalhes, filtrar, atualizar status, excluir e análise com gráficos dos pedidos;
  *1 para atualizar os dados de um pedido dependendo dos status do pedido;
  *1 para registrar um novo pedido;

* api/client.js -> monta a url e faz a requisição para a API;

* api/orders.js -> monta o resto da url para todas as rotas relacionadas aos pedidos;

* utils/addressAPI.js -> API externa (Nominatim) para requisitar as coordenadas e detalhes de cada endereço procurando pelo CEP (exeto o id);

---

# Docker

## Descrição

Foi utilizado docker compose para criar uma arquitetura multi-container(frontend e backend) para isolar as camadas de serviço nas portas 3000 (API) e 8080(host);

---

## Arquitetura de Containers

### 1. Backend (Node.js)

* Imagem Base: Utiliza node:18-alpine para garantir um ambiente leve e focado em performance (Node.js Docker Hub).
* Mapeamento de Portas: Expõe a porta 3000 do container para a 3000 do host, permitindo o acesso à API.
* Persistência e Live Reload:
  *O volume ./backend:/app permite o bind mount, possibilitando que alterações no código local reflitam no container sem necessidade de novo build.
  *O volume específico em ./backend/src/data garante a persistência de dados (como bancos de dados SQLite ou JSON) fora do ciclo de vida do container.
* Resiliência: Configurado com restart: unless-stopped para garantir que o serviço reinicie automaticamente em caso de falhas críticas do sistema.

---

### 2. Frontend (Nginx)

* Imagem Base: Baseada em nginx:alpine, otimizada para servir arquivos estáticos com baixo consumo de recursos (Nginx Docker Hub).
* Proxy Reverso/Serviço: O container mapeia a porta 80 (padrão HTTP) para a porta 8080 do host.
* Estratégia de Build: O Dockerfile limpa o diretório padrão do Nginx e injeta o código fonte diretamente em /usr/share/nginx/html.

---

### 3. Orquestração e Dependências

* Rede Interna: O Docker Compose cria uma rede virtual onde os serviços se comunicam pelo nome (ex: o frontend pode buscar dados usando [http://localhost:3000](http://localhost:3000)).
* Ordem de Inicialização: A diretiva depends_on estabelece que o container do frontend só será iniciado após o container do backend estar operacional, evitando erros de conexão no carregamento inicial.

---

## Estrutura completa

```bash
.
├── backend
│   ├── Dockerfile
│   ├──.dockerignore
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── src
│       ├── app.js
│       ├── controllers
│       │   └── orderController.js
│       ├── data
│       │   └── pedidos.json
│       ├── routes
│       │   └── orderRoutes.js
│       ├── services
│       │   └── fileService.js
│       └── utils
│           ├── filterOrders.js
│           ├── newOrderConstruction.js
│           ├── newOrderSchemaValidation.js
│           ├── orderUpdater.js
│           ├── orderUpdaterSchemaValidation.js
│           └── stateMachine.js
├── BACKLOG.md
├── docker-compose.yml
├── frontend
│   ├── css
│   │   ├── components
│   │   │   ├── buttons.css
│   │   │   ├── graphs.css
│   │   │   ├── inputs.css
│   │   │   ├── modals.css
│   │   │   ├── selects.css
│   │   │   └── tables.css
│   │   ├── pages
│   │   │   ├── edit-order.css
│   │   │   └── new-order.css
│   │   └── style.css
│   ├── Dockerfile
│   ├──.dockerignore
│   ├── index.html
│   ├── js
│   │   ├── api
│   │   │   ├── client.js
│   │   │   └── orders.js
│   │   ├── components
│   │   │   ├── newOrderElements.js
│   │   │   ├── orderGraphs.js
│   │   │   ├── orderModalDetails.js
│   │   │   └── orderTable.js
│   │   ├── pages
│   │   │   ├── address.js
│   │   │   ├── edit-order.js
│   │   │   ├── main.js
│   │   │   └── new-order.js
│   │   └── utils
│   │       └── addressAPI.js
│   └── pages
│       ├── edit-order.html
│       └── new-order.html
├── README.md
├── teste-api.sh
└── teste.txt

18 directories, 44 files
```

---

# Como Executar

## Atalhos

* [Pré-requisitos](#pré-requisitos)
* [Passo a passo](#passo-a-passo)
* [Observações importantes](#observações-importantes)

---

## Pré-requisitos

* Antes de começar, você precisa ter instalado:

  *Docker
  *Docker compose - atualmente já incluso no Doker Desktop (Win/Mac) ou docker-compose-plugin (Linux)
  *Git

---

## Passo a passo

Clone o repositório
Abra o terminal e execute:

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

Construa as imagens e suba os containers
Dentro da pasta raiz do projeto (onde está o arquivo docker-compose.yml), execute:

```bash
docker compose up -d --build
```

A flag -d faz com que os containers rodem em segundo plano (modo detached).

A flag --build força a reconstrução das imagens antes de iniciar.

Alternativa para versões mais antigas do Docker Compose (com hífen):

```bash
docker-compose up -d --build
```

Acompanhe os logs (opcional)
Para ver se tudo está funcionando corretamente:

```bash
docker compose logs -f
```

Pressione Ctrl+C para sair do modo de acompanhamento.

Acesse a aplicação

Frontend: abra o navegador em [http://localhost:8080](http://localhost:8080)

Backend (API): a API estará disponível em [http://localhost:3000](http://localhost:3000).
Exemplo de teste rápido:

```bash
curl http://localhost:3000/orders
```

Parar os containers
Quando quiser encerrar a execução:

```bash
docker compose down
```

Isso para e remove os containers, mas mantém as imagens e os volumes de dados.

Limpeza completa (opcional)
Para remover também as imagens e os volumes (cuidado: os dados salvos em pedidos.json serão perdidos):

```bash
docker compose down --rmi all --volumes
```

---

# Observações importantes

Os dados dos pedidos são armazenados no arquivo backend/src/data/pedidos.json. Esse arquivo é persistido fora do container graças ao volume definido no docker-compose.yml. Assim, mesmo após docker compose down, os dados continuam intactos.

Se você estiver no Windows, pode ser necessário compartilhar a unidade onde o projeto está localizado nas configurações do Docker Desktop (Settings > Resources > File Sharing).

No Linux, certifique-se de que o usuário atual tem permissão para executar comandos Docker (ou use sudo). Para evitar sudo, adicione seu usuário ao grupo docker:

```bash
sudo usermod -aG docker $USER
```

---

# Considerações Finais

* Versão 1.0 Finalizada

* Author: Carlos Henrique Rodrigues Ribeiro

* Este projeto está sob a licença MIT - veja o arquivo [LICENSE](URL) para detalhes.

---
