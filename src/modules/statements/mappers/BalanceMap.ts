import { OperationType, Statement } from "../entities/Statement";



interface IBalance {
  statement: Statement[],
  balance: number
}
export class BalanceMap {
  static toDTO({statement, balance}: IBalance) {
    const parsedStatement = statement.map(({
      id,
      sender_id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => {

      if(type === OperationType.TRANSFER){
          return  {
            id,
            sender_id,
            amount: Number(amount),
            description,
            type,
            created_at,
            updated_at
        }
      }
      return  {
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
    }

    }

    );

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
