import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { ethers } from "hardhat"
import { PamToken } from "../typechain-types"
const deployPamToken: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const pamToken = await deploy("PamToken", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1,
    })
    log(`Deloyed PamToken.`)
    await delegate(pamToken.address, deployer)
    log("Delegate.")
}

const delegate = async (pamTokenAddress: string, delegateAddress: string) => {
    const pamToken: PamToken = await ethers.getContractAt(
        "PamToken",
        pamTokenAddress
    )

    const tx = await pamToken.delegate(delegateAddress)
    tx.wait(1)
    console.log(
        `checkPoints :${await pamToken.numCheckpoints(delegateAddress)}`
    )
}

export default deployPamToken
