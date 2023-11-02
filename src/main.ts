import { Grid } from "./grid/Grid.js"
import { SquareGrid } from "./grid/square/SquareGrid.js"
import { PolarGrid } from "./grid/polar/PolarGrid.js"
import { MazeBuilder } from "./mazes/MazeBuilder.js";
import { BinaryTree } from "./grid/square/maze/BinaryTree.js";
import { SideWinder } from "./grid/square/maze/SideWinder.js";
import { RandomWalk } from "./mazes/RandomWalk.js";
import { Wilson } from "./mazes/Wilson.js";
import { Hybrid } from "./mazes/Hybrid.js";
import { HuntAndKill } from "./mazes/HuntAndKill.js";
import { RecursiveBackTracker } from "./mazes/RecursiveBackTracker.js";

const n_row: number = 10
const n_col: number = 10

const delay = 20

async function build_maze(maze_builder: MazeBuilder, maze: Grid, canvas: HTMLCanvasElement) {
    if (maze_builder.step_maze()) {
        maze = await maze_builder.build_step_maze();
    }
    maze.render(canvas);
}

const canvas_0: HTMLCanvasElement = document.getElementById("maze_canvas_0") as HTMLCanvasElement;
let maze_0 = new PolarGrid(n_row);
const maze_builder_0: MazeBuilder = new HuntAndKill(maze_0);
setInterval(() => {
    build_maze(maze_builder_0, maze_0, canvas_0)
}, delay);

const canvas_1: HTMLCanvasElement = document.getElementById("maze_canvas_1") as HTMLCanvasElement;
let maze_1 = new PolarGrid(n_row);
const maze_builder_1: MazeBuilder = new Hybrid(maze_1);
setInterval(() => {
    build_maze(maze_builder_1, maze_1, canvas_1)
}, delay);

const canvas_2: HTMLCanvasElement = document.getElementById("maze_canvas_2") as HTMLCanvasElement;
let maze_2 = new PolarGrid(n_row);
const maze_builder_2: MazeBuilder = new RandomWalk(maze_2);
setInterval(() => {
    build_maze(maze_builder_2, maze_2, canvas_2)
}, delay);

const canvas_3: HTMLCanvasElement = document.getElementById("maze_canvas_3") as HTMLCanvasElement;
let maze_3 = new PolarGrid(n_row);
const maze_builder_3: MazeBuilder = new Wilson(maze_3);
setInterval(() => {
    build_maze(maze_builder_3, maze_3, canvas_3)
}, delay);

const canvas_4: HTMLCanvasElement = document.getElementById("maze_canvas_4") as HTMLCanvasElement;
let maze_4 = new PolarGrid(n_row);
const maze_builder_4: MazeBuilder = new RecursiveBackTracker(maze_4);
setInterval(() => {
    build_maze(maze_builder_4, maze_4, canvas_4)
}, delay);



