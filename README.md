# **Developers API**

## **Introdução**

Através dessa API REST é possível realizar o registro da uma pessoa desenvolvedora, associar informações extras a mesma, registrar projetos e associar as tecnologias utilizadas nesses projetos e, por fim, adicionar projetos às respectivas pessoas desenvolvedoras.

### AVISO

Essa aplicação possui testes automatizados. Os testes não devem ser alterados.

- Para rodar a aplicação precisa popular as variaveis de ambiente, que irá encontrar no env.exemple:
    - Tanto as com sufixo test (DB_TEST, DB_TEST_USER...) para conseguir utilizar o comando npm run test. 
    - Quanto as demais (DB, DB_USER...) para conseguir utilizar o comando npm run dev 
- Para rodar os testes utilize o comando: **npm run test**
- Caso queria rodar uma bateria de testes especificos pode utilizar:
  - npm run test <arquivo teste que está dentro de __testes__>
  - **Exemplo**: npm run test createDeveloper.test

## **Relacionamentos**

**developers e developer_infos**
**developers e projects**
**projects e projects_technologies**

## **Rotas - /developers**

## Endpoints

| Método | Endpoint              | Responsabilidade                                    |
| ------ | --------------------- | --------------------------------------------------- |
| POST   | /developers           | Cadastrar uma nova pessoa desenvolvedora            |
| GET    | /developers/:id       | Listar uma pessoa desenvolvedora e seus projetos    |
| PATCH  | /developers/:id       | Atualizar os dados de uma pessoa desenvolvedora     |
| DELETE | /developers/:id       | Remover uma pessoa desenvolvedora                   |
| POST   | /developers/:id/infos | Cadastrar informações adicionais a pessoa dev       |

## **Rota - /projects**

## Endpoints

| Método | Endpoint                         | Responsabilidade                         |
| ------ | -------------------------------- | ---------------------------------------- |
| POST   | /projects                        | Cadastrar um novo projeto                |
| GET    | /projects/:id                    | Listar um projeto pelo id                |
| PATCH  | /projects/:id                    | Atualizar um projeto                     |
| DELETE | /projects/:id                    | Excluir um projeto                       |
| POST   | /projects/:id/technologies       | Cadastrar uma tecnologia para um projeto |
| DELETE | /projects/:id/technologies/:name | Deletar uma tecnologia de um projeto     |

