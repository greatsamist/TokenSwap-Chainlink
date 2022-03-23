import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";

async function interactSwap() {
  /////////////////////////////////
  //// MAINNET FORKING USING HARDHAT
  // Deployed contract address
  const swapperAddress: string = "0xf2F7Ee6206c10dD1f0e57038FD6C21ACAB9E09E9";
  //////////////////////
  // Holders account to impersonate
  const AaveHolder: string = "0x6A7c6689b24515bc9983360Dfb8E6Ed7891ac7Cf";
  const chainLinkHolder: string = "0x10d26032e448aed045e0628929ea2b6068aa7b5f";
  const InchHolder: string = "0xCD50DB84dea39bA513561cC8f7030D80b5595CF1";

  //// Contract addresses
  const LinkAddress: string = "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39";
  const AaveAddress: string = "0xD6DF932A45C0f255f85145f286eA0b292B21C90B";
  const IinchAddress: string = "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f";
  //////////////////////////////////
  /// Price Checker Address: Chainlink price feed
  const aavePrice: string = "0x72484B12719E23115761D5DA1646945632979bB6";
  const LinkPrice: string = "0xd9FFdb71EbE7496cC440152d43986Aae0AB76665";
  const IinchPrice: string = "0x443C5116CdF663Eb387e72C688D276e702135C87";

  ///////////////////////
  const contract = await ethers.getContractAt("swapToken", swapperAddress);

  console.log(await contract.getLatestPrice(LinkPrice, aavePrice));

  ///////////////////////////////////
  // Impersonation function
  async function prank(address: string) {
    // @ts-ignore
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [address],
    });
  }

  //   ///////////////////////////////////////
  // Link Impersonation
  prank(chainLinkHolder);
  const signerLink = await ethers.getSigner(chainLinkHolder);
  prank(InchHolder);
  const signerIinch = await ethers.getSigner(InchHolder);
  prank(AaveHolder);
  const signerAave = await ethers.getSigner(AaveHolder);

  //   ///////////////////////////////////////
  // Interacting with Link Token (adding liquidity)
  const getLink = await ethers.getContractAt("IERC20", LinkAddress);
  ////// Method 1: using IERC20 transfer function
  //   await getLink
  //     .connect(signerLink)
  //     .transfer(swapperAddress, "10000000000000000000");
  //   console.log("successfully transfer Link to the contract");
  ////// Method 2: using my contract function and getting approval
  await getLink
    .connect(signerLink)
    .approve(swapperAddress, "20000000000000000000");
  await contract
    .connect(signerLink)
    .addLiquidity(chainLinkHolder, LinkAddress, "20000000000000000000");
  const LinkContractBalS = await contract.checkTokenBalance(LinkAddress);
  console.log(
    "Contract Balance of Link Token:",
    Math.floor(Number(LinkContractBalS) / Math.pow(10, 18))
  );
  //   //   //   ///////////////////////////////////////////////
  //   // Interacting with 1Inch
  const getIinch = await ethers.getContractAt("IERC20", IinchAddress);
  //   await getIinch
  //     .connect(signerIinch)
  //     .transfer(swapperAddress, "100000000000000000000");
  //   console.log("successfully transfer Inch to the contract");
  //   const IinchContractBal = await getIinch.balanceOf(swapperAddress);
  //   console.log(
  //     "Balance of Inch Token:",
  //     Math.floor(Number(IinchContractBal) / Math.pow(10, 18))
  //   );
  // /////////////////////
  // Interacting with Aave(adding liquidity)
  const getAave = await ethers.getContractAt("IERC20", AaveAddress);
  await getAave
    .connect(signerAave)
    .transfer(swapperAddress, "20000000000000000000");
  console.log("successfully transfer Aave to the contract");
  const AaveContractBalS = await getAave.balanceOf(swapperAddress);
  console.log(
    "Contract Balance of Aave Token:",
    Math.floor(Number(AaveContractBalS) / Math.pow(10, 18))
  );
  //   console.log("Balance of Aave Token:", aaveContractBal);

  //   ///////////////////////////////////////////////////
  /////////////// SWAPPING
  //// Swapping Aave to Link
  const AaveBal = await getAave.balanceOf(chainLinkHolder);
  const LinkBal = await getLink.balanceOf(chainLinkHolder);
  console.log("old Aave bal", Math.floor(Number(AaveBal) / Math.pow(10, 18)));
  console.log("old LINK bal", Math.floor(Number(LinkBal) / Math.pow(10, 18)));

  await getAave
    .connect(signerLink)
    .approve(swapperAddress, "2000000000000000000");

  await contract
    .connect(signerLink)
    .swapTokenAtoB(
      chainLinkHolder,
      2,
      18,
      AaveAddress,
      LinkAddress,
      aavePrice,
      LinkPrice
    );

  console.log("After successful swapping");
  const NewAaveBal = await getAave.balanceOf(chainLinkHolder);
  const NewLinkBal = await getLink.balanceOf(chainLinkHolder);
  console.log(
    "Holder New Aave bal",
    Math.floor(Number(NewAaveBal) / Math.pow(10, 18))
  );
  console.log(
    "Holder New LINK bal",
    Math.floor(Number(NewLinkBal) / Math.pow(10, 18))
  );

  const LinkContractBal = await getLink.balanceOf(swapperAddress);
  console.log(
    "Contract Balance of Link Token:",
    Math.floor(Number(LinkContractBal) / Math.pow(10, 18))
  );

  const AaveContractBal = await getAave.balanceOf(swapperAddress);
  console.log(
    "Contract Balance of Aave Token:",
    Math.floor(Number(AaveContractBal) / Math.pow(10, 18))
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
interactSwap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
