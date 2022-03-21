// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/* A contract that accepts token A and swap it with token B permissionlesssly
 */

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IERC20} from "./IERC20.sol";

contract swapToken {
    uint256 public priceTokenAUSDC;
    uint256 public priceTokenBLink;
    // uint8 public decimalsTokenAMatic;
    // uint8 public decimalsTokenBLink;
    address tokenAUSDC = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address tokenBLink = 0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39;

    // MaticChainlink = 0x327e23A4855b6F663a28c5161541d69Af8973302;
    // linkChainlink = 0xb77fa460604b9C6435A235D057F7D319AC83cb53;

    AggregatorV3Interface internal TokenAUSDC;
    AggregatorV3Interface internal TokenBLink;

    constructor() /*address _TokenA, address _TokenB*/
    {
        TokenAUSDC = AggregatorV3Interface(
            0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7
        );
        TokenBLink = AggregatorV3Interface(
            0xd9FFdb71EbE7496cC440152d43986Aae0AB76665
        );
    }

    /**
     * Returns the latest price
     */
    function getLatestPriceA() public {
        (
            ,
            /*uint80 roundID*/
            int256 price, /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/
            ,
            ,

        ) = TokenAUSDC.latestRoundData();
        priceTokenAUSDC = uint256(price);
        // decimalsTokenAUSDC = TokenAUSDC.decimals();
    }

    function getLatestPriceB() public {
        (
            ,
            /*uint80 roundID*/
            int256 price, /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/
            ,
            ,

        ) = TokenBLink.latestRoundData();
        priceTokenBLink = uint256(price);
        // decimalsTokenBLink = TokenBLink.decimals();
    }

    /* To swwap, I need to divide the price of tokenA with tokenB and multiply by the decimal */
    function swapAUSDCtoBLink(address _address, uint256 _amount)
        public
        returns (bool success)
    {
        getLatestPriceA();
        getLatestPriceB();
        require(_amount != 0, "You cannot swap zero");
        // Check if contract has link
        uint256 Balance = IERC20(tokenBLink).balanceOf(address(this));
        require(_amount < Balance, "reserve too low for exchange");
        uint256 rate = priceTokenAUSDC * _amount;
        uint256 exchange = rate / priceTokenBLink;
        // uint256 dec = rate * decimalsTokenAUSDC;
        IERC20(tokenAUSDC).transferFrom(_address, address(this), _amount);
        IERC20(tokenBLink).transfer(_address, exchange);
        success = true;
    }

    function swapBLinktoAUSDC(address _address, uint256 _amount)
        public
        returns (bool success)
    {
        getLatestPriceA();
        getLatestPriceB();
        require(_amount != 0, "You cannot swap zero");
        // Check if contract has link
        uint256 Balance = IERC20(tokenAUSDC).balanceOf(address(this));
        require(_amount < Balance, "reserve too low for exchange");
        uint256 rate = priceTokenBLink * _amount;
        uint256 exchange = rate / priceTokenBLink;
        IERC20(tokenBLink).transferFrom(_address, address(this), _amount);
        IERC20(tokenAUSDC).transfer(_address, _amount * exchange);
        success = true;
    }

    // function addLiquidity(address _tokenAddress, uint256 _amount)
    //     public
    //     returns (uint256 newBalance)
    // {
    //     IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);
    //     newBalance = IERC20(_tokenAddress).balanceOf(address(this));
    // }

    function checkTokenBalance(address _tokenAddress)
        external
        view
        returns (uint256 _Balance)
    {
        _Balance = IERC20(_tokenAddress).balanceOf(address(this));
    }
}
