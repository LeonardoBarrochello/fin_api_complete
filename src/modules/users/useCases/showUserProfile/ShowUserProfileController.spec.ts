
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app"


let connection : Connection;

describe("Show user profile" , () =>{
    beforeAll(async () => {
      connection = await createConnection();
      await connection.runMigrations();
    });



    afterAll(async () => {
      await connection.dropDatabase();
      await connection.close;
   });
    it("Should be able to show user profile" , async () => {

        await request(app).post("/api/v1/users").send({
            name : "User name",
            email: "user@gmail.com",
            password : "123456"
          })

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "user@gmail.com",
            password: "123456",
        });

        const { token } = responseToken.body

        const response = await request(app).get("/api/v1/profile").set({ Authorization : `Bearer ${token}` })

        console.log(response.body)

        expect(response.body).toHaveProperty("id")
    })


    it("Should not be able to show a non existing user profile" , async () => {

      await request(app).post("/api/v1/users").send({
          name : "User name",
          email: "user@gmail.com",
          password : "123456"
        })

      const responseToken = await request(app).post("/api/v1/sessions").send({
          email: "wronguser",
          password: "123456",
      });

      const { token } = responseToken.body

      const response = await request(app).get("/api/v1/profile").set({ Authorization : `Bearer ${token}` })

      expect(response.status).toEqual(401)
  })






})
