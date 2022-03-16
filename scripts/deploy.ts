import { ethers, network } from "hardhat";

const USDTHolder = "0xf7b2f3cd946052f8b397f801299b80f053515af9";
const MATICHolder = ;

async function swap() {
  const contract = await ethers.getContractFactory("swapToken");
  const contractDeploy = await contract.deploy();
  await contractDeploy.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
swap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
