# uniswapV3 Swap Detection Bot

## Description

 This bot detect swap that occurs on uniswap v3 pool 

## Supported chain

- Polygon 

## Alerts
Uniswap-1
- It is fired when Uniswap swap is detected
- it emmits the token address and the pool address 
- Finding type is set to Info 
- FInding severity is set to Low
- Metadata includes
   - sender: the address of the sender
   - recipient: the address of the recipient
   - token0: the address of the token deposited
   - token1: the address of the token to be reeceived
   - amount0: amount of token deposited
   - amount1: amount of token to be received

### Test Data 
The agent behaviour can be verified with the following transactions 
- [0x7975aea0805769213e0f733a4a9da9de7705980618f26dcedbf6a9a2ad15c949](https://polygonscan.com/tx/0x7975aea0805769213e0f733a4a9da9de7705980618f26dcedbf6a9a2ad15c949)




