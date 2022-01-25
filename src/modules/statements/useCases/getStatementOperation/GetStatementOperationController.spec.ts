
import { OperationType } from "@modules/statements/entities/Statement";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app"


let connection : Connection;

describe("Get statement operation" , () =>{
    beforeAll(async () => {
      connection = await createConnection();
      await connection.runMigrations();
    });



    afterAll(async () => {
      await connection.dropDatabase()
      await connection.close;
   });

  it("Should be able to get statement operation", async () => {

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

     const deposit = await request(app).post("/api/v1/statements/deposit")
      .send({
        description : "deposit",
        amount : 1200 ,
        type : OperationType.DEPOSIT
      })
      .set({ Authorization : `Bearer ${token}` })

      const response = await request(app).get(`/api/v1/statements/${deposit.body.id}`)
      .set({ Authorization : `Bearer ${token}` })

      expect(response.body).toHaveProperty("id")
      expect(response.body).toHaveProperty("amount")
    })

    it("Should not be able to get statement operation with a non existing statement_id", async () => {

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
        type : OperationType.DEPOSIT
      })
      .set({ Authorization : `Bearer ${token}` })

      const response = await request(app).post(`/api/v1/statements/wrongid`)
      .set({ Authorization : `Bearer ${token}` })

      expect(response.status).toEqual(404)

    })

    it("Should not be able to get statement operation with a non existing user", async () => {

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

        const operation = await request(app).post("/api/v1/statements/deposit")
          .send({
            description : "deposit",
            amount : 1200 ,
            type : OperationType.DEPOSIT
          })
          .set({ Authorization : `Bearer ${token}` })

          const response = await request(app).post(`/api/v1/statements/${operation.body.id}`)
          .set({ Authorization : `Bearer ${token}` })

          expect(response.status).toEqual(401)

    })


})
