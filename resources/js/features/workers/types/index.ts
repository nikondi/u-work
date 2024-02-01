import {user} from "@/features/auth";

export type Worker = user & { addresses: Address[] }
