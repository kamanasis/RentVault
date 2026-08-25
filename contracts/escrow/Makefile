# RentVault Escrow Smart Contract Makefile

all: build

build:
	cargo build --target wasm32-unknown-unknown --release

build-optimized:
	stellar contract build

test:
	cargo test

clean:
	cargo clean

.PHONY: all build build-optimized test clean
