import { getRepository, Repository } from "typeorm";

import { OperationType, Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    sender_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      sender_id,
      amount,
      description,
      type
    });

    await this.repository.save(statement);

    return statement
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository.find({
      where : [ {user_id : user_id} , {sender_id : user_id } ]
    });


    console.log("statement" , statement)

    const balance = statement.reduce((acc, operation) => {

      if (operation.type === OperationType.DEPOSIT) {
        return acc + operation.amount;
      }
      else if ( operation.type === OperationType.WITHDRAW) {
        return acc - operation.amount;
      }
      else if(operation.type === OperationType.TRANSFER){
           if(operation.user_id === user_id){ //se user_id da transacao for igual ao passado , significa que esta recebendo uma transferencia
              return acc + operation.amount;
           }
           else if( operation.sender_id === user_id ){  //se remetente for igual ao id passado significa que enviou a transferencia
              return acc - operation.amount
           }
      }


    }, 0)

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }
}
