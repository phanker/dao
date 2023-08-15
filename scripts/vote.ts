import { ethers, network } from "hardhat"
import { PamContract } from "../typechain-types"
import {
    developmentChains,
    Voting_Period,
    PROPOSAL_DATA,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import * as fs from "fs"

const index = 0
const vote = async (index: number) => {
    const proposalId = JSON.parse(fs.readFileSync(PROPOSAL_DATA, "utf8"))[
        network.config.chainId!.toString()
    ][index]
    console.log(`proposalId:${proposalId}`)
    /**
     * 投票枚举
     * 0.反对
     * 1.赞成
     * 3.期权
     */
    const voteMode = 1
    const pamContract: PamContract = await ethers.getContract("PamContract")

    //开始投票
    const reason = "It's no reason,I just want to do it!"
    const voteTx = await pamContract.castVoteWithReason(
        proposalId,
        voteMode,
        reason
    )
    await voteTx.wait(1)
    if (developmentChains.includes(network.name)) {
        await moveBlocks(Voting_Period + 1)
    }
    console.log("Finished Voting!")
    //查询proposal的状态
    const stateResult = await pamContract.state(proposalId)
    console.log(`The state of proposal is ${stateResult} .`)
}

vote(index)
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
