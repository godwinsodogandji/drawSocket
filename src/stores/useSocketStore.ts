import { defineStore } from "pinia";
import {Socket, io} from 'socket.io-client'

export const useSocketStore = defineStore('socket', {
    state: () => ({
        socket: null as Socket | null
    }),
    actions: {
        connect() {
            this.socket = io('http://localhost:3000')
            this.socket.on('connect', () => {
                console.log("connected"); 

            })
        },

        emit(event:string, data: any) {
            if(!this.socket) return;
            this.socket.emit(event, data);
        }
    },

})