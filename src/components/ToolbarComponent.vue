<template>
  <div class="toolbar bg-white rounded-lg shadow-lg p-4 space-y-4">
    <div class="flex gap-2 justify-center">
      <button
        title="Pinceau"
        :class="`cursor-pointer p-2 rounded-full ${
          !drawingStore.isEraser ? 'bg-blue-200' : 'bg-gray-100'
        }`"
        @click="drawingStore.setIsEraser(false)"
      >
        <Paintbrush :size="20" />
      </button>
      <button
        title="Gomme"
        :class="`cursor-pointer p-2 rounded-full ${
          drawingStore.isEraser ? 'bg-blue-200' : 'bg-gray-100'
        }`"
        @click="drawingStore.setIsEraser(true)"
      >
        <Eraser :size="20" />
      </button>
    </div>

    <div v-if="!drawingStore.isEraser" class="space-y-2">
      <label for="" class="text-sm text-gray-700 font-medium block">
        Couleur
      </label>
      <input
        type="color"
        v-model="drawingStore.color"
        @change="drawingStore.setColor(drawingStore.color)"
        id=""
        class="w-full"
      />
    </div>

    <div class="space-y-2">
      <label for="" class="text-sm text-gray-700 font-medium block"
        >Epaisseur</label
      >
      <input
        type="range"
        v-model="drawingStore.lineWidth"
        @change="drawingStore.setLineWidth(drawingStore.lineWidth)"
        min="1"
        max="50"
        id=""
        class="w-full"
      />
    </div>

    <div class="flex flex-col gap-2">
      <button
        class="flex gap-2 justify-center items-center bg-red-200 text-red-600 rounded-md px-3 py-2 cursor-pointer"
        @click="clear"
      >
        <RotateCcw :size="20" />
        Nettoyer
      </button>

      <button
        class="flex gap-2 justify-center items-center bg-blue-200 text-blue-600 rounded-md px-3 py-2 cursor-pointer"
      >
        <Download :size="20" />
        Enregistrer
      </button>
    </div>

    
  </div>
</template>

<script setup lang="ts">
import {Paintbrush, Eraser, RotateCcw, Download} from 'lucide-vue-next';
import { useDrawingStore } from '@/stores/useDrawingStore';
import { clearCanvas } from '@/utils/canvas';
const drawingStore = useDrawingStore();

const clear = () => {
    const canvasElement = document.querySelector('.canvas') as HTMLCanvasElement;

    if(! canvasElement) return;
    const ctx = canvasElement.getContext('2d');

    if(!ctx) return;
    //Appelle de la fonction clearCanvas
    clearCanvas(ctx, canvasElement.width, canvasElement.height);
}
</script>
