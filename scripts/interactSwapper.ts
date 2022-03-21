import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";

async function interactSwap() {
  const swapperAddress: string = "0xb334795bf50e4943d076Dfb38D8C1A50F9F5a101";
  const chainLinkHolder: string = "0x59eCf48345A221E0731E785ED79eD40d0A94E2A5";
  const USDCHolder: string = "0x21Cb017B40abE17B6DFb9Ba64A3Ab0f24A7e60EA";
  // Contract addresses
  const USDCAddress: string = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const LinkAddress: string = "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39";

  const contract = await ethers.getContractAt("swapToken", swapperAddress);

  await contract.getLatestPriceA();
  await contract.getLatestPriceB();
  console.log(await contract.priceTokenAUSDC());
  console.log(await contract.priceTokenBLink());

  /////////////////////////////////////////////
  // Link Impersonation
  //@ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [chainLinkHolder],
  });

  const signer = await ethers.getSigner(chainLinkHolder);
  //   console.log("impersonation success");

  const approveLink = await ethers.getContractAt("IERC20", LinkAddress);
  await approveLink.connect(signer);
  //     .transfer(swapperAddress, "500000000000000000");
  //   console.log("successfully transfer Link to the contract");

  const LinkBal = await approveLink.balanceOf(swapperAddress);
  console.log("Balance of Link Token:", LinkBal);

  //////////////////////////////////////
  // USDC Impersonation
  //@ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [USDCHolder],
  });

  const signerUSDC = await ethers.getSigner(USDCHolder);
  //   console.log("impersonation success");

  const getUSDC = await ethers.getContractAt("IERC20", USDCAddress);
  //   await getUSDC.connect(signerUSDC).transfer(swapperAddress, "100000000");
  //   console.log("successfully transfer USDC to the contract");

  const USDCBal = await getUSDC.balanceOf(swapperAddress);
  console.log("Balance of USDC Token:", USDCBal);

  ///////////////////////////////////////////////////
  // SWAPPING
  //   const oldBal = await approveLink.connect(signerUSDC).balanceOf(USDCHolder);
  //   console.log("old balance of USDC holder LINK account:", oldBal);
  //   //   await getUSDC.connect(signerUSDC).approve(swapperAddress, "200000000");
  //   console.log(await getUSDC.allowance(USDCAddress, swapperAddress));
  //   await contract.connect(signerUSDC).swapAUSDCtoBLink(USDCHolder, 1000);

  //   const newBal = await approveLink.connect(signerUSDC).balanceOf(USDCHolder);
  //   console.log("balance after exchange of USDC to Link", newBal);

  /////////////
  // Swapping link to usdc
  //   const oldBal = await approveLink.connect(signerUSDC).balanceOf(USDCHolder);
  //   console.log("old balance of USDC holder LINK account:", oldBal);
  //   await getUSDC.connect(signerUSDC).approve(swapperAddress, "200000000");
  //   console.log(await getUSDC.allowance(USDCAddress, swapperAddress));
  await contract.connect(signerUSDC).swapAUSDCtoBLink(USDCHolder, 1000);

  const newBal = await approveLink.connect(signerUSDC).balanceOf(USDCHolder);
  console.log("balance after exchange of USDC to Link", newBal);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
interactSwap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
