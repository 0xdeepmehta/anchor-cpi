use anchor_lang::prelude::*;
use puppet::cpi::accounts::SetData; // use cpi crate to access the #[derive(Accounts)]
use puppet::program::Puppet;
use puppet::{self, Data};



declare_id!("3kyC6H6Q6s7dQYwYyEBGLptFcqLNtpVPVeGmBubhtuN5");

#[program]
pub mod puppet_master {
    use super::*;
    pub fn pull_strings(ctx: Context<PullString>, data: u64) -> ProgramResult {
        let cpi_program = ctx.accounts.puppet_program.to_account_info();
        let cpi_account = SetData {
            puppet: ctx.accounts.puppet.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);
        puppet::cpi::set_data(cpi_ctx, data)
    }
}

#[derive(Accounts)]
pub struct PullString<'info> {
    #[account(mut)]
    pub puppet: Account<'info, Data>,
    pub puppet_program: Program<'info, Puppet>,
}
