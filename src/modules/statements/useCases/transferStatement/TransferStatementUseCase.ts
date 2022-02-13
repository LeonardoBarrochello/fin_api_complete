import { OperationType } from "../../../../modules/statements/entities/Statement";
import { IStatementsRepository } from "../../../../modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { AppError } from "../../../../shared/errors/AppError"
import { inject, injectable } from "tsyringe";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ITransferStatement } from "./ITransferStatement";

@injectable()
class TransferStatementUseCase {
    constructor(
      @inject("UsersRepository")
      private usersRepository : IUsersRepository,
      @inject("StatementsRepository")
      private statementsRepository : IStatementsRepository
    ){}
    async execute({ user_id , sender_id , amount , description} : ITransferStatement){

          const userBalance = await this.statementsRepository.getUserBalance({ user_id :sender_id , with_statement:true })

          const destinationAccountUser = await this.usersRepository.findById(user_id)

          console.log("balance" , userBalance)

          if(!destinationAccountUser){
              throw new AppError("target account user does not exists!")
          }

          if(userBalance.balance < amount ) {
             throw new CreateStatementError.InsufficientFunds()
          }

          const operation = await this.statementsRepository.create({
              user_id,
              sender_id,
              amount,
              description,
              type : OperationType.TRANSFER
          })

          return operation;
    }
}


export { TransferStatementUseCase}
