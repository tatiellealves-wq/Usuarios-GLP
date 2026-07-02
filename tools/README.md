# Ferramentas internas — não publicar

Esta pasta (`tools/`) é de **uso interno**. Ela **não** vai para o site publicado
(o deploy só envia a pasta `dist/`), mas o arquivo abaixo contém o segredo que
valida os códigos. Trate-o como uma senha.

## `generador-codigos.html`

Gerador de códigos de ativação do app. Abra o arquivo com dois cliques no seu
computador (funciona sem internet). Nele você pode:

- **Gerar** lotes de até 1000 códigos únicos (`GLP1-XXXX-XXXX`).
- **Copiar** todos ou **baixar um CSV** (com coluna para anotar a quem entregou).
- **Verificar** se um código específico é válido.

Os códigos são validados dentro do próprio app, sem servidor: o app recalcula o
dígito verificador. Por isso qualquer código gerado aqui já funciona na hora, e
códigos inventados são rejeitados.

## Como entregar os códigos pela plataforma de venda

O app aceita códigos únicos, então a ideia é **entregar um código diferente para
cada compradora, de forma automática**. Usando um "estoque" de códigos:

1. Gere um lote (ex.: 200 códigos) e baixe o CSV.
2. Suba a lista de códigos na sua plataforma:
   - **Hotmart:** use o recurso de **Chave de Licença / Serial** do produto —
     você cola/importa a lista de códigos e a Hotmart entrega um código diferente
     para cada compra, automaticamente, junto do e-mail de acesso.
   - **Kiwify:** entregue o código pela **área de membros** ou pelo campo de
     conteúdo pós-compra. Se a Kiwify não tiver entrega automática de códigos
     únicos no seu plano, dá para automatizar com uma planilha + integração
     (Zapier/Make) que envia o próximo código da lista a cada venda.
   > Os nomes dos menus mudam com o tempo — procure por "chave de licença",
   > "serial" ou "código de acesso" nas configurações do produto.
3. No e-mail/entrega, inclua o link do app + o código + uma linha de suporte:
   "Se seu código não funcionar, escreva para soporte@guiaglp1.com".

Quando o estoque estiver acabando, gere outro lote e adicione à plataforma.

## Código mestre (legado)

Existe um código mestre fixo no app (em `src/app/data.ts`, `CLAVE_ACCESO`) que
continua válido para compradoras antigas. Não divulgue esse código — ele serve
só de rede de segurança. Se preferir desativá-lo, é só remover a checagem em
`src/app/App.tsx`.

## Segurança — o que é importante saber

- **Mantenha o repositório do GitHub privado.** O segredo que valida os códigos
  fica neste repositório. Com o repositório privado, ninguém de fora o vê.
- Como o app roda 100% no navegador (sem servidor), esse sistema **impede o
  compartilhamento casual** (cada compradora tem seu código, ninguém "adivinha"
  um código válido), mas **não** impede uma pessoa muito técnica de extrair o
  segredo do próprio app. Para a maioria dos infoprodutos isso é suficiente.
- Se um dia quiser proteção de verdade (cada código funciona **uma única vez**,
  atrelado à compra), aí sim é preciso um pequeno servidor validando os códigos
  contra um banco de dados.
