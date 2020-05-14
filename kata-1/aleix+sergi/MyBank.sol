pragma solidity >=0.4.22 <0.6.0;
import './SafeMath.sol';

// método deposit() que permite depositar ethers, cantidad mínima que se puede 
// depositar: 0.0002 ethers por bloque desde la creación del contrato
contract MyBank {
    
    using SafeMath for uint;
    
    address payable owner;
    uint blockCreation;

    constructor() public {
        owner = msg.sender;
        blockCreation = block.number;
    }
    
    modifier minEthers () {
        require(msg.value >= block.number
                            .sub(blockCreation)
                            .mul(uint(0.0002 ether)));
        _;
    }
    
    function deposit() public payable minEthers {
        owner.transfer(msg.value);
    }
}