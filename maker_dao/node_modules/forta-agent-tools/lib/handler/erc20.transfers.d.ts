import { LogDescription, TransactionEvent, ethers, BlockEvent } from "forta-agent";
import { Handler, HandlerOptions } from "./handler";
declare namespace Erc20Transfers {
    interface Options {
        emitter?: string;
        from?: string;
        to?: string;
        amountThreshold?: ethers.BigNumberish | ((amount: ethers.BigNumber) => boolean);
    }
    interface Metadata {
        emitter: string;
        from: string;
        to: string;
        amount: ethers.BigNumber;
    }
}
declare class Erc20Transfers extends Handler<Erc20Transfers.Options, Erc20Transfers.Metadata> {
    filter: (log: LogDescription) => boolean;
    constructor(options: HandlerOptions<Erc20Transfers.Options, Erc20Transfers.Metadata>);
    private _createFilter;
    metadata(event: TransactionEvent | BlockEvent): Promise<Erc20Transfers.Metadata[] | null>;
}
export default Erc20Transfers;
