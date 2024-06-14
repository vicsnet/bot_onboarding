# uniswap swap detection

## Description

<p> This bot detect swap that occurs on uniswap v3 pool </P>

## Supported chain

<li> Polygon </li>

## Alerts

<li>It is fired when swap is detected</li>
<li> it emmits the token address and the pool address </li>
<li> Finding type is an info </li>

### transaction text
### npm run tx 0x7975aea0805769213e0f733a4a9da9de7705980618f26dcedbf6a9a2ad15c949

succesful uniswap transaction was returned

#### npm run tx 0xa1fda0bea135688dc601811dc9dbe5632672f1af5bc4ee2866b33851e88c356c
<p>This transaction fails since is not a unswap transaction</p>