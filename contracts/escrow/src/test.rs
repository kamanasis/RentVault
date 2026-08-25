#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_contract_initialization_and_client() {
    let env = Env::default();
    env.mock_all_auths();

    // Register RentVaultEscrow contract
    let contract_id = env.register_contract(None, RentVaultEscrow);
    let _client = RentVaultEscrowClient::new(&env, &contract_id);

    // Verify state types and enum variants
    let status_locked = EscrowStatus::Locked;
    let status_released = EscrowStatus::Released;

    assert_eq!(status_locked, EscrowStatus::Locked);
    assert_ne!(status_locked, status_released);
}

#[test]
fn test_escrow_state_data_structure() {
    let env = Env::default();
    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);

    let state = EscrowState {
        tenant: tenant.clone(),
        landlord: landlord.clone(),
        amount: 1500_0000000,
        status: EscrowStatus::Locked,
    };

    assert_eq!(state.tenant, tenant);
    assert_eq!(state.landlord, landlord);
    assert_eq!(state.amount, 1500_0000000);
    assert_eq!(state.status, EscrowStatus::Locked);
}

#[test]
#[should_panic(expected = "Amount must be greater than 0")]
fn test_lock_zero_amount_panics() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, RentVaultEscrow);
    let client = RentVaultEscrowClient::new(&env, &contract_id);

    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    let agreement_id = String::from_str(&env, "AGR-PANIC-TEST");

    // Attempting to lock 0 amount should panic
    client.lock_deposit(&agreement_id, &tenant, &landlord, &0);
}
