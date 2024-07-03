import { TransactionEvent, ethers, BlockEvent, Trace } from "forta-agent";
import { Handler, HandlerOptions } from "./handler";
declare namespace TraceCalls {
    interface Options {
        signatures: string[];
        from?: string;
        to?: string;
        includeErrors?: boolean;
        filterByArguments?: (args: ethers.utils.Result, index: number, array: ethers.utils.Result[]) => boolean;
        filterByOutput?: (output: ethers.utils.Result, index: number, array: (ethers.utils.Result | null)[]) => boolean;
        filter?: (call: Metadata, index: number, array: Metadata[]) => boolean;
    }
    interface Metadata extends ethers.utils.TransactionDescription {
        from: string;
        to: string;
        trace: Trace;
        error: boolean;
        output: ethers.utils.Result | null;
    }
}
declare class TraceCalls extends Handler<TraceCalls.Options, TraceCalls.Metadata> {
    constructor(options: HandlerOptions<TraceCalls.Options, TraceCalls.Metadata>);
    private filterFunction;
    metadata(event: TransactionEvent | BlockEvent): Promise<TraceCalls.Metadata[] | null>;
}
export default TraceCalls;
