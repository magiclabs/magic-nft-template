import { ethers } from "hardhat"
import { HiroCollectibles } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"

describe("Hiro Collectibles", function () {
  async function baseFixture(): Promise<{
    contract: HiroCollectibles
    owner: SignerWithAddress
    otherAddresses: SignerWithAddress[]
  }> {
    const ContractFactory = await ethers.getContractFactory("HiroCollectibles")

    const contract = await ContractFactory.deploy()
    await contract.deployed()

    const [owner, ...otherAddresses] = await ethers.getSigners()

    return { contract, owner, otherAddresses }
  }

  it("Can mint", async function () {
    const { contract, otherAddresses } = await loadFixture(baseFixture)
    const minter = otherAddresses[0]
    await contract.connect(minter).safeMint(minter.address)

    expect(await contract.balanceOf(minter.address)).to.equal(1)
    expect(await contract.ownerOf(0)).to.equal(minter.address)
    expect(await contract.totalSupply()).to.equal(1)
  })

  it("Tokens reuse metadata", async function () {
    const { contract, otherAddresses } = await loadFixture(baseFixture)
    const minter = otherAddresses[0]

    const numberOfUniqueNFTs = (process.env.NUM_UNIQUE_NFT ?? 0) as number

    for (let i = 0; i < numberOfUniqueNFTs + 1; i++) {
      await contract.connect(minter).safeMint(minter.address)
    }

    const secondToLastTokenUri = await contract.tokenURI(numberOfUniqueNFTs - 1)
    const lastTokenUri = await contract.tokenURI(numberOfUniqueNFTs)

    expect(secondToLastTokenUri.slice(-7)).to.equal(
      `${numberOfUniqueNFTs - 1}.json`
    )
    expect(lastTokenUri.slice(-7)).to.equal("/0.json")
  })
})
