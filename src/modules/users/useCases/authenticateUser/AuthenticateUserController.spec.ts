
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app"


let connection : Connection;

describe("Authenticate User Controller" , () =>{
    beforeAll(async () => {
      connection = await createConnection();
      await connection.runMigrations();
    });



    afterAll(async () => {
      await connection.dropDatabase();
      await connection.close;
   });
    it("Should be able to authenticate a user" , async () => {
        await request(app).post("/api/v1/users").send({
            name : "User name",
            email: "user@gmail.com",
            password : "123456"
          })

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "user@gmail.com",
            password: "123456",
        });

        console.log(responseToken.body)

        expect(responseToken.body).toHaveProperty("token")


    })

    it("Should not be able to authenticate a non existing user" , async () => {
      await request(app).post("/api/v1/users").send({
          name : "User name",
          email: "user@gmail.com",
          password : "123456"
        })

      const response = await request(app).post("/api/v1/sessions").send({
          email: "wronguser",
          password: "123456",
      });



      expect(response.status).toEqual(401)
    })

    it("Should not be able to authenticate a user with incorrect password" , async () => {
      await request(app).post("/api/v1/users").send({
          name : "User name",
          email: "user@gmail.com",
          password : "123456"
        })

      const response = await request(app).post("/api/v1/sessions").send({
          email: "user@gmail.com",
          password: "wrongpass",
      });



      expect(response.status).toEqual(401)
    })




})
