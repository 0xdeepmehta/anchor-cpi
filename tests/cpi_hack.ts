import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import * as assert from 'assert';
import { Puppet } from '../target/types/puppet';
import { PuppetMaster } from '../target/types/puppet_master';


describe("cpi-hack", () => {
    const provider = anchor.Provider.env();
    anchor.setProvider(provider);

    it('Perform CpiHack from puppet master to puppet', async () => {

        const puppet = anchor.workspace.Puppet as Program<Puppet>;
        const puppetMaster = anchor.workspace.PuppetMaster as Program<PuppetMaster>;


    
        // initialize a new puppet account
        const newPuppetAccount =  anchor.web3.Keypair.generate();
        const tx = await puppet.rpc.initialize({
            accounts: {
                puppet: newPuppetAccount.publicKey,
                owner: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            },
            signers: [newPuppetAccount]
        });

        // invoke the puppet master to perform the CPI to the puppet.
        const txm = await puppetMaster.rpc.pullStrings(new anchor.BN(111), {
            accounts: {
                puppet: newPuppetAccount.publicKey,
                puppetProgram: puppet.programId,
            },
        });

        // check the state updated
        const puppetAccount = await puppet.account.data.fetch(
            newPuppetAccount.publicKey
        );
        // console log the puppetAccount data
        console.log(puppetAccount.data.toNumber())
        assert.ok(puppetAccount.data.eq(new anchor.BN(111)));
    })

})