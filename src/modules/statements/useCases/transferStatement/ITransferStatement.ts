import { OperationType } from "@modules/statements/entities/Statement";

export interface ITransferStatement {
    user_id : string ;
    sender_id: string;
    description : string;
    amount : number;
}
