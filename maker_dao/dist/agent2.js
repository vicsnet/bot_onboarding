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
exports.TETHER_DECIMALS = exports.TETHER_ADDRESS = exports.ERC20_TRANSFER_EVENT = void 0;
var forta_agent_1 = require("forta-agent");
exports.ERC20_TRANSFER_EVENT = "event Transfer(address indexed from, address indexed to, uint256 value)";
exports.TETHER_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
exports.TETHER_DECIMALS = 6;
var findingsCount = 0;
var handleTransaction = function (txEvent) { return __awaiter(void 0, void 0, void 0, function () {
    var findings, tetherTransferEvents;
    return __generator(this, function (_a) {
        findings = [];
        // limiting this agent to emit only 5 findings so that the alert feed is not spammed
        if (findingsCount >= 5)
            return [2 /*return*/, findings];
        tetherTransferEvents = txEvent.filterLog(exports.ERC20_TRANSFER_EVENT, exports.TETHER_ADDRESS);
        tetherTransferEvents.forEach(function (transferEvent) {
            // extract transfer event arguments
            var _a = transferEvent.args, to = _a.to, from = _a.from, value = _a.value;
            // shift decimals of transfer value
            var normalizedValue = value.div(Math.pow(10, exports.TETHER_DECIMALS));
            // if more than 10,000 Tether were transferred, report it
            if (normalizedValue.gt(10000)) {
                findings.push(forta_agent_1.Finding.fromObject({
                    name: "High Tether Transfer",
                    description: "High amount of USDT transferred: ".concat(normalizedValue),
                    alertId: "FORTA-1",
                    severity: forta_agent_1.FindingSeverity.Low,
                    type: forta_agent_1.FindingType.Info,
                    metadata: {
                        to: to,
                        from: from,
                    },
                }));
                findingsCount++;
            }
        });
        return [2 /*return*/, findings];
    });
}); };
// const initialize: Initialize = async () => {
//   // do some initialization on startup e.g. fetch data
// }
// const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
//   const findings: Finding[] = [];
//   // detect some block condition
//   return findings;
// }
// const handleAlert: HandleAlert = async (alertEvent: AlertEvent) => {
//   const findings: Finding[] = [];
//   // detect some alert condition
//   return findings;
// }
// const healthCheck: HealthCheck = async () => {
//   const errors: string[] = [];
// detect some health check condition
// errors.push("not healthy due to some condition")
// return errors;
// }
exports.default = {
    // initialize,
    handleTransaction: handleTransaction,
    // healthCheck,
    // handleBlock,
    // handleAlert
};
