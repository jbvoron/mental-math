import "./styles/base.css";
import "./styles/theme.css";

import { initRouter, register, go } from "./app/router";
import { HomeScreen } from "./ui/screens/HomeScreen";
import { GameScreen } from "./ui/screens/GameScreen";
import { ScoreScreen } from "./ui/screens/ScoreScreen";

const root = document.getElementById("app");
if (!root) throw new Error("Missing #app root");

initRouter(root);

register("home", HomeScreen);
register("game", GameScreen);
register("scores", ScoreScreen);

// Entrée par hash si présent, sinon home
const hash = (location.hash || "#home").replace("#", "") as any;
go(hash === "game" || hash === "scores" ? hash : "home");
