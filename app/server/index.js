const mqtt = require("mqtt");
var cron = require("node-cron");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const SSE = require("express-sse");
app.use(cors());
const router = express.Router();
app.use(express.json());
app.use(router);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
const server = http.createServer(app);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    allowedHeaders: ["Authorization"],
  })
);
const host = "182.72.162.13";
const port = "9900";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "iqube",
  password: "Nuttertools@123",
  reconnectPeriod: 1000,
});
app.get("/stream", (req, res) => {
  sse.init(req, res);
});
client.on("connect", () => {
  console.log("connected");
});

const helmet = require("helmet");
app.use(helmet());

const compression = require("compression");
const { response } = require("express");
app.use(compression());
// const { setEngine } = require("crypto");
const sse = new SSE(["dummy data"]);
class Data {
  constructor(machID, db) {
    this.machID = machID;
    this.client = client;
    this.db = db;
    this.cron = cron;
    this.sse = sse;
  }

  subscribeToPieces() {
    this.client.subscribe(`priv/${this.machID}/pieces`);
  }

  subscribeToTime() {
    this.client.subscribe(`priv/${this.machID}/time`);
  }

  listenForPieces() {
    this.subscribeToPieces();
    this.client.on("message", (topic, payload) => {
      if (topic == `priv/${this.machID}/pieces`) {
        this.pieces = payload.toString();
        sse.send(this.pieces, `${this.machID}/piece`);
      }
    });
  }

  listenForTime() {
    this.subscribeToTime();
    this.client.on("message", (topic, payload) => {
      if (topic == `priv/${this.machID}/time`) {
        this.time = payload.toString();
        sse.send(this.time, `${this.machID}/time`);
      }
    });
  }

  async getReport() {
    this.data = 0;
    this.report = [];
    this.piecesNow = 0;
    const snapshot = await this.db.findMany({});
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
      })
    }
    return this.report
  }

  storeRecord() {
    this.listenForPieces();
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

}

const m1 = new Data("mach-1", prisma.mach1);
const m2 = new Data("mach-2", prisma.mach2);
const m3 = new Data("mach-3", prisma.mach3);
const m4 = new Data("mach-4", prisma.mach4);
const m5 = new Data("mach-5", prisma.mach5);
const m6 = new Data("mach-6", prisma.mach6);

const machines = [m1, m2, m3, m4, m5, m6];
machines.map((machine) => {
  machine.listenForPieces();
  machine.listenForTime();
  machine.storeRecord();
});

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
    const refreshToken = req.body.refreshToken;
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
  } catch (error) {}
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
const sendReport = async (req,res)=>{ try {
    let id = req.params.machine
   let data = await machines[(id.slice(id.length - 1)) - 1].getReport();
    res.send(data)
  } catch (error) {
    console.log(error);
  }
};
           
client.on('message',()=>{
 
  sse.send([parseInt(m1.pieces),parseInt(m2.pieces),parseInt(m3.pieces),parseInt(m4.pieces),parseInt(m5.pieces),parseInt(m6.pieces)],"piecesGraph")
  sse.send([parseInt(m1.time),parseInt(m2.time),parseInt(m3.time),parseInt(m4.time),parseInt(m5.time),parseInt(m6.time)],"timeGraph")}
)          
router.get("/users", verifyToken, getUsers);
router.post("/users", Register);
router.post("/login", Login);
router.post("/token", refreshToken);
router.delete("/logout", Logout);
router.post("/report/:machine", sendReport);
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
