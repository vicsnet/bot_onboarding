import { TransactionEvent, BlockEvent } from "forta-agent";
import { Handler, HandlerOptions } from "./handler";
declare namespace BlacklistedAddresses {
    interface Options {
        addresses: string[];
    }
    interface Metadata {
        addresses: string[];
    }
}
declare class BlacklistedAddresses extends Handler<BlacklistedAddresses.Options, BlacklistedAddresses.Metadata> {
    constructor(options: HandlerOptions<BlacklistedAddresses.Options, BlacklistedAddresses.Metadata>);
    metadata(event: TransactionEvent | BlockEvent): Promise<BlacklistedAddresses.Metadata[] | null>;
}
export default BlacklistedAddresses;
