
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app"


let connection : Connection;

describe("Create User Controller" , () =>{
    beforeAll(async () => {
      connection = await createConnection();
      await connection.runMigrations();
    });



    afterAll(async () => {
      await connection.dropDatabase();
      await connection.close;
   });
    it("Should be able to create a new user" , async () => {
          const response = await request(app).post("/api/v1/users").send({
            name : "User name",
            email: "user@gmail.com",
            password : "123456"
          })
        expect(response.status).toEqual(201);
      })
    it("Should not be able to create a new user with email exists" , async () => {
        const response = await request(app).post("/api/v1/users").send({
          name : "User name",
          email: "user@gmail.com",
          password : "123456"
        })

        expect(response.status).toEqual(400);
  })



})
