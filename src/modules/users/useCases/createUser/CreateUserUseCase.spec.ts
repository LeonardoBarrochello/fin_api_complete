import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase : CreateUserUseCase;
let usersRepositoryInMemory : InMemoryUsersRepository;


describe("Create user" , () =>{

      beforeEach(()=>{
          usersRepositoryInMemory = new InMemoryUsersRepository();
          createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
      })

      it("Should be able to create a new user" , async () => {
            const user = await createUserUseCase.execute({
               name : "Name",
               email : "email@email.com",
               password:"121313"
            })
            console.log(user);
      })

      it("Should not be able to create user with email already used" ,  () => {

        expect(async ()=>{
          await createUserUseCase.execute({
            name : "Name",
            email : "email@email.com",
            password:"121313"
          })
          await createUserUseCase.execute({
            name : "Name",
            email : "email@email.com",
            password:"121313"
        })
        }).rejects.toBeInstanceOf(CreateUserError)


  })


})
