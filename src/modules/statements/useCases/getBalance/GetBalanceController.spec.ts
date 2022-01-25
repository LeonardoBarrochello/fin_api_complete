
import { OperationType } from "@modules/statements/entities/Statement";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app"


let connection : Connection;

describe("Get balance" , () =>{
    beforeAll(async () => {
      connection = await createConnection();
      await connection.runMigrations();
    });



    afterAll(async () => {
      await connection.dropDatabase()
      await connection.close;
   });
    it("Should be able to get user balance", async () => {

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

        await request(app).post("/api/v1/statements/deposit")
        .send({
          description : "deposit",
          amount : 1200 ,
          type : "deposit"
        })
        .set({ Authorization : `Bearer ${token}` })

        const response = await request(app).get("/api/v1/statements/balance")
        .set({ Authorization : `Bearer ${token}` })

        console.log(response.body)

        expect(response.body).toHaveProperty("balance")
    })

    it("Should not be able to get balance from a non existing user", async () => {

          await request(app).post("/api/v1/users").send({
              name : "User",
              email: "user@gmail.com",
              password : "123456"
            })

          const responseToken = await request(app).post("/api/v1/sessions").send({
              email: "user@gmail.com",
              password: "123456",
          });

          const { token } = responseToken.body

          await request(app).post("/api/v1/statements/deposit")
          .send({
            description : "deposit",
            amount : 1200 ,
            type : "deposit"
          })
          .set({ Authorization : `Bearer ${token}` })

          const response = await request(app).get("/api/v1/statements/balance")
          .set({ Authorization : `Bearer wrongtoken` })

          expect(response.status).toEqual(401)
    })









})
