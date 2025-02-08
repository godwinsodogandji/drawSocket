<template>
  <div class="relative h-full">
    <!-- Canvas -->
    <canvas
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseout="stopDrawing"
      ref="canvasRef"
      class="w-full h-full"
    ></canvas>

    <!-- Icône du message, positionnée en bas à droite -->
    <div
      class="absolute bottom-0 right-0 z-10 cursor-pointer"
      @click="toggleChat"
    >
      <MessageSquareText :size="50" />
    </div>

    <!-- Modal de Chat, affiché uniquement si isChatVisible est vrai -->
    <div
      v-if="isChatVisible"
      class="absolute flex justify-center items-center z-20 inset-0"
    >
      <!-- Arrière-plan semi-transparent qui couvre seulement le canvas -->
      <div class="bg-gray-800 bg-opacity-50" @click="toggleChat"></div>

      <!-- Contenu du Modal (chat) avec une taille limitée -->
      <div class="bg-white p-4 w-96 h-96 rounded-lg shadow-lg relative">
        <!-- Bouton de fermeture -->
        <button
          @click="toggleChat"
          class="absolute top-2 right-2 text-lg text-red-500"
        >
          X
        </button>
        <!-- Composant Chat -->
        <ChatComponent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { drawLine } from "@/utils/canvas";
import { useSocketStore } from "@/stores/useSocketStore";
import { useDrawingStore } from "@/stores/useDrawingStore";
import { MessageSquareText } from "lucide-vue-next";
import ChatComponent from "./ChatComponent.vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const lastPoint = ref<{ x: number; y: number } | null>(null);
const drawingStore = useDrawingStore();
const socketStore = useSocketStore();
const isChatVisible = ref(false);
const message = ref("");

// Déclaration du contexte pour l'accès partout
let ctx: CanvasRenderingContext2D | null = null;

// Basculer la visibilité du chat
const toggleChat = () => {
  isChatVisible.value = !isChatVisible.value;
  console.log("toggleChat", isChatVisible.value);
};

// Démarrer le dessin
const startDrawing = (e: MouseEvent) => {
  drawingStore.setIsDrawing(true);
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  lastPoint.value = { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

// Arrêter le dessin
const stopDrawing = () => {
  drawingStore.setIsDrawing(false);
  lastPoint.value = null;
};

// Dessiner
const draw = (e: MouseEvent) => {
  if (!drawingStore.isDrawing) return;
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;
  const rect = canvas.getBoundingClientRect();
  const currentPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  if (!lastPoint.value) return;

  drawLine(
    ctx,
    lastPoint.value,
    currentPoint,
    drawingStore.color,
    drawingStore.lineWidth,
    drawingStore.isEraser
  );

  socketStore.sender("draw", {
    points: [lastPoint.value, currentPoint],
    color: drawingStore.color,
    lineWidth: drawingStore.lineWidth,
    isEraser: drawingStore.isEraser,
  });

  lastPoint.value = currentPoint;
};

onMounted(() => {
  socketStore.connect();
  // Écoute de l'événement draw venant du serveur
  socketStore.socket?.on("draw", ({ points, color, lineWidth, isEraser }) => {
    if (!ctx) return;
    drawLine(ctx, points[0], points[1], color, lineWidth, isEraser);
  });

  socketStore.socket?.on("chat-message", (msg) => {
    // Ajouter le message à l'interface

    console.log("Nouveau message reçu:", msg);
    message.value = msg;
  });

  // Redimensionner le canvas
  const resizeCanvas = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  const canvas = canvasRef.value;
  if (!canvas) return;

  ctx = canvas.getContext("2d"); // Initialiser ctx ici
});
</script>

<style scoped>
.fixed {
  position: fixed;
}

.bg-gray-800 {
  background-color: rgba(0, 0, 0, 0.6);
}

.bg-opacity-50 {
  opacity: 0.5;
}

.z-20 {
  z-index: 20;
}

.cursor-pointer {
  cursor: pointer;
}

/* Animation du modal pour le rendre plus fluide */
@keyframes modalFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-appear {
  animation: modalFadeIn 0.3s ease-out;
}

/* Pour le modal, on peut ajuster la taille ou la position si nécessaire */
</style>
