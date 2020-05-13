// Luca y Adrian
pragma solidity >=0.4.22 <0.6.0;

contract MyBank{
    
    address payable public owner;
    uint256 public creation_block;
    uint256 minimumAmount = 0.0002 ether;
    
    constructor() public payable {
        owner = msg.sender;
        creation_block = block.number; // now
    } 

    function deposit()  public payable {
        uint256  block_difference;
        block_difference= block.number - creation_block;
        require(msg.value >= (minimumAmount)*block_difference);
    }
        
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    function withdraw() public isOwner {
        owner.transfer(address(this).balance);
    }
}
