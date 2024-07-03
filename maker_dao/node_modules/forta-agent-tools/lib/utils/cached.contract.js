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
var forta_agent_1 = require("forta-agent");
var provider_cache_1 = require("./provider.cache");
var CachedContract = /** @class */ (function (_super) {
    __extends(CachedContract, _super);
    function CachedContract(addressOrName, contractInterface, provider, cacheByBlockTag) {
        if (cacheByBlockTag === void 0) { cacheByBlockTag = true; }
        if (!(provider instanceof forta_agent_1.ethers.providers.BaseProvider)) {
            throw new Error("Unsupported provider");
        }
        return _super.call(this, addressOrName, contractInterface, provider_cache_1.ProviderCache.createProxy(provider, cacheByBlockTag)) || this;
    }
    CachedContract.from = function (contract, cacheByBlockTag) {
        if (cacheByBlockTag === void 0) { cacheByBlockTag = true; }
        if (contract.signer != null) {
            throw new Error("Creating a CacheContract with a signer is not supported");
        }
        return new CachedContract(contract.address, contract.interface, contract.provider, cacheByBlockTag);
    };
    CachedContract.clearCache = function () {
        provider_cache_1.ProviderCache.clear();
    };
    return CachedContract;
}(forta_agent_1.ethers.Contract));
exports.default = CachedContract;
