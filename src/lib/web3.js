import Web3 from "web3";
import { magic } from "./magic";

export const web3 = new Web3(magic.rpcProvider);
