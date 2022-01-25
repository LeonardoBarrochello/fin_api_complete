
import { OperationType } from "@modules/statements/entities/Statement";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app"


let connection : Connection;

describe("Create statement" , () =>{
    beforeAll(async () => {
      connection = await createConnection();
      await connection.runMigrations();
    });



    afterAll(async () => {
      await connection.dropDatabase()
      await connection.close;
   });
    it("Should be able to create a deposit", async () => {

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

       const response = await request(app).post("/api/v1/statements/deposit")
        .send({
          description : "deposit",
          amount : 1200 ,
          type : OperationType.DEPOSIT
        })
        .set({ Authorization : `Bearer ${token}` })

        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("amount")
    })


    it("Should not be able to create a deposit with a non existing user", async () => {

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

     const response = await request(app).post("/api/v1/statements/deposit")
      .send({
        description : "deposit",
        amount : 1200 ,
        type : OperationType.DEPOSIT
      })
      .set({ Authorization : `Bearer ${token}` })
      expect(response.status).toEqual(401)
    })

    it("Should be able to create a withdraw", async () => {

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

      const response =  await request(app).post("/api/v1/statements/withdraw")
      .send({
          description : "deposit",
          amount : 600 ,
          type : OperationType.WITHDRAW
        })
      .set({ Authorization : `Bearer ${token}` })

      expect(response.body).toHaveProperty("id")
      expect(response.body).toHaveProperty("amount")
      expect(response.body.amount).toEqual(600)
  })


  it("Should not be able to create a withdraw with a non existing user", async () => {

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

    await request(app).post("/api/v1/statements/deposit")
      .send({
        description : "deposit",
        amount : 1200 ,
        type : OperationType.DEPOSIT
      })
    .set({ Authorization : `Bearer ${token}` })

    const response =  await request(app).post("/api/v1/statements/withdraw")
    .send({
        description : "deposit",
        amount : 600 ,
        type : OperationType.WITHDRAW
      })
    .set({ Authorization : `Bearer ${token}` })

    expect(response.status).toEqual(401)

})

// it("Should not be able to create a withdraw with a invalid amount", async () => {

//   await request(app).post("/api/v1/users").send({
//       name : "User name",
//       email: "user@gmail.com",
//       password : "123456"
//     })

//   const responseToken = await request(app).post("/api/v1/sessions").send({
//       email: "user@gmail.com",
//       password: "123456",
//   });

//   const { token } = responseToken.body

//   await request(app).post("/api/v1/statements/deposit")
//     .send({
//       description : "deposit",
//       amount : 600,
//       type : OperationType.DEPOSIT
//     })
//   .set({ Authorization : `Bearer ${token}` })

//   const response =  await request(app).post("/api/v1/statements/withdraw")
//   .send({
//       description : "withdraw",
//       amount : 5000,
//       type : OperationType.WITHDRAW
//     })
//   .set({ Authorization : `Bearer ${token}` })

//   expect(response.status).toEqual(400)

// })


})
