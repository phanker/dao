import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { ethers } from "hardhat"
import { Box } from "../typechain-types"
const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deployer } = await getNamedAccounts()
    const { deploy, log, get } = deployments
    const timeLock = await get("TimeLock")

    log(`Deploying Box.`)
    const boxContract = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1,
    })
    const box: Box = await ethers.getContractAt("Box", boxContract.address)
    const tx = await box.transferOwnership(timeLock.address)
    await tx.wait(1)

    log(`Deployed Box.`)
    log(`TransferOwnership finished.`)
}

export default deployBox
