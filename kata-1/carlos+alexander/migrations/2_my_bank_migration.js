const MyBank = artifacts.require("MyBank");

module.exports = function(deployer) {
  deployer.deploy(MyBank);
};
