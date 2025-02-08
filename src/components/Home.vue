<template>
    <div class="h-screen flex  ">
        <div 
        ref="toolbarRef"
        class="w-[35%]">
            <ToolbarComponent />
        </div>
           
        <div class="flex-1 border-l-2 border-blue-500">
            <CanvasComponent />
        </div>
        <!-- <div class="">
            <ChatComponent />
        </div> -->
    </div>
</template>

<script setup lang="ts">
import ToolbarComponent from './ToolbarComponent.vue';
import CanvasComponent from './CanvasComponent.vue';
import ChatComponent from './ChatComponent.vue';

</script>