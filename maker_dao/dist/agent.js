"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_TOTAL_SUPPLY = exports.GET_DAI_BALANCE = exports.ARBI_CHAINID = exports.OP_CHAINID = exports.ETHER_CHAINID = exports.TRANSFER_EVENT = exports.PROVIDER_ARBI = exports.PROVIDER_OP = exports.PROVIDER_EThereum = exports.L2_DAI_ARBITRUM = exports.L2_DAI_OPTIMISM = exports.L1_ESCROW_ADDRESS_ARBITRUM = exports.L1_ESCROW_ADDRESS_OPTIMISM = exports.L1_DAI_CONTRACT_ADDRESS = void 0;
var forta_agent_1 = require("forta-agent");
var ABI_1 = require("./ABI");
var layer2ABI_1 = require("./layer2ABI");
exports.L1_DAI_CONTRACT_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
exports.L1_ESCROW_ADDRESS_OPTIMISM = "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";
exports.L1_ESCROW_ADDRESS_ARBITRUM = "0xA10c7CE4b876998858b1a9E12b10092229539400";
exports.L2_DAI_OPTIMISM = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
exports.L2_DAI_ARBITRUM = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
// i need to check the balance of L1 escrow to ensure that is >= to the total supply of L2 Escrow
exports.PROVIDER_EThereum = new forta_agent_1.ethers.providers.JsonRpcProvider("https://eth-pokt.nodies.app");
exports.PROVIDER_OP = new forta_agent_1.ethers.providers.JsonRpcProvider("https://op-pokt.nodies.app");
exports.PROVIDER_ARBI = new forta_agent_1.ethers.providers.JsonRpcProvider("https://arb-pokt.nodies.app");
exports.TRANSFER_EVENT = "event Transfer(address indexed from, address indexed to, uint256 value)";
exports.ETHER_CHAINID = 1;
exports.OP_CHAINID = 10;
exports.ARBI_CHAINID = 42161;
var GET_DAI_BALANCE = function (provider, escrowAddr) { return __awaiter(void 0, void 0, void 0, function () {
    var contract, balanceOf;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                contract = new forta_agent_1.ethers.Contract(exports.L1_DAI_CONTRACT_ADDRESS, ABI_1.ABI, provider);
                return [4 /*yield*/, contract.balanceOf(escrowAddr)];
            case 1:
                balanceOf = _a.sent();
                console.log(balanceOf);
                return [2 /*return*/, balanceOf];
        }
    });
}); };
exports.GET_DAI_BALANCE = GET_DAI_BALANCE;
var GET_TOTAL_SUPPLY = function (contractAddr, provider) { return __awaiter(void 0, void 0, void 0, function () {
    var contract, totalSupply;
    return __generator(this, function (_a) {
        contract = new forta_agent_1.ethers.Contract(contractAddr, layer2ABI_1.L2ABI, provider);
        totalSupply = contract.totalSupply();
        return [2 /*return*/, totalSupply];
    });
}); };
exports.GET_TOTAL_SUPPLY = GET_TOTAL_SUPPLY;
var provideHandleTransaction = function (provider, escrowAddr, contractAddr) {
    return function (txEvent) { return __awaiter(void 0, void 0, void 0, function () {
        var findings, network, chainId, Escrowbalance, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findings = [];
                    return [4 /*yield*/, provider.getNetwork()];
                case 1:
                    network = _a.sent();
                    chainId = network.chainId;
                    if (chainId === exports.OP_CHAINID) {
                        Escrowbalance = (0, exports.GET_DAI_BALANCE)(provider, escrowAddr);
                        console.log(Escrowbalance);
                        data = (0, exports.GET_TOTAL_SUPPLY)(contractAddr, provider);
                        console.log(data);
                        if (Escrowbalance >= data) {
                            return [2 /*return*/, findings];
                        }
                        else {
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); };
};
exports.default = (function (provider, escrowAddr, contractAddr) { return ({
    handleTransaction: provideHandleTransaction(provider, escrowAddr, contractAddr),
}); });
