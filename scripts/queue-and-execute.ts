import { ethers, network } from "hardhat"
import { PamContract, Box } from "../typechain-types"
import {
    developmentChains,
    Voting_Period,
    PROPOSAL_DATA,
    FUNC,
    PROPOSE_DESCRIPTION,
    NEW_STORE_VALUE,
    MIN_DELAY,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTimes } from "../utils/move-times"

const queueAndExecute = async () => {
    const box: Box = await ethers.getContract("Box")

    const encodeFunctionData = //@ts-ignore
        box.interface.encodeFunctionData(FUNC, [NEW_STORE_VALUE])
    //hash description信息
    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(PROPOSE_DESCRIPTION)
    )

    const pamContract: PamContract = await ethers.getContract("PamContract")
    //将提案放入队列，以便日后执行
    const queueTx = await pamContract.queue(
        [box.address],
        [0],
        [encodeFunctionData],
        descriptionHash
    )
    await queueTx.wait(1)

    if (developmentChains.includes(network.name)) {
        //如果是本地网络，移动区块和时间
        await moveTimes(MIN_DELAY + 1)
        await moveBlocks(1)
    }

    //执行提案
    const executeTx = await pamContract.execute(
        [box.address],
        [0],
        [encodeFunctionData],
        descriptionHash
    )
    executeTx.wait(1)
    console.log("Executed Proposal.")
    //验证提案是否成功执行
    console.log(
        `Verify that the proposal is into force ,retrived value in the box is ${await box.retrieve()}`
    )
}

queueAndExecute()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
