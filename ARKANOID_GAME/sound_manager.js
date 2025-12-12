// sound_manager.js

class SoundManager {
    constructor() {
        this.sounds = {};
        this.loadedCount = 0;
        this.totalSounds = 0;
    }

    /** * Carga todos los archivos de sonido y devuelve una Promesa que
     * se resuelve cuando todos los archivos están listos para reproducirse.
     * @param {Object} soundMap - Mapa de nombres y rutas
     */
    loadSounds(soundMap) {
        this.totalSounds = Object.keys(soundMap).length;

        // ⚠️ DEVOLVER UNA PROMESA ⚠️
        return new Promise((resolve) => {
            if (this.totalSounds === 0) {
                resolve();
                return;
            }

            for (const name in soundMap) {
                if (soundMap.hasOwnProperty(name)) {
                    const audio = new Audio(soundMap[name]);

                    audio.oncanplaythrough = () => {
                        this.loadedCount++;
                        if (this.loadedCount === this.totalSounds) {
                            resolve(); // ¡Todos cargados!
                        }
                    };

                    // Añadir manejo de error para fallos de carga/ruta
                    audio.onerror = (e) => {
                        console.error(`Fallo al cargar el sonido ${name}:`, e);
                        // A pesar del error, contamos como 'intentado' para no bloquear la carga total.
                        this.loadedCount++;
                        if (this.loadedCount === this.totalSounds) {
                            resolve(); 
                        }
                    };
                    
                    if (name === 'music') {
                        audio.loop = true;
                    }
                    
                    this.sounds[name] = audio;
                }
            }
        }); // Fin de la promesa
    }

    /** Reproduce un sonido clonando la instancia para efectos rápidos. */
    // Mantenemos la implementación con cloneNode (asumimos que ya la tienes)
    // sound_manager.js - Método playSound DEFINITIVO

/** * Reproduce un sonido clonando la instancia para evitar bloqueos 
 * en eventos de alta frecuencia (como el rebote).
 */
    playSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            // 1. CLONAR: Crea una copia independiente del objeto Audio.
            const clone = sound.cloneNode(true); 
            
            // 2. RESETEAR: Reinicia la posición a 0 para reproducir desde el inicio.
            clone.currentTime = 0; 
            
            // 3. REPRODUCIR: Inicia la reproducción.
            clone.play().catch(e => {
                // Manejamos el error de Autoplay, si ocurre.
                // console.warn(`Fallo al reproducir ${name} (clon):`, e); 
            });
            
            // (Opcional pero recomendado para limpiar memoria)
            clone.onended = function() {
                clone.remove();
            };
        }
    }
}

// El resto de sound_manager.js (SOUND_MAP y new SoundManager) se mantiene.
// Lo importante es que la llamada a loadSounds debe ser gestionada por app.js.
// 1. Instancia Global (como hicimos con UIManager)
const soundManager = new SoundManager();

// 2. Mapa de sonidos (Ajusta estas rutas a tus archivos)
const SOUND_MAP = {
    'bounce': 'assets/sounds/mov.mp3',      // Rebote de pelota
    'explosion': 'assets/sounds/space.mp3',   // Ladrillo resistente (Nivel 2)
    'lose_life': 'assets/sounds/cuak.mp3',// Pelota cae
    'win_sound': 'assets/sounds/victoria.mp3',
    'start_game': 'assets/sounds/piu.mp3'       // Inicio o lanzamiento
};

// 3. Iniciar la carga
soundManager.loadSounds(SOUND_MAP);