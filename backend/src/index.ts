import express from "express";
import cors from "cors";
import userRoutes from "./login/user.js";
import modelCallRoutes from "./modelCall/modelcall.js";

const app = express();
app.use(express.json());
app.use(cors());


app.use(`/v1/user`, userRoutes);

app.use(`/v1/model`, modelCallRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

export default app;