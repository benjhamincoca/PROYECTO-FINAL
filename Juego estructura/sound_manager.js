// sound_manager.js

class SoundManager {
    constructor() {
        this.sounds = {};
        this.loadedCount = 0;
        this.totalSounds = 0;
    }

    /** * Carga todos los archivos de sonido en el mapa this.sounds.
     * @param {Object} soundMap - Mapa de nombres y rutas (e.g., { 'bounce': 'assets/bounce.mp3' })
     */
    loadSounds(soundMap) {
        this.totalSounds = Object.keys(soundMap).length;

        for (const name in soundMap) {
            if (soundMap.hasOwnProperty(name)) {
                const audio = new Audio(soundMap[name]);
                
                audio.oncanplaythrough = () => {
                    this.loadedCount++;
                    // Opcional: Agregar lógica para informar cuando todos carguen.
                };

                // Configuración de bucle (útil si hay música de fondo)
                if (name === 'music') {
                    audio.loop = true;
                }
                
                this.sounds[name] = audio;
            }
        }
    }

    /** Reproduce un sonido desde el inicio. */
    playSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            // Reiniciar el sonido (para efectos rápidos como el rebote)
            sound.currentTime = 0; 
            sound.play().catch(e => console.warn(`Error al reproducir ${name}:`, e));
        }
    }
}

// 1. Instancia Global (como hicimos con UIManager)
const soundManager = new SoundManager();

// 2. Mapa de sonidos (Ajusta estas rutas a tus archivos)
const SOUND_MAP = {
    'bounce': 'assets/sound/mov.mp3',      // Rebote de pelota
    'explosion': 'assets/sound/space.mp3',   // Ladrillo resistente (Nivel 2)
    'lose_life': 'assets/sound/cuak.mp3',   // Pelota cae
    'start_game': 'assets/sound/piu.mp3'       // Inicio o lanzamiento
};

// 3. Iniciar la carga
soundManager.loadSounds(SOUND_MAP);