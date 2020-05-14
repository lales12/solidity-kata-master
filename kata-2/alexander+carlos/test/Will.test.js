const Will = artifacts.require("Will");

contract("Will", accounts => {
  const FOUR_DAYS = 86400 * 4;

  const depositor = accounts[0];
  const withdrawer = accounts[1];

  const depositAmount = web3.utils.toWei("0.10");

  const expectedError = "3 days must pass before you can withdraw";

  const timeTravel = time => {
    web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [time],
      id: Date.now()
    }, (err, _) => {
      if (err)
        assert.fail("failed to pass time");
    });
  }

  it("contract is deployed correctly", async () => {
    const contract = await Will.new();
    assert.isOk(contract, "contract deployed");
  });

  it("fails to withdraw deposit before three days have passed since last ping", async () => {
    const contract = await Will.new();
    await contract.sendTransaction({ from: depositor, value: depositAmount });
    try {
      await contract.withdraw({ from: withdrawer });
    } catch (e) {
      assert.equal(e.reason, expectedError, "unexpected error");
    }
  });

  it("fails to withdraw deposit before three days have passed since last ping", async () => {
    const contract = await Will.new();
    await contract.sendTransaction({ from: depositor, value: depositAmount });
    timeTravel(FOUR_DAYS / 2);
    await contract.ping({ from: depositor });
    timeTravel(FOUR_DAYS / 2);
    try {
      await contract.withdraw({ from: withdrawer });
    } catch (e) {
      assert.equal(e.reason, expectedError, "unexpected error");
    }
  });

  it("withdraws funds successfully after 4 days have passed since last ping", async () => {
    const contract = await Will.new();
    await contract.sendTransaction({ from: depositor, value: depositAmount });
    timeTravel(FOUR_DAYS);
    try {
      const tx = await contract.withdraw({ from: withdrawer });
      assert.isOk(tx);
    } catch (e) {
      assert.fail();
    }
  });

  it("withdraws funds successfully after 4 days have passed since last ping", async () => {
    const contract = await Will.new();
    await contract.sendTransaction({ from: depositor, value: depositAmount });
    timeTravel(FOUR_DAYS / 2);
    await contract.ping({ from: depositor });
    timeTravel(FOUR_DAYS);
    try {
      const tx = await contract.withdraw({ from: withdrawer });
      assert.isOk(tx);
    } catch (e) {
      assert.fail();
    }
  });
});