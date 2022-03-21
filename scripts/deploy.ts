import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function swap() {
  const contract = await ethers.getContractFactory("swapToken");
  const contractDeploy = await contract.deploy();
  await contractDeploy.deployed();

  console.log("Contract Deploy at", contractDeploy.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
swap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
