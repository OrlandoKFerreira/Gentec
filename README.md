## Additional Documentation
This document contains a detailed description of my contributions to the Gentec project, including process documentation, frontend and backend development, API integration, and implementation of Human Resources management features using React and Spring Boot.

- [MyRole.md](MyRole.md)



# GENTEC


**Marcelo Santos Guimarães**

**Anderson Rungue Filho**

**Marcelo Lucas Pereira Filho**

**Gabriel Katahira Cordeiro**

**Orlando Kelvin Ferreira**

---

Professores:

** Cleia Marcia Gomes Amaral **

** Joana Gabriel Ribeiro de Souza **

---

_Curso de Engenharia de Software_

_Instituto de Informática e Ciências Exatas – Pontifícia Universidade Católica de Minas Gerais (PUC MINAS), Belo Horizonte – MG – Brasil_

---

_**Resumo**: 
Este trabalho apresenta a proposta de desenvolvimento de um sistema web voltado ao apoio da gestão de Recursos Humanos, inspirado nos conceitos de sistemas ERP. O sistema busca centralizar informações administrativas dos funcionários e facilitar a comunicação entre colaboradores e o setor de RH. Entre as funcionalidades previstas estão a visualização de benefícios, o registro diário de humor dos funcionários e a abertura de tickets para comunicação com o RH. A proposta surge da necessidade de reduzir o uso de planilhas e sistemas isolados, que dificultam a organização e integração das informações. Como resultado esperado, o sistema pretende contribuir para uma gestão mais organizada, melhorar o acompanhamento do bem-estar dos colaboradores e apoiar a tomada de decisões dentro da empresa._

---


## 1. Introdução

Este trabalho apresenta a proposta de desenvolvimento de um sistema web para apoio à gestão
de Recursos Humanos, com foco no acompanhamento de informações trabalhistas e no
monitoramento do bem-estar dentro da empresa.

### 1.1 Contextualização

Nos últimos anos, os sistemas ERP (Enterprise Resource Planning) têm sido amplamente adotados pelas organizações
para integrar e centralizar informações empresariais. Pesquisas indicam que a utilização de ERP pode melhorar significativamente o desempenho organizacional.
Uma pesquisa da Oracle NetSuite (2023) aponta que 66% das empresas que adotaram ERP observaram melhoria na eficiência operacional, enquanto 78% relataram aumento de produtividade e 62% indicaram redução de custos operacionais.

No Brasil, a adoção de sistemas ERP tem crescido nos últimos anos como forma de integrar processos empresariais e melhorar a gestão das organizações. Um estudo realizado pelas consultorias Kearney e Rimini Street (2024) mostrou que 64% das grandes empresas brasileiras e 58% das pequenas e médias empresas já utilizam sistemas ERP. Além disso, pesquisas indicam que 33,3% das organizações pretendem adquirir ou trocar seus sistemas de gestão nos próximos anos, demonstrando a crescente importância dessas ferramentas para a gestão empresarial.

### 1.2 Problema

Muitas empresas, especialmente de pequeno e médio porte, ainda utilizam planilhas ou sistemas separados para gerenciar informações relacionadas aos funcionários e aos processos do setor de Recursos Humanos. Essa falta de integração pode gerar dificuldades na organização dos dados, falhas de comunicação e maior possibilidade de erros no controle das informações.

Além disso, muitas organizações não possuem ferramentas estruturadas para que os funcionários possam registrar seu nível de satisfação ou relatar problemas de forma organizada. Isso dificulta a identificação de insatisfações e pode impactar negativamente o ambiente de trabalho e a produtividade.

Nesse contexto, sistemas ERP (Enterprise Resource Planning) têm sido adotados pelas empresas para centralizar informações e integrar processos internos, permitindo que diferentes áreas compartilhem dados em uma única plataforma e tornando a gestão organizacional mais eficiente. Segundo a IBM (2023), sistemas ERP ajudam a melhorar a eficiência operacional, reduzir duplicação de dados e apoiar a tomada de decisões dentro das organizações.

Dessa forma, este trabalho busca responder à seguinte questão: como desenvolver um sistema web capaz de organizar informações de Recursos Humanos e acompanhar o bem-estar dos funcionários de forma prática e acessível dentro das empresas?

### 1.3 Objetivo geral

Desenvolver um sistema web inspirado nos conceitos de sistemas ERP para auxiliar o setor de Recursos Humanos na centralização e organização das informações dos funcionários, além de possibilitar o acompanhamento do bem-estar dos colaboradores e a comunicação entre funcionários e o RH, contribuindo para uma gestão mais eficiente e organizada dentro da empresa.

#### 1.3.1 Objetivos específicos

- Criar uma área onde o funcionário possa visualizar informações como benefícios e informações administrativas.
- Desenvolver um sistema de registro diário de humor para que o funcionário possa indicar como está se sentindo.
- Implementar um sistema de abertura de tickets para que o funcionário possa se comunicar com o RH.
- Permitir que o RH visualize e acompanhe os registros feitos pelos funcionários.

### 1.4 Justificativas

O desenvolvimento deste sistema é importante porque ajuda a organizar melhor os processos do setor de RH e facilita a comunicação entre empresa e funcionário.
Além disso, acompanhar o humor e o nível de satisfação dos colaboradores pode ajudar a identificar problemas antes que se tornem maiores,
contribuindo para um ambiente de trabalho mais saudável.
O sistema também contribui para a modernização da empresa, tornando os processos mais organizados e digitais, alinhando-se às práticas de digitalização e integração de processos empresariais promovidas por sistemas ERP (IBM, 2023)

## 2. Participantes do processo

## 2.1 Funcionário
### Perfil:
- Adultos de diferentes idades.
- Diferentes níveis de escolaridade.
- Conhecimento básico de informática.
### Papel no Sistema:
- Visualizar benefícios.
- Registrar diariamente seu humor.
- Abrir tickets para falar com o RH.
- Acompanhar suas solicitações.
## 2.2 Profissional de RH
### Perfil:
- Profissional responsável pela gestão de pessoas na empresa.
- Conhecimento básico ou intermediário em sistemas administrativos.
### Papel no sistema:
- Gerenciar informações dos funcionários.
- Visualizar registros de humor e relatórios gerais.
- Responder e acompanhar tickets abertos.
- Utilizar as informações para melhorar o ambiente organizacional.
- Gerenciar informações administrativas dos funcionários.

## Fontes 
- IBM. Enterprise. Resource Planning advantages and disadvantages https://www.ibm.com/think/insights/enterprise-resource-planning-advantages-disadvantages
- Oracle NetSuite. https://www.netsuite.com/portal/resource/articles/erp/erp-statistics.shtml
- Rimini Street / Kearney. Panorama ERP no mercado brasileiro. https://www.riministreet.com/br/press-releases/kearney-panorama-erp-no-mercado-brasileiro/

## 3. Modelagem do processo de negócio

- Gestão de informações dos funcionários
Processo responsável por centralizar e organizar as informações administrativas dos colaboradores dentro do sistema. Permite que o setor de Recursos Humanos cadastre, atualize e gerencie os dados dos funcionários, enquanto os colaboradores podem visualizar informações como benefícios e dados administrativos.

- Registro de ponto dos funcionários
Processo responsável pelo registro da jornada de trabalho dos colaboradores. Os funcionários podem registrar seus horários de entrada e saída no sistema.

- Fiscalização do ponto dos funcionários
Processo responsável pela fiscalização e auditoria dos registros de jornada de trabalho dos colaboradores. A equipe de RH é a única responsável por verificar, auditar e corrigir os registros de ponto, garantindo a conformidade com as normas da empresa.

- Registro e acompanhamento de bem-estar dos funcionários
Processo voltado ao monitoramento do bem-estar dos colaboradores por meio do registro diário de humor. Os funcionários podem registrar como estão se sentindo, enquanto o setor de RH pode acompanhar esses registros e identificar possíveis problemas relacionados ao clima organizacional.

- Comunicação entre funcionários e RH por meio de tickets
Processo responsável por permitir a comunicação estruturada entre os funcionários e o setor de Recursos Humanos. Os colaboradores podem abrir tickets para relatar problemas ou realizar solicitações, enquanto o RH pode responder e acompanhar cada solicitação até sua resolução.

### 3.1. Análise da situação atual

Atualmente, o processo de gestão de Recursos Humanos em muitas empresas, especialmente de pequeno e médio porte, ocorre de forma descentralizada e com baixo nível de padronização. A seguir, descreve-se como os principais processos são executados na prática, representando a situação atual.

**Cadastro e atualização de funcionários:**  
O cadastro de novos colaboradores é realizado manualmente, geralmente em planilhas ou sistemas isolados. O setor de RH insere dados como informações pessoais, cargo, salário e benefícios sem integração com outras ferramentas. Atualizações cadastrais dependem de solicitações feitas por e-mail, mensagens ou comunicação verbal, o que pode gerar atrasos e inconsistências nos dados.

**Gestão de benefícios:**  
O controle de benefícios é feito por meio de planilhas ou diretamente em sistemas de fornecedores, sem integração entre as informações. Solicitações de alteração são encaminhadas ao RH, que realiza o processo manualmente. Esse fluxo não padronizado aumenta a chance de erros e dificulta o controle histórico das alterações.

**Controle de ponto:**  
O registro da jornada de trabalho pode ocorrer em sistemas eletrônicos ou de forma manual. A consolidação dos dados, no entanto, frequentemente exige exportação e tratamento em planilhas. Ajustes de ponto são solicitados diretamente ao RH ou gestores, sem um fluxo formal definido, o que compromete a rastreabilidade.

**Comunicação entre colaboradores e RH:**  
A comunicação ocorre principalmente por canais informais, como e-mail e aplicativos de mensagens. Não existe um canal único para abertura e acompanhamento de solicitações, o que dificulta o controle das demandas e o tempo de resposta.

**Acompanhamento do bem-estar dos funcionários:**  
O acompanhamento do bem-estar não é estruturado. Quando ocorre, é realizado por meio de conversas informais ou pesquisas pontuais, sem periodicidade definida ou registro sistemático dos dados, o que dificulta a análise contínua.

**Integração e consolidação de dados:**  
As informações ficam distribuídas em diferentes fontes, como planilhas, sistemas distintos e comunicações informais. A consolidação depende de esforço manual, aumentando o risco de inconsistências, retrabalho e perda de informações.

Embora existam soluções no mercado, como TOTVS RM, Senior HCM e Gupy, que oferecem maior integração e automação, muitas empresas de pequeno/médio porte ainda operam de modo pouco eficiente. Seja pelo custo elevado desses softwares, ou pela falta de conhecimento dos representates das empresas.

### 3.2. Descrição geral da proposta de solução

A proposta deste trabalho consiste no desenvolvimento de um sistema web inspirado em sistemas ERP, com foco na organização, padronização e centralização dos processos de Recursos Humanos. A seguir, descreve-se como os principais processos passam a funcionar na situação proposta.

**Cadastro e atualização de funcionários:**  
O cadastro de colaboradores será realizado em um sistema centralizado, com armazenamento estruturado em banco de dados. O setor de RH será responsável pela criação e manutenção dos registros, enquanto os próprios funcionários poderão visualizar suas informações. Atualizações cadastrais poderão ser solicitadas diretamente pelo sistema, por meio de tickets, garantindo a padronização do processo.

**Gestão de benefícios:**  
As informações de benefícios ficarão centralizadas na plataforma, permitindo que os colaboradores consultem seus dados a qualquer momento. Solicitações de alteração serão feitas por meio do sistema e encaminhadas ao RH, que poderá analisar e processar cada demanda dentro de um fluxo definido, mantendo histórico das alterações realizadas.

**Controle de ponto:**  
O sistema poderá integrar ou registrar informações relacionadas à jornada de trabalho, permitindo a visualização organizada dos dados. Solicitações de ajuste de ponto serão realizadas diretamente na plataforma, seguindo um fluxo estruturado de envio, análise e aprovação, garantindo maior controle e rastreabilidade.

**Comunicação entre colaboradores e RH:**  
Será implementado um sistema de tickets, no qual os colaboradores poderão abrir solicitações, dúvidas ou requisições diretamente na plataforma. O RH poderá visualizar, responder e acompanhar cada ticket, mantendo um histórico das interações e organizando o fluxo de comunicação.

**Acompanhamento do bem-estar dos funcionários:**  
Os colaboradores poderão registrar diariamente seu humor por meio do sistema. Essas informações serão armazenadas e disponibilizadas para análise pelo RH, permitindo o acompanhamento contínuo do bem-estar e a identificação de possíveis problemas no ambiente de trabalho.

**Integração e consolidação de dados:**  
Todas as informações serão centralizadas em uma única plataforma, eliminando a necessidade de múltiplas planilhas e sistemas isolados. O sistema permitirá a visualização consolidada dos dados, reduzindo inconsistências, retrabalho e facilitando a tomada de decisão.

Com essa proposta, espera-se padronizar os processos de RH, aumentar a eficiência operacional e melhorar a comunicação interna, oferecendo uma solução mais simples e adequada ao contexto de empresas que utilizam apenas planilhas para se organizar.

### 3.3. Modelagem dos processos

[PROCESSO 1 - Nome do Processo](processo-1-nome-do-processo.md "Detalhamento do Processo 1.")

[PROCESSO 2 - Nome do Processo](processo-2-nome-do-processo.md "Detalhamento do Processo 2.")

[PROCESSO 3 - Nome do Processo](processo-3-nome-do-processo.md "Detalhamento do Processo 3.")

[PROCESSO 4 - Nome do Processo](processo-4-nome-do-processo.md "Detalhamento do Processo 4.")

## 4. Projeto da solução

_O documento a seguir apresenta o detalhamento do projeto da solução. São apresentadas duas seções que descrevem, respectivamente: modelo relacional e tecnologias._

[Projeto da solução](solution-design.md "Detalhamento do projeto da solução: modelo relacional e tecnologias.")


## 5. Indicadores de desempenho

_O documento a seguir apresenta os indicadores de desempenho dos processos._

[Indicadores de desempenho dos processos](performance-indicators.md)


## 6. Interface do sistema

_A sessão a seguir apresenta a descrição do produto de software desenvolvido._ 

[Documentação da interface do sistema](interface.md)

## 7. Conclusão

_Apresente aqui a conclusão do seu trabalho. Deve ser apresentada aqui uma discussão dos resultados obtidos no trabalho, local em que se verifica as observações pessoais de cada aluno. Essa seção poderá também apresentar sugestões de novas linhas de estudo._

# REFERÊNCIAS

_Como um projeto de software não requer revisão bibliográfica, a inclusão das referências não é obrigatória. No entanto, caso você deseje incluir referências relacionadas às tecnologias, padrões, ou metodologias que serão usadas no seu trabalho, relacione-as de acordo com a ABNT._

_Verifique no link abaixo como devem ser as referências no padrão ABNT:_

http://portal.pucminas.br/imagedb/documento/DOC_DSC_NOME_ARQUI20160217102425.pdf

**[1.1]** - _ELMASRI, Ramez; NAVATHE, Sham. **Sistemas de banco de dados**. 7. ed. São Paulo: Pearson, c2019. E-book. ISBN 9788543025001._

**[1.2]** - _COPPIN, Ben. **Inteligência artificial**. Rio de Janeiro, RJ: LTC, c2010. E-book. ISBN 978-85-216-2936-8._

**[1.3]** - _CORMEN, Thomas H. et al. **Algoritmos: teoria e prática**. Rio de Janeiro, RJ: Elsevier, Campus, c2012. xvi, 926 p. ISBN 9788535236996._

**[1.4]** - _SUTHERLAND, Jeffrey Victor. **Scrum: a arte de fazer o dobro do trabalho na metade do tempo**. 2. ed. rev. São Paulo, SP: Leya, 2016. 236, [4] p. ISBN 9788544104514._

**[1.5]** - _RUSSELL, Stuart J.; NORVIG, Peter. **Inteligência artificial**. Rio de Janeiro: Elsevier, c2013. xxi, 988 p. ISBN 9788535237016._



# APÊNDICES


_Atualizar os links e adicionar novos links para que a estrutura do código esteja corretamente documentada._


## Apêndice A - Código fonte

[Código do front-end](../src/front) -- repositório do código do front-end

[Código do back-end](../src/back)  -- repositório do código do back-end


## Apêndice B - Apresentação final


[Slides da apresentação final](presentations/)


[Vídeo da apresentação final](video/)






