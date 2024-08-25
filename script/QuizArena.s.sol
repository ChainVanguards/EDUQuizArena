// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {QuizArena} from "../src/QuizArena.sol";

contract QuizArenaScript is Script {
    QuizArena public quizArena;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // Deploy the QuizArena contract with the address of the EDU token contract
        quizArena = new QuizArena(0xc2BC0B330D39F4380946a6bEAf951829B31FF887);

        vm.stopBroadcast();
    }
}
