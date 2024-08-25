// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract QuizArena {
    ERC20 public eduToken;
    address public poolAddress = 0x51cbC462C24616EE85b43A657B304166dE0Dc7cC;
    uint256 public totalAttempts;
    uint256 public totalPool;

    struct User {
        uint256 score;
        uint256 lastAttemptTimestamp;
    }

    mapping(address => User) public users;
    address[] public userAddresses;

    event QuizAttempted(address indexed user, uint256 score);
    event RewardsDistributed(uint256 totalRewards, uint256 x);

    constructor(address _eduTokenAddress) {
        eduToken = ERC20(_eduTokenAddress);
    }

    function attemptQuiz(uint256 _score) public {
        require(block.timestamp >= getStartOfCurrentMonth(), "Tournament hasn't started yet");
        require(block.timestamp < getEndOfCurrentMonth(), "Tournament has ended");

        User storage user = users[msg.sender];
        if (user.lastAttemptTimestamp == 0) {
            userAddresses.push(msg.sender);
        }

        user.score += _score;
        user.lastAttemptTimestamp = block.timestamp;

        totalAttempts++;
        totalPool += 1000; // Assuming each quiz attempt contributes 1000 EDU to the pool

        eduToken.transferFrom(msg.sender, poolAddress, 1000);

        emit QuizAttempted(msg.sender, _score);
    }

    function distributeRewards() public {
        require(block.timestamp >= getEndOfCurrentMonth(), "It's not the end of the month yet");

        uint256 x = totalAttempts / 25;
        uint256 y = totalPool / 2 / x;

        // Get top users based on score
        address[] memory topUsers = getTopUsers(x);

        for (uint256 i = 0; i < x; i++) {
            eduToken.transferFrom(poolAddress, topUsers[i], y);
        }

        emit RewardsDistributed(y * x, x);

        // Reset the state for the next month
        resetMonthlyState();
    }

    function getTopUsers(uint256 x) internal view returns (address[] memory) {
        address[] memory topUsers = new address[](x);
        uint256[] memory topScores = new uint256[](x);

        for (uint256 i = 0; i < userAddresses.length; i++) {
            uint256 userScore = users[userAddresses[i]].score;

            for (uint256 j = 0; j < x; j++) {
                if (userScore > topScores[j]) {
                    for (uint256 k = x - 1; k > j; k--) {
                        topScores[k] = topScores[k - 1];
                        topUsers[k] = topUsers[k - 1];
                    }
                    topScores[j] = userScore;
                    topUsers[j] = userAddresses[i];
                    break;
                }
            }
        }

        return topUsers;
    }

    function resetMonthlyState() internal {
        totalAttempts = 0;
        totalPool = 0;
        for (uint256 i = 0; i < userAddresses.length; i++) {
            users[userAddresses[i]].score = 0;
        }
    }

    function getStartOfCurrentMonth() public view returns (uint256) {
        return (block.timestamp / 30 days) * 30 days;
    }

    function getEndOfCurrentMonth() public view returns (uint256) {
        return ((block.timestamp / 30 days) + 1) * 30 days;
    }
}
