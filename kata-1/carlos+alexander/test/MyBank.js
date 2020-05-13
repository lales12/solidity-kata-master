const MyBank = artifacts.require("MyBank");

contract('MyBank', accounts => {
    const owner = accounts[0];
    const payer = accounts[1];

    const invalidAmountMsg = "Invalid deposit amount";

    const mineOneBlock = async () => {
        await web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_mine',
            id: 123
        }, () => {
            console.log('mined');
        });
    }
    it("Deploy contract succesfylly", async () => {
        try {
            await MyBank.new();
            assert.ok('Contract deployed successfully');
        } catch {
            assert.fail('Deploy failed');
        }
    });

    it("Deploy contract and check deployed block", async () => {
        const contract = await MyBank.new();
        const transactionHash = contract.transactionHash;
        const transaction = await web3.eth.getTransaction(transactionHash);
        const contractBlockNumber = await contract.initialBlock();

        assert.equal(transaction.blockNumber, contractBlockNumber);
    })

    it('Add payment to contract', async() => {
        const contract = await MyBank.new();
        const valueToDeposit = web3.utils.toWei('0.0002');
        const initialBalanceValue = await web3.eth.getBalance(contract.address);

        assert(initialBalanceValue, 0);

        await contract.deposit({
            from: payer,
            value: valueToDeposit
        })

        const depositedBalanceValue = await web3.eth.getBalance(contract.address);

        assert.equal(depositedBalanceValue, valueToDeposit);

    });

    it('Pass invalid amount', async () => {
        const contract = await MyBank.new();
        const expectedAmount = 0;
        const valueToDeposit = web3.utils.toWei('0.0001');

        try {
            await contract.deposit({
                from: payer,
                value: valueToDeposit
            });

            asert.fail("You can't deposit this value");
        } catch (error) {
            assert.equal(error.reason, invalidAmountMsg);
        }
    });

    it('Pass invalid but greater than minimum', async () => {
        const contract = await MyBank.new();
        const valueToDeposit = web3.utils.toWei('0.0002');

        try {
            await mineOneBlock();

            await contract.deposit({
                from: payer,
                value: valueToDeposit
            }); 

            asert.fail("You can't deposit this value");
        } catch (error) {
            assert.equal(error.reason, invalidAmountMsg);
        }
    });

    it('Pass invalid but greater than minimum', async () => {
        const contract = await MyBank.new();
        const valueToDeposit = web3.utils.toWei('0.0004');

        await mineOneBlock();

        await contract.deposit({
            from: payer,
            value: valueToDeposit
        }); 

        const depositedBalanceValue = await web3.eth.getBalance(contract.address);

        assert.equal(depositedBalanceValue, valueToDeposit);
    });
})
