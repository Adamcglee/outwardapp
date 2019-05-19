const Koa = require("koa");
const KoaRouter = require("koa-router");
const path = require("path");
const render = require("koa-ejs");
const bodyParser = require("koa-bodyparser")

const app = new Koa();
const router = new KoaRouter();

// Makeshift DB
const maths = [];

render(app, {
  root: path.join(__dirname, "views"),
  layout: "layout",
  viewExt: "html",
  cache: false,
  debug: false
});

app.use(bodyParser());

// Routes
router.get("/", index);
router.get("/math", math);
router.post("/math", addMath);
router.get("/auth", auth);

async function index(ctx){
    await ctx.render("index", {
        title: "Outward App"
    });
}

async function math(ctx){
    await ctx.render("math", {
        title: "MATHS!",
        maths: maths
    });
}

async function addMath(ctx){
    const body = ctx.request.body;
    let answer = body.mathProblem + " = " + eval(body.mathProblem)
    maths.push(answer);
    ctx.redirect("/math");
}

async function auth(ctx){
    await ctx.render("auth", {
        title: "Auth!"
    });
}

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log("server started"));
