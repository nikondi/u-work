import {user} from "@/features/auth";
import {Address} from "@/features/addresses";

export type Worker = user & { addresses: Address[] }
