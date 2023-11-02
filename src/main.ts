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

const n_row: number = 20
const n_col: number = 20


const canvas_0: HTMLCanvasElement = document.getElementById("maze_canvas_0") as HTMLCanvasElement;
let maze_0 = new PolarGrid(n_row);
const maze_builder_0: MazeBuilder = new RecursiveBackTracker(maze_0);

async function build_maze(maze_builder: MazeBuilder, maze: Grid, canvas: HTMLCanvasElement) {
    if (maze_builder.step_maze()) {
        maze = await maze_builder.build_step_maze();
    }
    maze.render(canvas);
}

const delay = 20

setInterval(() => {
    build_maze(maze_builder_0, maze_0, canvas_0)
}, delay);