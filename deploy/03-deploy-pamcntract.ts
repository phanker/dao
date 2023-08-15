import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import {
    Voting_Delay,
    Voting_Period,
    Votes_Quorum_Fraction,
} from "../helper-hardhat-config"
const deployPamContract: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    // IVotes _token,
    // TimelockController _timelock,
    // uint _votingDelay,
    // uint _votingPeriod,
    // uint _votesQuorumFraction

    const pamToken = await get("PamToken")
    const timeLock = await get("TimeLock")
    const args = [
        pamToken.address,
        timeLock.address,
        Voting_Delay,
        Voting_Period,
        Votes_Quorum_Fraction,
    ]
    await deploy("PamContract", {
        from: deployer,
        args: args,
        log: true,
        // waitConfirmations: 1,
    })

    log(`Deloyed PamContract.`)
}

export default deployPamContract
