// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {QuizArena} from "../src/QuizArena.sol";
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract QuizArenaTest is Test {
    QuizArena public quizArena;
    ERC20 public eduToken;

    address user1 = address(0x1);
    address user2 = address(0x2);

    function setUp() public {
        // Assume that the eduToken is already deployed
        eduToken = new ERC20("EDU Token", "EDU");
        quizArena = new QuizArena(address(eduToken));

        // Mint tokens for users
        eduToken._mint(user1, 100000);
        eduToken._mint(user2, 100000);
    }

    function testQuizAttemptAndRewardDistribution() public {
        vm.startPrank(user1);
        eduToken.approve(address(quizArena), 1000);
        quizArena.attemptQuiz(100);
        vm.stopPrank();

        vm.startPrank(user2);
        eduToken.approve(address(quizArena), 1000);
        quizArena.attemptQuiz(200);
        vm.stopPrank();

        // Fast forward time to end of the month
        vm.warp(quizArena.getEndOfCurrentMonth());

        quizArena.distributeRewards();

        assertEq(eduToken.balanceOf(user1), 0); // User1 didn't get rewards
        assertGt(eduToken.balanceOf(user2), 100000); // User2 got rewards
    }
}
