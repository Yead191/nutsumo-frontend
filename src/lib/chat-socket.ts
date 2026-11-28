"use client";

import Cookies from "js-cookie";
import { io, type Socket } from "socket.io-client";

/** Event names; must match the backend's CHAT_EVENTS. */
export const CHAT_EVENTS = {
  MESSAGE: "chat:message",
  CONVERSATION_UPDATED: "chat:conversation",
  READ: "chat:read",
  TYPING: "chat:typing",
} as const;

let socket: Socket | null = null;
let socketUrl: string | null = null;
let users = 0;

/**
 * Shared, authenticated chat socket. The backend puts each authenticated
 * socket in a private `user:<id>` room, so only our own chat events arrive.
 * Call the returned release() when the component unmounts.
 */
export function acquireChatSocket(url: string): { socket: Socket; release: () => void } {
  if (!socket || socketUrl !== url) {
    socket?.disconnect();
    socketUrl = url;
    socket = io(url, {
      // websocket-only: the API runs as a multi-process cluster without sticky sessions.
      transports: ["websocket"],
      auth: (cb) => cb({ token: Cookies.get("accessToken") }),
    });
  }
  users += 1;
  const current = socket;
  return {
    socket: current,
    release: () => {
      users -= 1;
      if (users <= 0 && socket === current) {
        current.disconnect();
        socket = null;
        socketUrl = null;
        users = 0;
      }
    },
  };
}
