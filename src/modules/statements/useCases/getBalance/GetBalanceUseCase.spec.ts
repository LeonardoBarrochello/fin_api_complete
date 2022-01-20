

// criar um usuario
// efetuar uma transacao
// e por fim o get balance

import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase : GetBalanceUseCase;
let usersRepositoryInMemory : InMemoryUsersRepository;
let statementsRepositoryInMemory : InMemoryStatementsRepository;

describe("Get balance" , () => {
      beforeEach(()=>{
          usersRepositoryInMemory = new InMemoryUsersRepository();
          statementsRepositoryInMemory = new InMemoryStatementsRepository();
          getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory,usersRepositoryInMemory);
      })

      it("Should be able to get balance by a user_id" , async () => {
         const user : User = await usersRepositoryInMemory.create({
              name: "User name",
              email: "user@gmail.com",
              password: "userpass123"
         })

         await statementsRepositoryInMemory.create({
           user_id  : user.id ,
           description : "deposit",
           amount : 1200 ,
           type : OperationType.DEPOSIT
         })

         const balance = await getBalanceUseCase.execute({user_id: user.id})

         expect(balance).toHaveProperty("balance")
         expect(balance).toHaveProperty("statement")
      })

      it("Should not be able to get balance from a non existing user" , async () => {


        expect( async ()=>{
          const user : User = await usersRepositoryInMemory.create({
            name: "User name",
            email: "user@gmail.com",
            password: "userpass123"
       })

        await statementsRepositoryInMemory.create({
          user_id  : user.id ,
          description : "deposit",
          amount : 1200 ,
          type : OperationType.DEPOSIT
        })

        const balance = await getBalanceUseCase.execute({user_id:"wrongid"})
          }).rejects.toBeInstanceOf(GetBalanceError)


     })

})
