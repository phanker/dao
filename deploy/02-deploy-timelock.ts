import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { MIN_DELAY } from "../helper-hardhat-config"
const deployTimeLock: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [MIN_DELAY, [], [], deployer]
    await deploy("TimeLock", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1,
    })

    log(`Deloyed TimeLock.`)
}

export default deployTimeLock
