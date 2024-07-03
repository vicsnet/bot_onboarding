"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestBlockEvent = void 0;
var forta_agent_1 = require("forta-agent");
var utils_1 = require("../utils");
var TestBlockEvent = /** @class */ (function (_super) {
    __extends(TestBlockEvent, _super);
    function TestBlockEvent() {
        var block = {
            transactions: [],
            hash: (0, utils_1.createAddress)("0x0"),
            number: 0,
        };
        return _super.call(this, forta_agent_1.EventType.BLOCK, forta_agent_1.Network.MAINNET, block) || this;
    }
    TestBlockEvent.prototype.setNumber = function (blockNumber) {
        this.block.number = blockNumber;
        return this;
    };
    TestBlockEvent.prototype.setHash = function (blockHash) {
        this.block.hash = blockHash;
        return this;
    };
    TestBlockEvent.prototype.setTimestamp = function (timestamp) {
        this.block.timestamp = timestamp;
        return this;
    };
    TestBlockEvent.prototype.addTransactions = function () {
        var _a;
        var txns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            txns[_i] = arguments[_i];
        }
        (_a = this.block.transactions).push.apply(_a, txns.map(function (tx) { return tx.hash; }));
        return this;
    };
    TestBlockEvent.prototype.addTransactionsHashes = function () {
        var _a;
        var hashes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            hashes[_i] = arguments[_i];
        }
        (_a = this.block.transactions).push.apply(_a, hashes);
        return this;
    };
    return TestBlockEvent;
}(forta_agent_1.BlockEvent));
exports.TestBlockEvent = TestBlockEvent;
