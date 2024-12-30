import {Address} from "@/features/addresses/types";
import {IUser} from "@/types/auth";

export type Worker = IUser & { addresses: Address[] }
