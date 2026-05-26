### 3.3.3 Processo 3 – Controle de Humor

Registro e acompanhamento de bem-estar dos funcionários

O processo ocorre no sistema da empresa e tem como objetivo registrar e acompanhar o bem-estar dos funcionários por meio do controle de humor. Ele se inicia quando o usuário acessa a página de humor.

Em seguida, o sistema verifica o tipo de usuário. Caso seja um gestor de RH, ele acessa o painel de registros de humor, onde pode escolher entre visualizar o histórico geral, o histórico de um usuário específico ou o histórico mensal. Após a visualização das informações, o processo é encerrado.

Caso o usuário seja um funcionário, ele acessa a página de humor, onde pode escolher entre visualizar o histórico de seus registros ou registrar um novo humor. Se optar por visualizar o histórico, ele consulta os dados e o processo pode ser encerrado. Se optar por registrar o humor, ele informa seu estado (como feliz, neutro, triste ou estressado) e, opcionalmente, adiciona um comentário. Após salvar, o registro é armazenado e o processo é finalizado.

O processo se encerra com o registro do humor ou com a visualização das informações. O produto final é o histórico de humor atualizado, permitindo o acompanhamento do bem-estar dos funcionários pelo próprio usuário e pelo RH

![Processo3](https://github.com/user-attachments/assets/43c2277f-5058-4f7b-9eb3-e90c8e031bad)

#### Detalhamento das atividades

Atividade 1 **Visualizar página de humor**

![Wireframe - Dashboard Funcionário](images/processo3-wireframes/dash-funcionario.jpeg)

| **Campo**  | **Tipo**      | **Restrições**                                          | **Valor default** |
| ---------- | ------------- | ------------------------------------------------------- | ----------------- |
| Humor      | Seleção única | Somente leitura; exibido apenas se já registrado no dia | —                 |
| Comentário | Área de texto | Somente leitura; exibido apenas se já registrado no dia | —                 |

| **Comandos**    | **Destino**                                | **Tipo** |
| --------------- | ------------------------------------------ | -------- |
| Registrar Humor | Registrar humor                            | default  |
| Ver Histórico   | Visualizar histórico de registros de humor | default  |

---

Atividade 2 **Registrar Humor**

![Wireframe - Registrar Humor](images/processo3-wireframes/registrar-humor.jpeg)

| **Campo**                        | **Tipo**      | **Restrições**                                         | **Valor default** |
| -------------------------------- | ------------- | ------------------------------------------------------ | ----------------- |
| Como você está se sentindo hoje? | Seleção única | Obrigatório; opções: Feliz, Neutro, Triste, Estressado | Feliz             |
| Comentário                       | Área de texto | Opcional                                               | —                 |

| **Comandos** | **Destino**       | **Tipo** |
| ------------ | ----------------- | -------- |
| Salvar       | Fim do Processo 3 | default  |

---

Atividade 3 **Visualizar histórico de registros de humor**

![Wireframe - Histórico de Humor](images/processo3-wireframes/historico-humor.jpeg)

| **Campo**    | **Tipo** | **Restrições**                                       | **Valor default** |
| ------------ | -------- | ---------------------------------------------------- | ----------------- |
| Data inicial | Data     | Opcional; deve ser anterior ou igual à data final    | —                 |
| Data final   | Data     | Opcional; deve ser posterior ou igual à data inicial | —                 |
| Registros    | Tabela   | Somente leitura; colunas: Data, Humor, Comentário    | —                 |

| **Comandos** | **Destino**                                | **Tipo** |
| ------------ | ------------------------------------------ | -------- |
| Filtrar      | Visualizar histórico de registros de humor | default  |

---

Atividade 4 **Visualizar painel de registros de humor**

![Wireframe - Dashboard RH](images/processo3-wireframes/dash-rh.jpeg)

| **Campo**     | **Tipo** | **Restrições**                                              | **Valor default** |
| ------------- | -------- | ----------------------------------------------------------- | ----------------- |
| Resumo Diário | Tabela   | Somente leitura; colunas: Feliz, Neutro, Triste, Estressado | —                 |
| Resumo Mensal | Tabela   | Somente leitura; colunas: Feliz, Neutro, Triste, Estressado | —                 |

| **Comandos**         | **Destino**                                       | **Tipo** |
| -------------------- | ------------------------------------------------- | -------- |
| Ver Registros        | Visualizar histórico geral de registros de humor  | default  |
| Ver Histórico Mensal | Visualizar histórico mensal de registros de humor | default  |

---

Atividade 5 **Visualizar histórico geral de registros de humor**

![Wireframe - Ver Registros](images/processo3-wireframes/ver-registros.jpeg)

| **Campo**   | **Tipo**       | **Restrições**                                                | **Valor default** |
| ----------- | -------------- | ------------------------------------------------------------- | ----------------- |
| Data        | Data           | Opcional                                                      | —                 |
| Funcionário | Caixa de texto | Opcional                                                      | —                 |
| Registros   | Tabela         | Somente leitura; colunas: Funcionário, Data, Humor, Histórico | —                 |

| **Comandos** | **Destino**                                         | **Tipo** |
| ------------ | --------------------------------------------------- | -------- |
| Filtrar      | Visualizar histórico geral de registros de humor    | default  |
| Visualizar   | Visualizar histórico de humor de usuário específico | default  |

---

Atividade 6 **Visualizar histórico de humor de usuário específico**

![Wireframe - Histórico de Humor](images/processo3-wireframes/historico-rh.jpeg)

| **Campo** | **Tipo** | **Restrições**                                    | **Valor default** |
| --------- | -------- | ------------------------------------------------- | ----------------- |
| Registros | Tabela   | Somente leitura; colunas: Data, Humor, Comentário | —                 |

---

Atividade 7 **Visualizar histórico mensal de registros de humor**

![Wireframe - Histórico Mensal](images/processo3-wireframes/historicomensal.jpeg)

| **Campo**         | **Tipo** | **Restrições**                                                   | **Valor default** |
| ----------------- | -------- | ---------------------------------------------------------------- | ----------------- |
| Registros Mensais | Tabela   | Somente leitura; colunas: Mês, Feliz, Neutro, Triste, Estressado | —                 |
