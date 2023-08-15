import { ethers, network } from "hardhat"
import { Box, PamContract } from "../typechain-types"
import {
    developmentChains,
    NEW_STORE_VALUE,
    FUNC,
    PROPOSE_DESCRIPTION,
    Voting_Delay,
    PROPOSAL_DATA,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import * as fs from "fs"

const propose = async (functionToCall: string, arg: any[]) => {
    const pamContract: PamContract = await ethers.getContract("PamContract")
    const box: Box = await ethers.getContract("Box")
    // encode方法名+参数
    //@ts-ignore
    const functionData = box.interface.encodeFunctionData(functionToCall, arg)
    console.log(`${functionData}`)

    //创建提案交易
    const proposeTx = await pamContract.propose(
        [box.address],
        [0],
        [functionData],
        PROPOSE_DESCRIPTION
    )
    const proposeReceipt = await proposeTx.wait(1)

    //在本地环境可以将移动当前区块
    if (developmentChains.includes(network.name)) {
        await moveBlocks(Voting_Delay + 1)
    }

    //获取proposalId
    //@ts-ignore
    const proposalId = proposeReceipt.events[0]?.args?.proposalId
    let proposals = JSON.parse(fs.readFileSync(PROPOSAL_DATA, "utf8"))
    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(PROPOSAL_DATA, JSON.stringify(proposals))
}

propose(FUNC, [NEW_STORE_VALUE])
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
