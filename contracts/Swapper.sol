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
        returns (uint256 priceTokenA, uint256 priceTokenB)
    {
        (, int256 PriceA, , , ) = AggregatorV3Interface(_TokenA)
            .latestRoundData();
        (, int256 PriceB, , , ) = AggregatorV3Interface(_TokenB)
            .latestRoundData();

        priceTokenA = uint256(PriceA);
        priceTokenB = uint256(PriceB);
    }

    /* To swwap, I need to divide the price of tokenA with tokenB and multiply by the decimal */
    function swapTokenAtoB(
        address _address,
        uint256 _amount,
        address _addressTokenA,
        address _addressTokenB,
        uint8 _decimals
    ) public returns (bool success) {
        (uint256 priceTokenA, uint256 priceTokenB) = getLatestPrice(
            _addressTokenA,
            _addressTokenB
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
        // uint256 dec = rate * decimalsTokenAUSDC;
        IERC20(_addressTokenA).transferFrom(_address, address(this), amountDec);
        IERC20(_addressTokenB).transfer(_address, exchange);
        success = true;
    }

    function checkTokenBalance(address _tokenAddress)
        external
        view
        returns (uint256 _Balance)
    {
        _Balance = IERC20(_tokenAddress).balanceOf(address(this));
    }
}
