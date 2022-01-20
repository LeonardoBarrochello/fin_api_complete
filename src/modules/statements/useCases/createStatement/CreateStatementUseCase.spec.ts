import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"


let createStatementUseCase :  CreateStatementUseCase ;
let usersRepositoryInMemory : InMemoryUsersRepository;
let statementsRepositoryInMemory : InMemoryStatementsRepository;


describe("Create statement" , () => {
        beforeEach(() => {
              usersRepositoryInMemory  =  new InMemoryUsersRepository();
              statementsRepositoryInMemory = new InMemoryStatementsRepository();
              createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory,statementsRepositoryInMemory);
        })

        it("Should be able to register a deposit" , async () => {
            const user  = await usersRepositoryInMemory.create({
                name: "User name",
                email: "user@gmail.com",
                password: "userpass123"
              })

            const statement = {
                  user_id  : user.id ,
                  description : "deposit",
                  amount : 1200 ,
                  type : OperationType.DEPOSIT
            }

            const resultOperation = await createStatementUseCase.execute(statement)

            expect(resultOperation.amount).toEqual(statement.amount)
            expect(resultOperation.user_id).toEqual(user.id)
      })

      it("Should not be able to register a deposit from a non existing user" ,  () => {

        expect( async () => {
            await usersRepositoryInMemory.create({
                name: "User name",
                email: "user@gmail.com",
                password: "userpass123"
              })

            const statement = {
                  user_id  : "wrongid" ,
                  description : "deposit",
                  amount : 1200 ,
                  type : OperationType.DEPOSIT
            }

             await createStatementUseCase.execute(statement)
            }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
       })

       it("Should be to register a withdraw" , async () => {


           const user = await usersRepositoryInMemory.create({
                name: "User name",
                email: "user@gmail.com",
                password: "userpass123"
              })

            await createStatementUseCase.execute({
                  user_id  : user.id ,
                  description : "deposit",
                  amount : 1200 ,
                  type : OperationType.DEPOSIT
            })

            const withdraw = await createStatementUseCase.execute({
              user_id  : user.id ,
              description : "withdraw",
              amount : 500 ,
              type : OperationType.WITHDRAW
        })
        expect(withdraw).toHaveProperty("amount")
       })

      it("Should not be to register a withdraw with invalid amount" ,  () => {

          expect( async ()=>{
                  const user = await usersRepositoryInMemory.create({
                    name: "User name",
                    email: "user@gmail.com",
                    password: "userpass123"
                  })

                  await createStatementUseCase.execute({
                        user_id  : user.id ,
                        description : "deposit",
                        amount : 1200 ,
                        type : OperationType.DEPOSIT
                  })

                  await createStatementUseCase.execute({
                    user_id  : user.id ,
                    description : "withdraw",
                    amount : 2000 ,
                    type : OperationType.WITHDRAW
              })
          }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
     })
     it("Should not be able to register a withdraw from a non existing user" ,  () => {

      expect( async () => {
          const user = await usersRepositoryInMemory.create({
              name: "User name",
              email: "user@gmail.com",
              password: "userpass123"
            })


           await createStatementUseCase.execute({
            user_id  : user.id ,
            description : "deposit",
            amount : 1200 ,
            type : OperationType.DEPOSIT
          })

          await createStatementUseCase.execute({
            user_id  : "wrongid" ,
            description : "deposit",
            amount : 1200 ,
            type : OperationType.WITHDRAW
          })


          }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
     })


})
