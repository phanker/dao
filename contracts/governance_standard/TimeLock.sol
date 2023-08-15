// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    //minDelay  最小延迟时间，提案通过后，可执行时间。从提案通过后到最后一个区块之间的间隔时间
    //proposers 提出提案的人
    //executors 当提案通过后，执行提案的人
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
