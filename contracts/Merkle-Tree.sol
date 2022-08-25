// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Verify {

    bytes32 public root;

    constructor(bytes32 _root) {
        root = _root;
    }

    function checkInWhitelist(bytes32[] calldata proof, uint64 maxMintAmount) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encode(msg.sender, maxMintAmount));
        bool verified = MerkleProof.verify(proof, root, leaf);
        return verified;
    }
}