import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";

async function interactSwap() {
  ////////////////////////
  // Deployed contract address
  const swapperAddress: string = "0x8aA3AE13495fc5CAc14D8f1b849520797168996e";
  //////////////////////
  // Holders account to impersonate
  const aaveHolder: string = "0x6A7c6689b24515bc9983360Dfb8E6Ed7891ac7Cf";
  const chainLinkHolder: string = "0x10d26032e448aed045e0628929ea2b6068aa7b5f";

  //// Contract addresses
  const LinkAddress: string = "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39";
  const aaveAddress: string = "0xD6DF932A45C0f255f85145f286eA0b292B21C90B";
  //////////////////////////////////
  /// Price Checker Address: Chainlink price feed
  const aavePrice: string = "0x72484B12719E23115761D5DA1646945632979bB6";
  const LinkPrice: string = "0xd9FFdb71EbE7496cC440152d43986Aae0AB76665";

  ///////////////////////
  const contract = await ethers.getContractAt("swapToken", swapperAddress);

  console.log(await contract.getLatestPrice(aavePrice, LinkPrice));

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
  prank(aaveHolder);
  const signerAave = await ethers.getSigner(aaveHolder);

  //   ///////////////////////////////////////
  // Interacting with Link Token
  const getLink = await ethers.getContractAt("IERC20", LinkAddress);
  //   await getLink
  //     .connect(signerLink)
  //     .transfer(swapperAddress, "10000000000000000000");
  //   console.log("successfully transfer Link to the contract");
  //   const LinkContractBal = await getLink.balanceOf(swapperAddress);
  //   console.log(
  //     "Balance of Link Token:",
  //     Math.floor(Number(LinkContractBal) / Math.pow(10, 18))
  //   );
  //   //   ///////////////////////////////////////////////
  //   // Interacting with Aave
  const getAave = await ethers.getContractAt("IERC20", aaveAddress);
  //   await getAave
  //     .connect(signerAave)
  //     .transfer(swapperAddress, "10000000000000000000");
  //   console.log("successfully transfer Matic to the contract");
  //   const aaveContractBal = await getAave.balanceOf(swapperAddress);
  //   console.log(
  //     "Balance of Aave Token:",
  //     Math.floor(Number(aaveContractBal) / Math.pow(10, 18))
  //   );

  //   console.log("Balance of Aave Token:", aaveContractBal);

  //   const LinkBal = await getLink.balanceOf(chainLinkHolder);
  //   console.log("Balance of Link Token:", LinkBal);
  //   console.log(Math.floor(Number(LinkBal) / Math.pow(10, 18)));

  //   ///////////////////////////////////////////////////
  // SWAPPING
  const oldBal = await getAave.balanceOf(aaveHolder);
  //
  await getAave.connect(signerAave).allowance(aaveHolder, swapperAddress);
  await getAave
    .connect(signerAave)
    .approve(swapperAddress, "5000000000000000000");
  console.log("old balance of aave account:", oldBal);
  await contract
    .connect(signerAave)
    .swapTokenAtoB(aaveHolder, 1, aaveAddress, LinkAddress, 18);
  //   await getLink.allowance(chainLinkHolder, swapperAddress);
  //   await contract.connect(signerLink).swapTokenAtoB(chainLinkHolder, 1000);

  const newBal = await getAave.connect(signerAave).balanceOf(aaveHolder);
  console.log("balance after exchange of Link to aave", newBal);

  //   /////////////
  //   // Swapping link to usdc
  //   console.log("old USDC bal", Math.floor(Number(USDCBal) / Math.pow(10, 6)));
  //   console.log("old LINK bal", Math.floor(Number(LinkBal) / Math.pow(10, 18)));

  //   await approveLink
  //     .connect(signer)
  //     .approve(swapperAddress, "2000000000000000000000");
  //   console.log(await approveLink.allowance(LinkAddress, swapperAddress));
  //   await contract
  //     .connect(signerUSDC)
  //     .swapAUSDCtoBLink(chainLinkHolder, "1000000");

  //   console.log("New USDC bal", Math.floor(Number(USDCBal) / Math.pow(10, 6)));
  //   console.log("New LINK bal", Math.floor(Number(LinkBal) / Math.pow(10, 18)));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
interactSwap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
