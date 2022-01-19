import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let showUserProfileUseCase : ShowUserProfileUseCase;
let usersRepositoryInMemory : InMemoryUsersRepository;

describe("Show user profile" , ()=> {
  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  })

  it("Should be able to show user profile" , async ()=>{
        const user = await usersRepositoryInMemory.create(
          {
            name:"user name" ,
            email:"user@gmail.com",
            password:"userpass123"
          })

        const profile = await showUserProfileUseCase.execute(user.id);

        expect(profile).toHaveProperty("id");
        expect(profile.id).toEqual(user.id);

  })

  it("Should not be able to show user profile of a non existing user" ,  ()=>{


    expect( async ()=>{
      const user = await usersRepositoryInMemory.create(
        {
          name:"user name" ,
          email:"user@gmail.com",
          password:"userpass123"
        })

      const profile = await showUserProfileUseCase.execute("wrongid");
    }).rejects.toBeInstanceOf(ShowUserProfileError)


})

})
