# LaserOps — Autenticação e Controle de Acesso

## Alunos

* Gabriel Toledano Feitosa
* Larissa de Andrade Silva
* Rafael Castilho Carvalho

## Links

* **Github**: ![https://github.com/RCCMclovin/LaserOPS](https://github.com/RCCMclovin/LaserOPS)

* **Demo**: ![https://laserops.rcchome.com.br](https://laserops.rcchome.com.br)

### Observação:

O demo está no ar usando um servidor próprio e, portanto, está sujeito a alguma instabilidade, podendo cair devido à quedas de energia ou outros problemas de infra. Caso o demo não esteja disponível, favor entrar em contato através do email "rcc@icomp.ufam.edu.br".

## Descrição

O **LaserOps** é uma aplicação web para gerenciamento e participação em eventos interativos. O sistema foi desenvolvido como atividade prática de **autenticação e controle de acesso**, com backend em Node.js/Express e frontend em React.

A aplicação permite cadastro, login, controle de sessão, papéis de usuário, criação de eventos, participação como espectador ou jogador e uma área administrativa para análise de pedidos de usuários que desejam se tornar organizadores.

## Requisitos atendidos

A implementação contempla os pontos solicitados na atividade:

* cadastro de usuários;

* login funcional;

* armazenamento seguro de senhas com hash;

* autenticação baseada em token de sessão HTTP-only;

* proteção de rotas privadas;

* controle de acesso com mais de um nível de permissão;

* permissões verificadas no backend, não apenas no frontend;

* interação funcional com eventos e participação.

## Fluxo de autenticação

O usuário pode criar uma conta pela tela de cadastro. Durante o cadastro, a senha é processada com `bcryptjs`, usando salt e hash antes de ser armazenada no banco.

Após cadastro ou login, o backend cria uma sessão autenticada e envia ao navegador um cookie HTTP-only. Esse cookie funciona como um token opaco de autenticação. Nas próximas requisições, o frontend envia esse cookie usando `withCredentials: true`, e o backend valida a sessão por meio de `req.session.uid`.

O papel do usuário é armazenado na sessão em `req.session.utid` e também pode ser consultado pela rota de verificação de usuário logado.

## Tipos de usuários

O sistema possui três papéis principais:

| Papel | Descrição |
| --- | --- |
| `client` | Usuário comum. Pode acessar eventos, participar como espectador ou jogador e solicitar mudança para organizador. |
| `store` | Organizador. Pode criar, editar, publicar, despublicar e remover seus próprios eventos. |
| `admin` | Administrador. Pode acessar recursos administrativos, gerenciar eventos e responder pedidos para tornar usuários organizadores. |

No frontend, esses papéis são apresentados de forma amigável como **Participante**, **Organizador** e **Administrador**.

## Controle de acesso

O controle de acesso é aplicado no backend por middlewares e verificações nos controllers.

Principais mecanismos:

* `isAuth`: exige usuário autenticado;

* `isAdmin`: restringe acesso a administradores;

* `isAdminOrSelf`: permite acesso ao administrador ou ao próprio usuário;

* verificação de propriedade do evento: apenas o criador do evento ou um administrador pode editar, publicar, despublicar ou remover o evento;

* bloqueio de autopromoção: usuários comuns não podem alterar diretamente seu próprio papel;

* rota específica para consultar as participações do usuário logado.

Essas regras impedem que as permissões sejam apenas visuais. Mesmo que um usuário tente chamar uma rota diretamente, o backend valida autenticação e autorização antes de executar a ação.

## Rotas públicas

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/v1/auth/signup` | Cadastro de usuário |
| `POST` | `/v1/auth/login` | Login |
| `GET` | `/v1/user/checkemail/:email` | Verificação de e-mail disponível |

## Rotas autenticadas

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/v1/auth/logout` | Encerrar sessão |
| `GET` | `/v1/user/chkrole` | Consultar usuário logado e papel |
| `GET` | `/v1/event` | Listar eventos publicados |
| `GET` | `/v1/event/read/:eventId` | Consultar detalhes de um evento |
| `POST` | `/v1/participant/:eventId` | Entrar em evento como espectador |
| `POST` | `/v1/participant/:eventId/:code` | Entrar em evento como jogador usando código |
| `DELETE` | `/v1/participant/:eventId` | Cancelar participação no evento |
| `GET` | `/v1/participant/me` | Listar eventos em que o usuário logado está inscrito |
| `POST` | `/v1/request` | Solicitar mudança para organizador |

## Rotas restritas por papel ou propriedade

| Método | Rota | Permissão | Descrição |
| --- | --- | --- | --- |
| `POST` | `/v1/event` | `store` ou `admin` | Criar evento |
| `PUT` | `/v1/event/:eventId` | Criador do evento ou `admin` | Editar evento |
| `POST` | `/v1/event/publish/:eventId` | Criador do evento ou `admin` | Publicar ou despublicar evento |
| `DELETE` | `/v1/event/:eventId` | Criador do evento ou `admin` | Remover evento |
| `GET` | `/v1/request` | `admin` | Listar pedidos para virar organizador |
| `POST` | `/v1/request/accept/:requestId` | `admin` | Aceitar pedido |
| `POST` | `/v1/request/refuse/:requestId` | `admin` | Recusar pedido |
| `GET` | `/v1/user` | `admin` | Listar usuários |
| `GET` | `/v1/user/:userId` | Próprio usuário ou `admin` | Consultar usuário |
| `PUT` | `/v1/user/:userId` | Próprio usuário ou `admin` | Atualizar usuário |
| `DELETE` | `/v1/user/:userId` | Próprio usuário ou `admin` | Remover usuário |

## Funcionalidades demonstráveis no frontend

O frontend implementa um fluxo básico e funcional para demonstração:

1. cadastro de novo usuário;
2. login com sessão autenticada;
3. exibição do usuário logado e seu papel;
4. listagem de eventos publicados;
5. exibição do organizador de cada evento;
6. entrada em evento como espectador;
7. entrada em evento como jogador usando código;
8. indicação visual dos eventos em que o usuário está inscrito;
9. botão para cancelar inscrição;
10. criação e gerenciamento básico de eventos por organizador ou administrador;
11. área administrativa para aceitar ou recusar pedidos para virar organizador.

## Segurança das senhas

As senhas não são armazenadas em texto puro. O backend utiliza `bcryptjs` para gerar hash antes da persistência no banco. No login, a senha informada é comparada com o hash armazenado, sem expor a senha original.

## Observação sobre JWT

O sistema não utiliza JWT literal. Em vez disso, utiliza autenticação baseada em sessão com cookie HTTP-only. Esse cookie funciona como um token opaco: o cliente não acessa seu conteúdo, mas o envia automaticamente nas requisições autenticadas, e o backend valida a sessão no servidor.

Essa abordagem atende ao requisito de autenticação por token ou mecanismo equivalente.

## Como executar

### Backend

```bash
cd src-back
npm install
npm run dev
```

Por padrão, o backend utiliza:

```text
http://localhost:3334
```

### Frontend

```bash
cd src-front
npm install
npm run dev
```

O endereço do frontend será informado pelo Vite no terminal.

## Variáveis de ambiente

Exemplo de variáveis usadas pelo backend:

```env
DATABASE_URL="sua_url_do_banco"
SESSION_SECRET="uma_chave_secreta_forte"
NODE_ENV="development"
```

## Demonstração sugerida

Para apresentar o trabalho, recomenda-se demonstrar:

1. cadastro de um usuário comum;
2. login e acesso ao dashboard;
3. tentativa de acesso a rotas privadas sem login;
4. listagem de eventos publicados;
5. inscrição em evento como espectador;
6. indicação visual da inscrição no dashboard;
7. cancelamento da inscrição;
8. solicitação para virar organizador;
9. login como administrador;
10. aceite ou recusa do pedido de organizador;
11. criação, edição, publicação e remoção de evento por organizador ou administrador.

## Status do projeto

Esta versão implementa o núcleo da atividade de autenticação e controle de acesso. O projeto ainda pode ser expandido em etapas futuras com melhorias no painel administrativo, filtros de eventos, gerenciamento avançado de participantes e refinamentos visuais.
