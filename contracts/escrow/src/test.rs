#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_contract_initialization_and_client() {
    let env = Env::default();
    env.mock_all_auths();

    // Register RentVaultEscrow contract
    let contract_id = env.register(RentVaultEscrow, ());
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

    let contract_id = env.register(RentVaultEscrow, ());
    let client = RentVaultEscrowClient::new(&env, &contract_id);

    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    let agreement_id = String::from_str(&env, "AGR-PANIC-ZERO");

    // Attempting to lock 0 amount should panic
    client.lock_deposit(&agreement_id, &tenant, &landlord, &0);
}

#[test]
#[should_panic(expected = "Amount must be greater than 0")]
fn test_lock_negative_amount_panics() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(RentVaultEscrow, ());
    let client = RentVaultEscrowClient::new(&env, &contract_id);

    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    let agreement_id = String::from_str(&env, "AGR-PANIC-NEG");

    // Attempting to lock negative amount should panic
    client.lock_deposit(&agreement_id, &tenant, &landlord, &-500);
}

#[test]
#[should_panic(expected = "Agreement already exists")]
fn test_duplicate_agreement_lock_panics() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(RentVaultEscrow, ());
    let client = RentVaultEscrowClient::new(&env, &contract_id);

    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    let agreement_id = String::from_str(&env, "AGR-DUP-TEST");

    // Pre-populate persistent storage to simulate an existing active agreement
    env.as_contract(&contract_id, || {
        let existing = EscrowState {
            tenant: tenant.clone(),
            landlord: landlord.clone(),
            amount: 1000_0000000,
            status: EscrowStatus::Locked,
        };
        env.storage().persistent().set(&agreement_id, &existing);
    });

    // Re-locking same agreement_id must panic
    client.lock_deposit(&agreement_id, &tenant, &landlord, &1000_0000000);
}

#[test]
#[should_panic(expected = "Escrow does not exist")]
fn test_release_nonexistent_escrow_panics() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(RentVaultEscrow, ());
    let client = RentVaultEscrowClient::new(&env, &contract_id);

    let releaser = Address::generate(&env);
    let nonexistent_id = String::from_str(&env, "AGR-DOES-NOT-EXIST");

    // Attempting to release nonexistent escrow should panic
    client.release_deposit(&nonexistent_id, &releaser);
}

#[test]
#[should_panic(expected = "Only the landlord can release this escrow")]
fn test_unauthorized_caller_cannot_release_escrow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(RentVaultEscrow, ());
    let client = RentVaultEscrowClient::new(&env, &contract_id);

    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    let rogue_caller = Address::generate(&env);
    let agreement_id = String::from_str(&env, "AGR-AUTH-TEST");

    // Pre-populate locked escrow state
    env.as_contract(&contract_id, || {
        let state = EscrowState {
            tenant: tenant.clone(),
            landlord: landlord.clone(),
            amount: 1200_0000000,
            status: EscrowStatus::Locked,
        };
        env.storage().persistent().set(&agreement_id, &state);
    });

    // Tenant or third party attempting to call release_deposit must panic
    client.release_deposit(&agreement_id, &rogue_caller);
}

#[test]
#[should_panic(expected = "Escrow is not locked")]
fn test_double_release_panics() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(RentVaultEscrow, ());
    let client = RentVaultEscrowClient::new(&env, &contract_id);

    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    let agreement_id = String::from_str(&env, "AGR-DOUBLE-RELEASE");

    // Pre-populate escrow that is already in Released status
    env.as_contract(&contract_id, || {
        let state = EscrowState {
            tenant: tenant.clone(),
            landlord: landlord.clone(),
            amount: 800_0000000,
            status: EscrowStatus::Released,
        };
        env.storage().persistent().set(&agreement_id, &state);
    });

    // Landlord calling release on already released escrow must panic
    client.release_deposit(&agreement_id, &landlord);
}
