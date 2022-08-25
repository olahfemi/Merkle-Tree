import { ethers } from "hardhat";
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

function encodeLeaf(address: any, spots: number) {
    return ethers.utils.defaultAbiCoder.encode(
      ["address", "uint64"],
      [address, spots]
    );
}

async function main() {

    const [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7] =
      await ethers.getSigners();
    
    const addressList = [
      encodeLeaf(owner.address, 2),
      encodeLeaf(addr1.address, 2),
      encodeLeaf(addr2.address, 2),
      encodeLeaf(addr3.address, 2),
      encodeLeaf(addr4.address, 2),
      encodeLeaf(addr5.address, 2),
      encodeLeaf(addr6.address, 2),
      encodeLeaf(addr7.address, 2),
    ];

    const merkleTree = new MerkleTree(addressList, keccak256, {
      hashLeaves: true,
      sortPairs: true,
    });
    
    const root = merkleTree.getHexRoot();

    console.log("Merkle tree: ", merkleTree.toString());
    console.log("Merkle root: ", root);

    const verify = await ethers.getContractFactory("Verify");
    const Verify = await verify.deploy(root);
    await Verify.deployed();

    const leaf = keccak256(addressList[0]);
    const proof = merkleTree.getHexProof(leaf);

    let verifiedList = await Verify.checkInWhitelist(proof, 2);
    console.log("VERIFIED LIST: ", verifiedList);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});