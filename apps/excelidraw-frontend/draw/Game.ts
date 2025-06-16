import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
    }
  | {
      type: "text";
      x: number;
      y: number;
      value: string;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";

  private currentPencilPath: { x: number; y: number }[] = [];

  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;

    this.init();
    this.initHandlers();
    this.initMouseHandlers();
    this.initUndoHandler(); // 🆕
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  initUndoHandler() {
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "z") {
        this.existingShapes.pop(); // remove last shape
        this.clearCanvas();
      }
    });
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "white";
    this.ctx.font = "16px Arial";

    this.existingShapes.forEach((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          Math.abs(shape.radius),
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil") {
        if (shape.points.length < 2) return;
        this.ctx.beginPath();
        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "text") {
        this.ctx.fillText(shape.value, shape.x, shape.y);
      }
    });
  }

  mouseDownHandler = (e: MouseEvent) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    this.clicked = true;
    this.startX = mouseX;
    this.startY = mouseY;

    if (this.selectedTool === "pencil") {
      this.currentPencilPath = [{ x: mouseX, y: mouseY }];
    } else if (this.selectedTool === "text") {
      // Create input box at cursor position
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Enter text...";
      input.style.position = "fixed";
      input.style.left = `${mouseX}px`;
      input.style.top = `${mouseY}px`;
      input.style.zIndex = "1000";
      input.style.fontSize = "16px";

      document.body.appendChild(input);
      input.focus();

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const value = input.value;
          document.body.removeChild(input);

          if (!value) return;

          const shape: Shape = {
            type: "text",
            x: mouseX,
            y: mouseY,
            value: value,
          };

          this.existingShapes.push(shape);
          this.socket.send(
            JSON.stringify({
              type: "chat",
              message: JSON.stringify({ shape }),
             roomId: Number(this.roomId),
            })
          );
          this.clearCanvas();
        }
      });
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    if (this.selectedTool === "rect" || this.selectedTool === "circle") {
      this.clearCanvas();

      const width = mouseX - this.startX;
      const height = mouseY - this.startY;

      if (this.selectedTool === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (this.selectedTool === "circle") {
        const radius = Math.max(width, height) / 2;
        const centerX = this.startX + radius;
        const centerY = this.startY + radius;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    } else if (this.selectedTool === "pencil") {
      const point = { x: mouseX, y: mouseY };
      this.currentPencilPath.push(point);
      this.clearCanvas();

      this.ctx.beginPath();
      this.ctx.moveTo(this.currentPencilPath[0].x, this.currentPencilPath[0].y);
      for (let i = 1; i < this.currentPencilPath.length; i++) {
        this.ctx.lineTo(this.currentPencilPath[i].x, this.currentPencilPath[i].y);
      }
      this.ctx.stroke();
      this.ctx.closePath();
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;
    let shape: Shape | null = null;

    if (this.selectedTool === "rect") {
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
    } else if (this.selectedTool === "circle") {
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      const radius = Math.max(width, height) / 2;
      shape = {
        type: "circle",
        centerX: this.startX + radius,
        centerY: this.startY + radius,
        radius,
      };
    } else if (this.selectedTool === "pencil") {
      if (this.currentPencilPath.length > 1) {
        shape = {
          type: "pencil",
          points: this.currentPencilPath,
        };
      }
      this.currentPencilPath = [];
    }

    if (!shape) return;

    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
      })
    );
    this.clearCanvas();
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
