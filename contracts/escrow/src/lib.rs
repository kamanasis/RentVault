#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, String, Symbol,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum EscrowStatus {
    Locked = 0,
    Released = 1,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EscrowState {
    pub tenant: Address,
    pub landlord: Address,
    pub amount: i128,
    pub status: EscrowStatus,
}

const NATIVE_CONTRACT_ID: &str = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"; // Standard native asset on testnet

#[contract]
pub struct RentVaultEscrow;

#[contractimpl]
impl RentVaultEscrow {
    /// Lock a deposit in the escrow contract.
    pub fn lock_deposit(
        env: Env,
        agreement_id: String,
        tenant: Address,
        landlord: Address,
        amount: i128,
    ) {
        // 1. Authorization
        tenant.require_auth();

        if amount <= 0 {
            panic!("Amount must be greater than 0");
        }

        // 2. Prevent duplicate lock
        if env.storage().persistent().has(&agreement_id) {
            panic!("Agreement already exists");
        }

        // 3. Transfer XLM from tenant to this contract
        let token_client = token::Client::new(&env, &Address::from_string(&String::from_str(&env, NATIVE_CONTRACT_ID)));
        token_client.transfer(&tenant, &env.current_contract_address(), &amount);

        // 4. Store state
        let state = EscrowState {
            tenant: tenant.clone(),
            landlord: landlord.clone(),
            amount,
            status: EscrowStatus::Locked,
        };
        env.storage().persistent().set(&agreement_id, &state);

        // 5. Emit Event
        env.events()
            .publish((symbol_short!("escrow"), symbol_short!("locked")), agreement_id);
    }

    /// Release a deposit to the landlord.
    pub fn release_deposit(env: Env, agreement_id: String, releaser: Address) {
        // 1. Authorization
        releaser.require_auth();

        // 2. Load state
        let mut state: EscrowState = env
            .storage()
            .persistent()
            .get(&agreement_id)
            .unwrap_or_else(|| panic!("Escrow does not exist"));

        // 3. Authorization check
        if releaser != state.landlord {
            panic!("Only the landlord can release this escrow");
        }

        // 4. Status check
        if state.status != EscrowStatus::Locked {
            panic!("Escrow is not locked");
        }

        // 5. Transfer XLM from contract to landlord
        let token_client = token::Client::new(&env, &Address::from_string(&String::from_str(&env, NATIVE_CONTRACT_ID)));
        token_client.transfer(&env.current_contract_address(), &state.landlord, &state.amount);

        // 6. Update state
        state.status = EscrowStatus::Released;
        env.storage().persistent().set(&agreement_id, &state);

        // 7. Emit Event
        env.events()
            .publish((symbol_short!("escrow"), symbol_short!("release")), agreement_id);
    }
}
