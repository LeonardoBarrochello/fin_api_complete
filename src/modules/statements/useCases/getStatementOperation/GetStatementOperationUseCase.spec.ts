import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"




let getStatementOperationUseCase : GetStatementOperationUseCase;
let usersRepositoryInMemory : InMemoryUsersRepository;
let statementsRepositoryInMemory : InMemoryStatementsRepository;

describe("Get statement operation" , () =>{
      beforeEach(()=>{
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory,statementsRepositoryInMemory)
      })

      it("Should be able to get statement operation by statement id" , async () => {
            const user  = await usersRepositoryInMemory.create({
                  name: "User name",
                  email: "user@gmail.com",
                  password: "userpass123"
            })

            const statement =  await statementsRepositoryInMemory.create({
              user_id  : user.id ,
              description : "deposit",
              amount : 1200 ,
              type : OperationType.DEPOSIT
            })

            const getStatement = await getStatementOperationUseCase.execute(
              {user_id : user.id , statement_id : statement.id})


            expect(getStatement).toHaveProperty("amount")
      })

      it("Should not be able to get statement operation by a non existing user id" , async () => {

        expect( async ()=>{
              const user  = await usersRepositoryInMemory.create({
                name: "User name",
                email: "user@gmail.com",
                password: "userpass123"
              })

              const statement =  await statementsRepositoryInMemory.create({
                user_id  : user.id ,
                description : "deposit",
                amount : 1200 ,
                type : OperationType.DEPOSIT
              })

              const getStatement = await getStatementOperationUseCase.execute(
                {user_id : "wrongid" , statement_id : statement.id})

        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)

      })

      it("Should not be able to get statement operation by a non existing statement id" , async () => {

        expect( async ()=>{
              const user  = await usersRepositoryInMemory.create({
                name: "User name",
                email: "user@gmail.com",
                password: "userpass123"
              })

              const statement =  await statementsRepositoryInMemory.create({
                user_id  : user.id ,
                description : "deposit",
                amount : 1200 ,
                type : OperationType.DEPOSIT
              })

              const getStatement = await getStatementOperationUseCase.execute(
                {user_id : user.id , statement_id : "wrongid" })

        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)

      })



})
