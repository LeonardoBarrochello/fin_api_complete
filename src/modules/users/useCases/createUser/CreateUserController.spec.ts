
import request from "supertest";
import { app } from "../../../../app"



describe("Create User Controller" , () =>{


   it("Should be able to create a new user" , async () => {

        const response = await request(app).post("/api/v1/users").send({
           name : "User name",
           email: "user@gmail.com",
           password : "123456"
        })


        console.log(response)




   })
})
