import { createServer } from "http";
import express from 'express';
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Server } from 'socket.io';

// Port du serveur Express (par exemple, 3000)
const port = 3000;
const app = express();
const serverHttp = createServer(app);

// Configuration de Socket.io avec CORS
const io = new Server(serverHttp, {
  cors: {
    origin: "http://localhost:5173",  
    methods: ["GET", "POST"]
  }
});

// Chemin du fichier serveur en cours d'exécution
const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

// Middleware pour servir les fichiers statiques
app.use(express.static(join(__dirname, "../dist")));

// Écoute de l'événement connection
io.on('connection', (socket) => {
  console.log("Nouvelle connexion", socket.id);

  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', { data });
  });
});

// Route d'accueil
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, "../dist", "index.html"));
});

// Lancer le serveur sur le port 3000
serverHttp.listen(port, () => {
  console.log(`Le serveur tourne sur le port ${port}`);
});
