import Web3 from "web3";
import { magic } from "./magic";
import { contractABI } from "./abi";

export const contractAddress = "0x9556470F1dFAc6f72bcE0f46f2487d1D4cb0A30C";

export const web3 = new Web3(magic.rpcProvider);

export const contract = new web3.eth.Contract(contractABI, contractAddress);
