import { socket } from "@/lib/socket";
import useAuthUserStore from "@/stores/useAuthUserStore";
import { createContext, useContext, useEffect, useRef } from "react";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(socket);
  const { authUser } = useAuthUserStore();

  useEffect(() => {
    if (authUser) {
      socketRef.current.connect();
    } else {
      socketRef.current.disconnect();
    }
    return () => {
      socketRef.current.disconnect();
    };
  }, [authUser]);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};
