# Permissionless Token Swap

A contract that accepts token A and swaps it with token B permissionless. The price feed for the swap is gotten by using chainlink Data Feeds which enable the smart contract to retrieve the latest pricing data of an asset in a single call.

## Installation
This project is created using Hardhat. Hardhat is an Ethereum development environment for professionals. It facilitates performing frequent tasks, such as running tests, automatically checking code for mistakes, or interacting with a smart contract. 
To run this repo, recommended code editor is VS Code, fork the repo and

```bash
yarn install
```
## How to Use the Project
The project has four functions: </br> 
- 1. The first function is to get the LatestPrice of the two tokens the user wants to swap, it accepts the address of token A and Token B which will be passed on to ChainLink price feed AggregatorV3. The AggregatorV3Interface has already been imported. </br>
- 2. The second function is where the swap takes place, it accepts </br>a) the address of the caller, </br>b) the amount, </br>c) the decimals(most tokens are 18 decimals) </br>d) The contract address of Token A </br>e) The contract address of Token B. </br>f&g)The last two is the chainlink price feed address of Token A and Token B. </br></br>
The first function (getLatestPrice) is called inside the second fn to get the price of the tokens needed for the exchange, this will return the price of each tokens which is now destructured 
```bash
(uint256 priceTokenA, uint256 priceTokenB) = getLatestPrice(_priceTokenA, _priceTokenB);
```
- 3. The Third function adds Liquidity to the contract vaults 
- 
## Usage

```
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
