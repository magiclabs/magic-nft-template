import Web3 from "web3";
import { magic } from "./magic";
import { contractABI } from "./abi";

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const web3 = new Web3(magic.rpcProvider);

export const contract = new web3.eth.Contract(contractABI, contractAddress);
