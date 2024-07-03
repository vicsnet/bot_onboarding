import { TransactionEvent, BlockEvent } from "forta-agent";
export declare class TestBlockEvent extends BlockEvent {
    constructor();
    setNumber(blockNumber: number): TestBlockEvent;
    setHash(blockHash: string): TestBlockEvent;
    setTimestamp(timestamp: number): TestBlockEvent;
    addTransactions(...txns: TransactionEvent[]): TestBlockEvent;
    addTransactionsHashes(...hashes: string[]): TestBlockEvent;
}
