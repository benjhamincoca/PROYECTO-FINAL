# INFORME FINAL DE PROYECTO  
## Arkanoid (Breakout) – Control Híbrido con Dobot MG400

### Universidad Católica Boliviana  
**Proyecto Final – Programación I**  
**Fecha de Presentación:** 12 de diciembre de 2025  

**Docente:** [Eddy Escalante Ustariz]  
**Integrantes:**  
- [Benjhamin Coca Galarza.]  
- [Miguel Angel Castedo Galarza.]

---

## 1. Introducción

El presente informe describe el desarrollo del proyecto final de la materia Programación I: una implementación completa del videojuego Arkanoid (Breakout) utilizando JavaScript y HTML5 Canvas. El objetivo consistió en construir un videojuego funcional, estable y modular, incorporando Programación Orientada a Objetos (POO) y principios de diseño robustos.

Como característica distintiva, el proyecto integra un sistema de control híbrido, donde el robot Dobot MG400 actúa como controlador físico para iniciar y reiniciar el juego mediante la simulación de una pulsación de tecla. Este enfoque permitió vincular software con un entorno robótico real, validando conceptos de interacción hombre-máquina y automatización.

---

## 2. Desarrollo del Proyecto

### 2.1 Arquitectura y Funcionalidad

El sistema se construyó bajo una arquitectura POO, con clases especializadas en las responsabilidades centrales del juego:

| Clase | Responsabilidad |
|-------|------------------|
| **Game** | Motor principal, control de estados (isPaused, lives, score), gestión de niveles y condiciones de victoria. |
| **Ball** | Física de movimiento, colisiones y rebotes. |
| **Paddle** | Movimiento horizontal y colisión con la pelota. |
| **Matrix** | Gestión inmutable de mapas y estructuras de ladrillos. |
| **SoundManager** | Reproducción de audio simultáneo mediante clonación de nodos. |

---

### 2.2 Integración con el Dobot MG400

El proyecto incorpora un mecanismo de control híbrido que combina:

- Captura de eventos del teclado (tecla ENTER) en el frontend.
- Simulación física de dicha pulsación mediante el robot Dobot MG400, programado en DobotStudio Pro.

**Funciones controladas por el Dobot:**

1. **Lanzamiento de la Pelota (Inicio)**  
   - Condición: `isStuck = true` y `lives > 0`.  
   - Acción: Dobot presiona ENTER → `ball.launch()`.

2. **Reinicio del Juego (Game Over)**  
   - Condición: `lives <= 0`.  
   - Acción: Dobot presiona ENTER → `resetGame()`.

Este mecanismo valida la conexión efectiva entre un videojuego web y un sistema robótico externo.

---

### 2.3 Desafíos Técnicos y Soluciones Implementadas

#### 2.3.1 Mutación del Estado del Mapa

**Problema:**  
Los mapas originales (`this.allMaps`) se dañaban al avanzar niveles debido a copias superficiales.

**Causa:**  
Mutación de objetos anidados.

**Solución:**  
Copia profunda estricta al cargar niveles:

```javascript
this.mapMatrix.fillFromArray(JSON.parse(JSON.stringify(this.allMaps[this.currentLevel])));
