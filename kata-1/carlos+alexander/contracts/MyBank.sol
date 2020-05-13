pragma solidity <0.6.0;

contract MyBank {
    uint256 public initialBlock;
    uint256 constant minWeiDeposit = 200000000000000; // 0.0002 eth

    mapping(address => uint256) public depositorBalances;

    modifier minDepositAmount() {
        uint256 requiredAmount = (block.number - initialBlock) * minWeiDeposit;
        require(msg.value >= requiredAmount, "Deposit is too little");
        _;
    }

    modifier hasBalance() {
        require(depositorBalances[msg.sender] > 0, "User has no balance");
        _;
    }

    constructor()
        public
    {
        initialBlock = block.number;
    }

    function deposit()
        public
        payable
        minDepositAmount
    {
        uint256 userBalance = depositorBalances[msg.sender];
        depositorBalances[msg.sender] = msg.value + userBalance;
    }

    function withdraw()
        public
        hasBalance
    {
        uint256 userBalance = depositorBalances[msg.sender];
        depositorBalances[msg.sender] = 0;
        msg.sender.transfer(userBalance);
    }
}
