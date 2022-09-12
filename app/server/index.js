const mqtt = require("mqtt");
var cron = require("node-cron");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const path = require("path");
// require('dotenv').config({ path: path.resolve(__dirname, '.env') })
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//server creation
app.use(cors());
const router = express.Router();
app.use(express.json());
app.use(router);
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
const server = http.createServer(app);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    allowedHeaders: ["Authorization"],
  })
);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//mqtt configurations
// 182.72.162.13 9900

// Nuttertools @123
const host = "182.72.162.13"; //'10.1.75.125'
const port = "9900"; //'2123'//'2123'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
// creating mqtt client
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "iqube",
  password: "Nuttertools@123", //'iQube@2019',
  reconnectPeriod: 1000,
});

// client.setMaxListeners(0);
// io.setMaxListeners(0);
// client.setMaxListeners(Infinity)
//    var mArr=[]
// io.on('connection',(socket)=>{
//     socket.on('macno', (num) => {
//  mArr=[]
//         for (let i = 0; i < num; i++) {
//             mArr.push(`mach-${i+1}`)
//         }
//         console.log(mArr);
//     })
// })
const helmet = require("helmet");
app.use(helmet());
const compression = require("compression");
app.use(compression());
const SSE = require("express-sse");
const sse = new SSE(["dummy data"]);
sse.send("hello", "eventName");
class Data {
  constructor(machID, db) {
    this.machID = machID;
    this.client = client;
    // this.io = io;
    this.db = db;
    this.cron = cron;
    this.sse = sse;
  }

  connection() {
    this.client.on("connect", () => {
      // console.log("connected");
    });
  }
  subscribeTopieces() {
    this.client.subscribe(`priv/${this.machID}/pieces`);
  }

  subscribeToTime() {
    this.client.subscribe(`priv/${this.machID}/time`);
  }

  getpieces() {
    //  this.subscribeTopieces();
    //  this.client.subscribe(`priv/${this.machID}/pieces`);
    this.client.on("message", (topic, payload) => {
      //console.log("called");
      //  console.log(topic);
      if (topic == `priv/${this.machID}/pieces`)
        this.pieces = payload.toString();
      //   this.time=payload.toString()
    });
    //  this.client.unsubscribe(`priv/${this.machID}/pieces`, console.log("unsubsribe"))
  }
  getTime() {
    this.subscribeToTime();
    this.client.on("message", (topic, payload) => {
      //  console.log("called");
      //  console.log(topic);
      if (topic == `priv/${this.machID}/time`) this.time = payload.toString();
    });

    //  this.client.unsubscribe(`priv/${this.machID}/pieces`, console.log("unsubsribe"))
  }

  async getReport() {
    // Get a database reference to our posts
    this.data = 0;
    this.report = [];
    this.piecesNow = 0;
    const snapshot = await this.db.findMany({});
    // console.log(snapshot)
    if (snapshot.length > 0) {
      var obj = this;
      var time = [
        "8:00",
        "8:30",
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:30",
        "20:00",
        "20:30",
      ];

      time.map(function (timebro) {
        snapshot.map((value) => {
          if (
            new Date(value.createdAt)
              .getHours()
              .toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) +
              ":" +
              new Date(value.createdAt)
                .getMinutes()
                .toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) ==
            timebro
          ) {
            if (value.pieces != 0) {
              obj.data = value.pieces;
              obj.piecesNow = obj.data - obj.piecesNow;
              obj.report.push(obj.piecesNow);
            } else {
              obj.report.push(0);
            }
          }
        });
      });
      // console.log(this.report);
    }
  }

  // PassReacordToReact() {
  //   this.getReport();
  //   this.io.on("connection", (socket) => {
  //     socket.emit("getRecord" + this.machID, this.report);
  //     socket.on(`subscribeToRecord+${this.machID}`, (interval) => {
  //       //console.log('client is subscribing to timer with interval ', interval);
  //     });
  //   });
  // }
  PassReacordToReactBySSE() {
    this.getReport();
      sse.send(this.report,`${this.machID}/report`,);
  }
  storeRecord() {
    this.getpieces();
    this.cron.schedule("30 * * * *", () => {
      if (this.pieces != null && this.pieces != undefined) {
        this.db
          .create({ data: { pieces: this.pieces } })
          .then(async () => {
            await prisma.$disconnect();
          })
          .catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
          });
      } else {
        this.db
          .create({ data: { pieces: 0 } })
          .then(async () => {
            await prisma.$disconnect();
          })
          .catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
          });
      }
    });
  }


  // emmitpieces() {
  //   this.io.on("connection", (socket) => {
  //     socket.on(`subscribeTopieces+${this.machID}`, (interval) => {
  //       setInterval(() => {
  //         this.getpieces();
  //         socket.emit(this.machID + "pieces", this.pieces);
  //         //    console.log(this.machID, this.pieces);
  //         // console.log('func:'+this.getpieces());
  //       }, interval);
  //     });
  //   });
  // }
  emmitPiecesbySSE() {
    // this.io.on("connection", (socket) => {
    // socket.on(`subscribeTopieces+${this.machID}`, (interval) => {
    setInterval(() => {
      this.getpieces();
      sse.send(this.pieces, `${this.machID}/piece`);
      // socket.emit(this.machID + "pieces", this.pieces);
      //    console.log(this.machID, this.pieces);
      // console.log('func:'+this.getpieces());
    }, 1000);
    // });
    // });
  }
  emmitTimebySSE() {
    // this.io.on("connection", (socket) => {
    // socket.on(`subscribeTopieces+${this.machID}`, (interval) => {
    setInterval(() => {
      this.getpieces();
      sse.send(this.pieces, `${this.machID}/time`);
      // socket.emit(this.machID + "pieces", this.pieces);
      //    console.log(this.machID, this.pieces);
      // console.log('func:'+this.getpieces());
    }, 1000);
    // });
    // });
  }
  // emmitTime() {
  //   this.io.on("connection", (socket) => {
  //     socket.on(`subscribeToTime+${this.machID}`, (interval) => {
  //       //console.log('client is subscribing to timer with interval ', interval);
  //       setInterval(() => {
  //         this.getTime();
  //         socket.emit(this.machID + "time", this.time);
  //         //    console.log(this.machID, this.pieces);
  //         // console.log('func:'+this.getpieces());
  //       }, interval);
  //     });
  //   });
  // }
}

const m1 = new Data("mach-1", prisma.mach1);
const m2 = new Data("mach-2", prisma.mach2);
const m3 = new Data("mach-3", prisma.mach3);
const m4 = new Data("mach-4", prisma.mach4);
const m5 = new Data("mach-5", prisma.mach5);
const m6 = new Data("mach-6", prisma.mach6);

m1.subscribeTopieces();
app.get("/stream",sse.init)
// m1.emmitPiecesbySSE()
m2.emmitTimebySSE();
m1.emmitTimebySSE();
m3.emmitTimebySSE();
m4.emmitTimebySSE();
m5.emmitTimebySSE();
m6.emmitTimebySSE();
m1.emmitPiecesbySSE();
m2.emmitPiecesbySSE();
m3.emmitPiecesbySSE();
m4.emmitPiecesbySSE();
m5.emmitPiecesbySSE();
m6.emmitPiecesbySSE();

m2.storeRecord();
m1.storeRecord();
m3.storeRecord();
m4.storeRecord();
m5.storeRecord();
m6.storeRecord();

m2.getReport();
m3.getReport();
m4.getReport();
m5.getReport();
m6.getReport();

m1.PassReacordToReactBySSE();
m2.PassReacordToReactBySSE();
m3.PassReacordToReactBySSE();
m4.PassReacordToReactBySSE();
m5.PassReacordToReactBySSE();
m6.PassReacordToReactBySSE();

server.listen(5000, () => {
  console.log("done dude");
});

const getUsers = async (req, res) => {
  try {
    const users = await prisma.PrithviUser.findMany({
      select: { email: true, id: true },
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await prisma.PrithviUser.create({
      data: { email: email, password: hashPassword, name: name },
    });
    res.json({ msg: "Registration Successful" });
  } catch (error) {
    res.json({ msg: "email already exists" });
  }
};

const Login = async (req, res) => {
  try {
    const user = await prisma.PrithviUser.findMany({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const accessToken = jwt.sign(
      { userId, name, email },
      "process.env.ACCESS_TOKEN_SECRET",
      {
        expiresIn: "15s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      "process.env.REFRESH_TOKEN_SECRET",
      {
        expiresIn: "1d",
      }
    );
    // console.log(refreshToken)
    await prisma.PrithviUser.update({
      where: {
        id: userId,
      },
      data: { refresh_token: refreshToken },
    });
    // res.cookie('refreshToken', refreshToken, {
    //     httpOnly: false,
    //     maxAge: 24 * 60 * 60 * 1000
    // });
    return res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    // console.error(error);
    res.status(404).json({ msg: "Email not found" });
  }
};

const Logout = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader.split(" ")[1];
  //const refreshToken = req.params.refreshToken;
  // console.log(refreshToken);
  if (!refreshToken) return res.sendStatus(204);
  const user = await prisma.PrithviUser.findMany({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await prisma.PrithviUser.update({
    where: {
      id: userId,
    },
    data: { refresh_token: null },
  });
  // res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

const refreshToken = async (req, res) => {
  try {
    // console.log(req.body)
    const refreshToken = req.body.refreshToken;
    // console.log(refreshToken);
    if (!refreshToken) return res.sendStatus(401);
    const user = await prisma.PrithviUser.findMany({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      "process.env.REFRESH_TOKEN_SECRET",
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign(
          { userId, name, email },
          "process.env.ACCESS_TOKEN_SECRET",
          {
            expiresIn: "15s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    // console.log(error);
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader.split(" ")[2];
  // console.log(token);
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, "process.env.ACCESS_TOKEN_SECRET", (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.email = decoded.email;
    next();
  });
};
router.get("/users", verifyToken, getUsers);
router.post("/users", Register);
router.post("/login", Login);
router.post("/token", refreshToken);
router.delete("/logout", Logout);
cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("Running a job end of day timezone");
    await m1.db.deleteMany({});
    await m2.db.deleteMany({});
    await m3.db.deleteMany({});
    await m4.db.deleteMany({});
    await m5.db.deleteMany({});
    await m6.db.deleteMany({});
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
// import express from "express";
// import dotenv from "dotenv";
//import cookieParser from "cookie-parser";
// import cors from "cors";
// import db from "./config/Database.js";
// import router from "./routes/index.js";

// const app = express();

// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.use(cookieParser());
// app.use(express.json());

// app.listen(5000, () => console.log('Server running at port 5000'));

//   async function main(){await prisma.prithviUser.deleteMany({})
// console.log('Server running at http://localhost:')}
// main();
// m1.cron.schedule('29 * * * *', () => {
//     console.log("up time: " + new Date().getMinutes() )
// })
