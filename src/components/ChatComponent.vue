<template>
    <div class="flex flex-col h-full bg-white rounded-lg shadow-lg p-4">
      <h1 class="text-xl font-semibold text-gray-800 mb-4 p-2">ChatBot</h1>
  
      <div class="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-lg space-y-2">
        <div v-for="(msg, index) in messages" :key="index" class="flex items-start space-x-2">
          <div class="font-semibold text-blue-600">{{ msg.sender }}:</div>
          <div class="text-gray-700">{{ msg.content }}</div>
        </div>
      </div>
  
      <div class="flex items-center mt-5 space-x-2">
        <input
          type="text"
          v-model="message"
          @keydown.enter="sendMessage"
          placeholder="Tapez votre message..."
          class="w-full p-3 border border-gray-300 rounded-lg"
        />
        <button @click="sendMessage" class="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12l-2 2m0 0l-2-2m2 2V8m0 4H5" />
          </svg>
        </button>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSocketStore } from "@/stores/useSocketStore";

// Liste des messages
const messages = ref([]);

const message = ref("");
const socketStore = useSocketStore();

// Fonction pour envoyer un message
const sendMessage = () => {
  if (message.value.trim()) {
    const newMessage = { sender: "ChatBot", content: message.value };

    // Envoyer le message au serveur via Socket.io
    socketStore.sender("chat-message", newMessage);
    messages.value.push(newMessage);

    message.value = ""; 
  }
};

onMounted(() => {
  // Écouter les messages reçus via le store
  socketStore.receiveMessage((msg) => {
    messages.value.push(msg); 
  });
});
</script>
<style scoped></style>
