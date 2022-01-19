import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let createUserUseCase : CreateUserUseCase;
let authenticateUserUseCase : AuthenticateUserUseCase;
let usersRepositoryInMemory : InMemoryUsersRepository;

/*
    criar usuario
    logar usuario
    verificar se o id retornado no payload é igual ao id do usuario criado
*/

describe("Authenticate User" , () => {
    beforeEach(()=>{
       usersRepositoryInMemory = new InMemoryUsersRepository()
       createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
       authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    })

    it("Should be able to authenticate a user", async () => {
         const user = await createUserUseCase.execute({
           name: "User name",
           email:"user@gmail.com",
           password:"userpass123"
         })

         const auth = await authenticateUserUseCase.execute({
           email: user.email,
           password : "userpass123"
         })

         console.log(auth);
         expect(auth).toHaveProperty("token")
    })

    it("Should not be able to authenticate a non existing user ",  () => {

      expect( async () => {
        const user = await createUserUseCase.execute({
          name: "User name",
          email:"user@gmail.com",
          password:"userpass123"
        })

       await authenticateUserUseCase.execute({
          email: "wronguser@gmail.com",
          password : "userpass123"
        })
      }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
 })

    it("Should not be able to authenticate with incorrect password ",  () => {

      expect( async () => {
        const user = await createUserUseCase.execute({
          name: "User name",
          email:"user@gmail.com",
          password:"userpass123"
        })

        await authenticateUserUseCase.execute({
          email: user.email,
          password : "wrongpass123"
        })
      }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
})
