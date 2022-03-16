// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IERC20} from "./IERC20.sol";

contract swapToken {
    uint8 ethDecimal;
    uint8 maticDecimal;
    int256 MaticPrice;
    int256 EthPrice;

    AggregatorV3Interface internal maticPriceFeed;
    AggregatorV3Interface internal ethPriceFeed;

    constructor() {
        maticPriceFeed = AggregatorV3Interface(
            0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
        );
        ethPriceFeed = AggregatorV3Interface(
            0x0715A7794a1dc8e42615F059dD6e406A6594651A
        );
    }

    function getLatestPrice() public {
        (
            ,
            int256 priceMatic, // int256 priceEth, /*uint80 roundID*/ /*uint startedAt*/
            ,
            ,

        ) = maticPriceFeed.latestRoundData();
        // ethPriceFeed.latestRoundData();
        maticDecimal = maticPriceFeed.decimals();
        // ethDecimal = ethPriceFeed.decimals();

        MaticPrice = priceMatic;
        // EthPrice = priceEth.touint256();
    }

    function swapMaticToEth(
        address _fromToken,
        address _toToken,
        uint256 _amountIn
    ) public returns (bool) {
        uint256 rate = uint256(MaticPrice) / maticDecimal;
        uint256 exchange = _amountIn * rate;
        require(
            IERC20(_toToken).balanceOf(address(this)) >= exchange,
            "insufficient funds"
        );
        require(
            IERC20(_fromToken).transferFrom(
                msg.sender,
                address(this),
                exchange
            ),
            "Error"
        );

        bool status = IERC20(_toToken).transferFrom(
            address(this),
            msg.sender,
            (exchange)
        );
        // require(status, "transaction failed");
        return status;
    }

    function swapEthtoMatic(
        address _fromToken,
        address _toToken,
        uint256 _amountIn
    ) public returns (bool) {
        uint256 rate = uint256(EthPrice) / ethDecimal;
        uint256 exchange = _amountIn * rate;
        require(
            IERC20(_toToken).balanceOf(address(this)) >= exchange,
            "insufficient funds"
        );
        require(
            IERC20(_fromToken).transferFrom(
                msg.sender,
                address(this),
                exchange
            ),
            "Error"
        );

        bool status = IERC20(_toToken).transferFrom(
            address(this),
            msg.sender,
            (exchange)
        );
        return status;
    }
}
