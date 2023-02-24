import fs from "fs"
import { NFTStorage } from "nft.storage"
import { filesFromPath } from "files-from-path"
import path from "path"
require("dotenv").config()

const nftStorageToken = process.env.NFT_STORAGE_TOKEN

async function uploadImages(): Promise<string> {
  if (!nftStorageToken) {
    throw "NO STORAGE API KEY"
  }

  const files = filesFromPath("nft-metadata/images", {
    pathPrefix: path.resolve("nft-metadata/images"),
    hidden: true,
  })

  const storage = new NFTStorage({ token: nftStorageToken })
  const cid = await storage.storeDirectory(files)

  let status

  do {
    await new Promise((x) => setTimeout(x, 1000))
    status = await storage.status(cid)
  } while (!["pinned", "failed"].includes(status.pin.status))

  if (status.pin.status === "failed") {
    throw "IMAGE UPLOAD FAILED"
  }

  return `ipfs://${cid}/`
}

function compileMetadata(baseImageURL: string) {
  const imageFiles = fs.readdirSync("nft-metadata/images")
  const imageCount = imageFiles.length

  for (let i = 0; i < imageCount; i++) {
    const name = imageFiles[i].replace(".png", "")
    const data = {
      name: name,
      image: baseImageURL + name + ".png",
      tokenId: i,
    }

    fs.writeFileSync(`nft-metadata/metadata/${i}.json`, JSON.stringify(data))
  }
}

async function uploadMetadata(): Promise<string> {
  if (!nftStorageToken) {
    throw "NO STORAGE API KEY"
  }

  const files = filesFromPath("nft-metadata/metadata", {
    pathPrefix: path.resolve("nft-metadata/metadata"),
    hidden: true,
  })

  const storage = new NFTStorage({ token: nftStorageToken })

  const cid = await storage.storeDirectory(files)

  let status

  do {
    await new Promise((x) => setTimeout(x, 1000))
    status = await storage.status(cid)
  } while (!["pinned", "failed"].includes(status.pin.status))

  if (status.pin.status === "failed") {
    throw "METADATA UPLOAD FAILED"
  }

  return `ipfs://${cid}/`
}

async function main() {
  const baseImageURL = await uploadImages()
  compileMetadata(baseImageURL)
  const baseMetadataURL = await uploadMetadata()

  console.log("Metadata IPFS base URL:", baseMetadataURL)
  console.log(
    "Gateway metadata base URL",
    baseMetadataURL.replace("ipfs://", "https://nftstorage.link/ipfs/")
  )
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.log("ERROR:", error)
    process.exit(1)
  })
