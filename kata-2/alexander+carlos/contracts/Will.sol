pragma solidity >=0.5.16;

import "./SafeMath.sol";


contract Will {
    using SafeMath for uint256;

    address public owner;

    uint256 public lastPing;
    uint256 constant SECONDS_IN_DAY = 86400;
    uint256 constant LOCK_SPAN_IN_DAYS = 3;

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can ping contract");
        _;
    }

    modifier restrictedWithdraw() {
        uint256 elapsedTime = (block.timestamp).sub(lastPing);

        require(
            elapsedTime > LOCK_SPAN_IN_DAYS.mul(SECONDS_IN_DAY),
            "3 days must pass before you can withdraw"
        );
        _;
    }

    constructor() public payable {
        owner = msg.sender;
        lastPing = block.timestamp;
    }

    function ping() public onlyOwner {
        lastPing = block.timestamp;
    }

    function withdraw() public restrictedWithdraw {
        uint256 contractBalance = address(this).balance;

        msg.sender.transfer(contractBalance);
    }

    function() external payable {}
}
