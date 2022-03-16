import { ethers, network } from "hardhat";

async function main() {
  const contract = await ethers.getContractFactory("swapToken");
  const contractDeploy = await contract.deploy();
  await contractDeploy.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
