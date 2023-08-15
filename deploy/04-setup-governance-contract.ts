import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { ethers } from "hardhat"
import { TimeLock, PamContract } from "../typechain-types"
import {} from "../helper-hardhat-config"
const setUpGovenanceContract: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { getNamedAccounts, deployments } = hre
    const { log } = deployments
    const { deployer } = await getNamedAccounts()
    const timeLock: TimeLock = await ethers.getContract("TimeLock", deployer)
    const pamContract: PamContract = await ethers.getContract(
        "PamContract",
        deployer
    )
    //提议角色
    const proposerRole = await timeLock.PROPOSER_ROLE()

    //执行角色
    const executorRole = await timeLock.EXECUTOR_ROLE()

    //时间管理角色
    const timeLockAdminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    log(`Setting up governance contract.`)
    //授予pamContract合同提议角色权益
    const proposerTx = await timeLock.grantRole(
        proposerRole,
        pamContract.address
    )
    await proposerTx.wait(1)
    //授予所有人执行角色 ，传0地址就表示授予所有人。一旦，locktime时间过了，所有人就可以执行
    const executorTx = await timeLock.grantRole(
        executorRole,
        ethers.constants.AddressZero
    )
    await executorTx.wait(1)
    //撤销部署人的timeLockAdminRole角色权限
    const timeLockAdminRoleTx = await timeLock.revokeRole(
        timeLockAdminRole,
        deployer
    )
    await timeLockAdminRoleTx.wait(1)
    log(`Setted up governance contract.`)
}

export default setUpGovenanceContract
