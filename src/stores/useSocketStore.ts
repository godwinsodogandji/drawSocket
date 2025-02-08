import { defineStore } from "pinia";
import { Socket, io } from "socket.io-client";

export const useSocketStore = defineStore("socket", {
  state: () => ({
    socket: null as Socket | null,
  }),
  actions: {
    connect() {
      this.socket = io("http://localhost:3000");
      this.socket.on("connect", () => {
        console.log("connected");
      });
      // Lorsque la connexion est établie
      this.socket.on("connect", () => {
        console.log("Connecté au serveur avec l'ID:", this.socket?.id);
      });
    },

    sender(event: string, data: any) {
      if (!this.socket) return;
      this.socket.emit(event, data);
    },

    // Recevoir un message
    receiveMessage(callback: (msg: any) =>void) {
      if (!this.socket) return;

      // Écouter l'événement 'chat-message' pour récupérer les messages envoyés par les autres clients
      this.socket.on("chat-message", (msg) => {
        callback(msg); 
      });
    },
  },
});
