import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferStatementUseCase } from "./TransferStatementUseCase";

class TransferStatementController {
    async execute(request : Request , response : Response) : Promise<Response> {
        const { id : sender_id } = request.user;
        const { user_id } = request.params;
        const { amount , description } = request.body;
        const transferStatementUseCase = container.resolve(TransferStatementUseCase)
        const operation = await transferStatementUseCase.execute({
          user_id,
          sender_id,
          amount,
          description
        })


        return response.json(operation)

    }
}



export {TransferStatementController}
