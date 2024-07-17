# Maker Dao Bridge Scam Detection Bot

## Description

This Bot detect bridge transaction that occur on Arbitrium and Optimism and send alert to Etherum and Detect if Scam transaction occur by comparing the balance of layer 2 to layer 1

## Supported Chains

- Ethereum
- Arbibtrium
- Optimism

## Alerts

- Optimism-1 / Arbitrum-1
  - Fired when bridge transaction occur on the layer 2 protocol either Arbitrum or Optimism
  - it emmit the chainId of the protocol the transaction occur on
  - Severity is always set to 'low'
  - Finding type is set to 'Info'
  - Metadata includes
    - 'totalSupply': the total token hold by the layer2 Address
    - 'amount': amount of the the token transaction detected
    - 'from': address in which the transction occur from
    - 'to': address in which the token is sent to
- Arbitrum-2 / Optimism-2
  - Fired when scam transaction is detected form the alert
  - Severity is always set to 'high'
  - FInding type is set to 'suspicious'
  - Metadata includes
    - 'totalSupply': the total token holds on the layer2 protocol
    - 'balance': the balance of the escrow

## Test Data
