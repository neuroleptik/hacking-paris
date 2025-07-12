// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract BasicMultiFanTokenStaking is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Mapping des tokens autorisés ($PSG, $JUV, etc.)
    mapping(address => bool) public allowedTokens;
    // Stakes par utilisateur et par token
    mapping(address => mapping(address => uint256)) public stakes;
    // Total staké par token
    mapping(address => uint256) public totalStakedByToken;
    // Total staké tous tokens
    uint256 public totalStakedAllTokens;
    // Timestamp des stakes
    mapping(address => mapping(address => uint256)) public stakeTimestamps;
    // Période de verrouillage
    uint256 public constant LOCK_PERIOD = 30 days;
    // Limite de tokens pour optimisation
    uint256 public constant MAX_TOKENS = 50;
    // Liste des tokens autorisés
    address[] public tokenList;

    // Événements
    event TokenAdded(address indexed token);
    event Staked(address indexed user, address indexed token, uint256 amount);
    event Unstaked(address indexed user, address indexed token, uint256 amount);

    constructor() Ownable(msg.sender) {}

    // Ajouter un fan token
    function addToken(address token) external onlyOwner whenNotPaused {
        require(token != address(0), "Invalid token");
        require(!allowedTokens[token], "Token already added");
        require(tokenList.length < MAX_TOKENS, "Max tokens reached");
        require(IERC20(token).totalSupply() > 0, "Invalid ERC-20");
        allowedTokens[token] = true;
        tokenList.push(token);
        emit TokenAdded(token);
    }

    // Staker un fan token
    function stake(address token, uint256 amount) external nonReentrant whenNotPaused {
        require(allowedTokens[token], "Token not supported");
        require(amount > 0, "Amount > 0");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        stakes[msg.sender][token] += amount;
        totalStakedByToken[token] += amount;
        totalStakedAllTokens += amount;
        stakeTimestamps[msg.sender][token] = block.timestamp;
        emit Staked(msg.sender, token, amount);
    }

    // Retirer un fan token
    function unstake(address token, uint256 amount) external nonReentrant whenNotPaused {
        require(stakes[msg.sender][token] >= amount, "Insufficient stake");
        require(block.timestamp >= stakeTimestamps[msg.sender][token] + LOCK_PERIOD, "Lock period not expired");

        stakes[msg.sender][token] -= amount;
        totalStakedByToken[token] -= amount;
        totalStakedAllTokens -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);
        emit Unstaked(msg.sender, token, amount);
    }

    // Consulter le total staké par token
    function getTotalStakedByToken(address token) external view returns (uint256) {
        return totalStakedByToken[token];
    }

    // Consulter le total staké tous tokens
    function getTotalStakedAllTokens() external view returns (uint256) {
        return totalStakedAllTokens;
    }

    // Consulter le stake d’un utilisateur
    function getUserStake(address user, address token) external view returns (uint256) {
        return stakes[user][token];
    }

    // Pause/unpause le contrat
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
