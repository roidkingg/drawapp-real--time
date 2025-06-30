import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    console.log("Attempting to verify token with secret:", JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      console.log("Token decoded as string, expected object");
      return null;
    }

    if (!decoded || !decoded.userId) {
      console.log("Token missing userId:", decoded);
      return null;
    }

    console.log("Token verified successfully for user:", decoded.userId);
    return decoded.userId;
  } catch(e) {
    console.log("JWT verification failed:", e);
    return null;
  }
  return null;
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    console.log("No URL in request");
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  console.log("Received token:", token);
  
  const userId = checkUser(token);
  console.log("User ID from token:", userId);

  if (userId == null) {
    console.log("Invalid token, closing connection");
    ws.close()
    return null;
  }

  console.log("User authenticated successfully:", userId);
  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
    }

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.room);
    }

    console.log("message received")
    console.log(parsedData);

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId: Number(roomId),
          message,
          userId
        }
      });

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))
        }
      })
    }

  });

});

