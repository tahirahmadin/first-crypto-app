// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SleepToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 100000000 * 10 ** 18;
    uint256 public constant MAX_CLAIM_AMOUNT = 100 * 10 ** 18;
    uint256 public constant MAX_CLAIM_FREQUENCY = 5;
    uint256 public balance = MAX_SUPPLY;

    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public claimCount;

    constructor() ERC20("SLEEP Test", "SLEEPT") {
        _mint(address(this), MAX_SUPPLY);
    }

    function claimFaucet() external {
        require(
            claimCount[msg.sender] < MAX_CLAIM_FREQUENCY,
            "Claim limit exceeded"
        );
        require(balanceOf(address(this)) >= MAX_CLAIM_AMOUNT, "Faucet empty");
        require(
            block.timestamp - lastClaimTime[msg.sender] >= 1 days,
            "Wait 24 hours before claiming again"
        );

        _transfer(address(this), msg.sender, MAX_CLAIM_AMOUNT);
        balance -= MAX_CLAIM_AMOUNT;
        lastClaimTime[msg.sender] = block.timestamp;
        claimCount[msg.sender]++;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }

    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        return super.approve(spender, amount);
    }

    function allowance(
        address owner,
        address spender
    ) public view override returns (uint256) {
        return super.allowance(owner, spender);
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }

    function mint(uint256 amount) public onlyOwner {
        require(
            amount <= balance,
            "Amount should be less than balance in contract"
        );

        _transfer(address(this), msg.sender, amount);
        balance -= amount;
    }
}
