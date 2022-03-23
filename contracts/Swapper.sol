// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/* A contract that accepts token A and swap it with token B permissionlesssly
 */

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IERC20} from "./IERC20.sol";

contract swapToken {
    /**
     * Returns the latest price
     */
    function getLatestPrice(address _TokenA, address _TokenB)
        public
        view
        returns (uint256, uint256)
    {
        (, int256 PriceA, , , ) = AggregatorV3Interface(_TokenA)
            .latestRoundData();
        (, int256 PriceB, , , ) = AggregatorV3Interface(_TokenB)
            .latestRoundData();

        uint256 priceTokenA = uint256(PriceA);
        uint256 priceTokenB = uint256(PriceB);
        return (priceTokenA, priceTokenB);
    }

    /* To swap, I multipy _amount of tokenA with the chainlink priceFeed and divide with tokenB price */
    function swapTokenAtoB(
        address _address,
        uint256 _amount,
        uint8 _decimals,
        address _addressTokenA,
        address _addressTokenB,
        address _priceTokenA,
        address _priceTokenB
    ) public returns (bool success) {
        /* calling getLatestPrice function and passing chainLink pricefeed 
		address as parameter to get the rate of the token. */
        (uint256 priceTokenA, uint256 priceTokenB) = getLatestPrice(
            _priceTokenA,
            _priceTokenB
        );
        require(
            _decimals > uint8(0) && _decimals <= uint8(18),
            "Invalid _decimals"
        );
        uint256 amountDec = _amount * 10**(_decimals);
        require(amountDec != 0, "You cannot swap zero");
        // Check if contract has the requested token
        uint256 Balance = IERC20(_addressTokenB).balanceOf(address(this));
        require(_amount < Balance, "reserve too low for exchange");
        uint256 rate = priceTokenA * amountDec;
        uint256 exchange = rate / priceTokenB;
        // transfer the caller token A to the contract
        IERC20(_addressTokenA).transferFrom(_address, address(this), amountDec);
        // transfer the exact eqivalent token B to the caller
        IERC20(_addressTokenB).transfer(_address, exchange);
        success = true;
    }

    // addLiquidity add Tokens to contract for permissionless swap
    function addLiquidity(
        address _address,
        address _tokenAddress,
        uint256 amount
    ) public returns (bool success) {
        success = IERC20(_tokenAddress).transferFrom(
            _address,
            address(this),
            amount
        );

        require(success != true, "transfer not successful");
    }

    /// Check Balance of a particular token in the contract
    function checkTokenBalance(address _tokenAddress)
        external
        view
        returns (uint256 _Balance)
    {
        _Balance = IERC20(_tokenAddress).balanceOf(address(this));
    }
}
