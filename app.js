const Koa = require("koa");
const KoaRouter = require("koa-router");
const path = require("path");
const render = require("koa-ejs");
const bodyParser = require("koa-bodyparser");
const bcrypt = require("bcrypt");

const app = new Koa();
const router = new KoaRouter();

// Temp DB
const maths = [];
const users = [
  {
    username: "testUser",
    password: "password1234"
  }
];
let loginMessage = "";

// Render Setup
render(app, {
  root: path.join(__dirname, "views"),
  layout: "layout",
  viewExt: "html"
});

app.use(bodyParser());

// Routes
router.get("/", index);
router.get("/math", math);
router.post("/math", addMath);
router.get("/auth", auth);
router.post("/auth", checkAuth);

// "/" render function
async function index(ctx) {
  await ctx.render("index", {
    title: "Hello World!"
  });
}

// "/math" render function
async function math(ctx) {
  await ctx.render("math", {
    title: "Math Solver",
    maths: maths
  });
}

// "math" POST function
async function addMath(ctx) {
  const body = ctx.request.body;
  let answer = body.mathProblem + " = " + eval(body.mathProblem);
  maths.push(answer);
  ctx.redirect("/math");
}

// "/auth" render function
async function auth(ctx) {
  await ctx.render("auth", {
    title: "Login",
    loginMessage: loginMessage
  });
}

// "/auth" POST function
async function checkAuth(ctx) {
  const { username, password } = ctx.request.body;
  for(let i = 0; i < users.length; i++){
    console.log(ctx.body)
      // check if username exists in the "DB"
      if(users[i].username === username) {
        const matches = await bcrypt.compare(password, username.passwordHash)
        // if password matches return status 201
        if (matches) {
            ctx.status = 201;
            loginMessage = "Login Succesful";
            return ctx.body = { title: 'Login Succesful', status: 201 };
        } else {
          // password doesn't match send status 401
            ctx.status = 401
            loginMessage = "Password does not match";
            return ctx.body = { errors: [{ title: 'Password does not match', status: 401 }]};
            }
      } else {
        // username not in "DB" return status 401 
        ctx.status = 401;
        loginMessage = "User not found";
        return ctx.body = { errors: [{ title: 'User not found', status: 401 }]};
      }
    }
}

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log("server started"));
