// le store useSocket qui va gérer la connexion au serveur websocket

import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
// import { emit } from "process";
// import type { Socket } from "socket.io-client";
import { ref } from "vue";

export const useSocket = defineStore("Socket", {
  state: () => ({
    socket: null as Socket | null, // Socket.io client
    isConnected: false, // Indicateur de connexion
  }),
  actions: {
    // connection au serveur
    connect() {
      this.socket = io("http://localhost:4000");
      this.socket.on("connect", () => {
        this.isConnected = true;
      });
    },
    emit(event: string, data: any) {
      if (!this.socket) return;
      this.socket.emit(event, data);
    },

    
  },
});
