# INFORME FINAL DE PROYECTO  
## Arkanoid (Breakout) – Implementación con Control Híbrido mediante Dobot MG400

---

## PORTADA

# **UNIVERSIDAD CATÓLICA BOLIVIANA**
## **ARKANOID: CONTROL HÍBRIDO**
### Proyecto Final – Programación I  
**Fecha de Presentación:** 12 de diciembre de 2025  

**Docente:**  
[Nombre del Docente]

**Integrantes:**  
[Nombre Completo del Integrante 1]  
[Nombre Completo del Integrante 2]

---

## 1. Introducción

El presente informe documenta el desarrollo del proyecto final de la asignatura Programación I: la implementación del videojuego clásico **Arkanoid (Breakout)** desarrollado con **JavaScript** y **HTML5 Canvas**, integrando adicionalmente un sistema de control físico mediante el robot **Dobot MG400**.  

El objetivo del proyecto fue demostrar dominio en el diseño de software modular orientado a objetos, la gestión robusta de estados, la resolución de problemas complejos asociados con la física discreta del juego y la integración efectiva entre un sistema digital y un dispositivo robótico real.  

La solución lograda cumple con los requisitos funcionales del videojuego, incorporando estabilidad, precisión en colisiones, correcta reproducción de audio y control híbrido mediante automatización robótica.

---

## 2. Desarrollo del Proyecto

### 2.1 Arquitectura General del Sistema

El videojuego fue desarrollado bajo principios de **Programación Orientada a Objetos (POO)**, asignando responsabilidades específicas a cada clase principal:

| Clase | Descripción de Responsabilidad |
|-------|--------------------------------|
| **Game** | Motor del juego. Gestiona estados globales (pausa, vidas, puntaje), flujo de niveles, win/lose y reinicios. |
| **Ball** | Controla la física de movimiento, detección de colisiones y cálculos de rebote. |
| **Paddle** | Maneja el movimiento del jugador y la colisión con la pelota. |
| **Matrix** | Encapsula la estructura de ladrillos del nivel, garantizando integridad y no mutabilidad. |
| **SoundManager** | Gestiona la reproducción simultánea de efectos sonoros mediante clonación de nodos. |

Este enfoque asegura modularidad, mantenibilidad y menor acoplamiento entre componentes.

---

### 2.2 Integración Robótica con el Dobot MG400

El proyecto implementa un mecanismo de **control híbrido**, donde el Dobot MG400 actúa como controlador mecánico del videojuego, específicamente para:

- **Iniciar la partida (lanzamiento de la pelota)**  
- **Reiniciar el juego (Game Over)**  

#### Flujo del mecanismo:

1. **El videojuego escucha la tecla ENTER** a través de un gestor de eventos en `initControls()`.
2. **El Dobot MG400**, programado en **DobotStudio Pro**, ejecuta movimientos de precisión que presionan físicamente la tecla ENTER en un teclado externo.
3. Según el estado del juego:
   - Si `isStuck = true` y `lives > 0`: se lanza la pelota (`ball.launch()`).
   - Si `lives <= 0`: se reinicia el juego (`resetGame()`).

Este diseño demuestra la interacción entre sistemas digitales y físicos, integrando automatización robótica en un ciclo típico de juego.

---

### 2.3 Desafíos Técnicos y Soluciones Implementadas

El desarrollo enfrentó múltiples problemas característicos del game development y del manejo de estados en JavaScript. A continuación se detallan los desafíos críticos y sus soluciones.

---

#### 2.3.1 Mutación de Estado Persistente en Mapas (Data Corruption)

**Problema:**  
Los niveles originales (`this.allMaps`) eran alterados accidentalmente durante el juego debido a **copias superficiales** de objetos anidados. Esto generaba niveles corruptos al avanzar o reiniciar el juego.

**Causa Técnica:**  
JavaScript copia referencias en estructuras anidadas, afectando directamente el mapa original cuando el jugador destruye ladrillos.

**Solución:**  
Implementación obligatoria de **Copia Profunda (Deep Copy)** al cargar niveles:

```javascript
this.mapMatrix.fillFromArray(JSON.parse(JSON.stringify(this.allMaps[this.currentLevel])));
</div>

2. Introducción

El presente proyecto finaliza el ciclo de Programación 1 con el desarrollo de Arkanoid (Breakout), un clásico videojuego 2D implementado en JavaScript y HTML5 Canvas. El proyecto no solo cumple con los requisitos funcionales de un juego arcade (física, puntuación, niveles), sino que también integra un sistema de control externo a través del Robot Dobot MG400.

El objetivo central fue demostrar la capacidad de diseñar una arquitectura de software robusta, capaz de gestionar estados complejos y fallos de la API (como la mutación de datos y el tunneling de la física), mientras se establece un puente funcional con un componente robótico real.

3. Desarrollo del Proyecto

3.1. Funcionalidad y Arquitectura

El videojuego se basa en un diseño de Programación Orientada a Objetos (POO), con clases dedicadas al manejo de cada componente:

Clase

Responsabilidad

Game

Motor principal, gestión de estado (isPaused, lives, score), Control de Niveles (nextLevel, gameWin).

Ball

Simulación de física y colisiones con bordes y ladrillos.

Paddle

Control de movimiento de la paleta y detección de colisión.

Matrix

Abstracción de la matriz del mapa y gestión de la integridad de datos.

SoundManager

Gestión de la reproducción de audio, implementando la solución de clonación de nodos.

3.2. Integración con el Dobot MG400

La integración cumple el requisito de usar el Dobot como controlador de una funcionalidad, específicamente el Inicio y Reinicio del Juego.

Mecanismo Híbrido:

El código de JavaScript (game.js/initControls) escucha la tecla ENTER.

El Dobot está programado en DobotStudio Pro para simular la pulsación de la tecla ENTER en un teclado externo mediante movimientos de precisión.

Acciones controladas por Dobot:

Lanzar la Pelota (Inicio): Si el juego está en pausa (isStuck = true y lives > 0), el Dobot presiona ENTER, lo que se traduce en this.ball.launch().

Reiniciar el Juego: Si el juego está en Game Over (lives <= 0), el Dobot presiona ENTER, lo que llama a this.resetGame().

3.3. Desafíos Técnicos Críticos y Soluciones

El desarrollo exigió soluciones avanzadas para garantizar la estabilidad y la precisión:

Desafío Técnico

Análisis del Problema

Solución Implementada

Mutación de Estado Persistente (Data Corruption)

El motor de JavaScript realiza copia superficial de objetos anidados (matrices de mapas). Al modificar this.mapMatrix durante el juego, se modificaba la referencia al array original (this.allMaps), impidiendo reinicios correctos.

Garantía de Inmutabilidad: Se implementó la Copia Profunda (Deep Copy) mediante JSON.parse(JSON.stringify(...)) al cargar cada nivel. Además, el método Matrix.fillFromArray fue reescrito con iteraciones anidadas para asegurar la copia por valor de cada elemento.

Fallo de Colisión por Velocidad (Tunneling)

La alta velocidad de la pelota combinada con la discretización del tiempo (tasa de frames) hacía que la pelota "saltara" el área de colisión de un borde o ladrillo, ya que el cálculo de la posición en el siguiente frame la colocaba después del obstáculo.

Reposicionamiento Forzado y Corrección de Trayectoria: Tras detectar una colisión inminente, la coordenada Y de la pelota se fuerza al borde exacto (this.y = límite + this.radius) antes de invertir el vector de velocidad. Esto elimina la ventana de error del tunneling y garantiza un rebote físico preciso.

Bloqueo del Audio de Alta Frecuencia

El objeto HTMLAudioElement impone un bloqueo de recurso mientras una instancia de sonido está en reproducción. Las llamadas rápidas y consecutivas a play() (típicas del rebote) eran ignoradas por el navegador, resultando en una experiencia de audio inconsistente.

Estrategia de Clonación de Nodos: Se utilizó sound.cloneNode(true) dentro del SoundManager. Esta técnica crea una instancia desechable del objeto de audio en cada llamada, permitiendo la reproducción simultánea y superpuesta de múltiples rebotes sin latencia ni bloqueos de recurso.

4. Resultados

Capturas de Pantalla

Ilustración de las mecánicas básicas del juego y el diseño de la paleta y los ladrillos.

Muestra la pantalla de Game Over, lista para ser reiniciada por el Dobot.

Demostración Robótica

El Robot Dobot MG400 posicionado para ejecutar la acción de la tecla ENTER, demostrando el control híbrido del videojuego.

5. Conclusiones y Lecciones Aprendidas

El proyecto Arkanoid es un éxito técnico que cumple con la totalidad de los requisitos de funcionalidad y demuestra soluciones efectivas a problemas complejos de programación.

Éxitos Clave y Habilidades Adquiridas:

Dominio de la Inmutabilidad: La solución a la mutación de estado a través del Deep Copy demostró un entendimiento avanzado de la gestión de la memoria y referencias de objetos en JavaScript, un principio crucial para el desarrollo de software escalable.

Debugging de Sistemas de Baja Frecuencia: La corrección del tunneling y el bloqueo de audio implicaron el pensamiento crítico sobre las limitaciones del entorno (Canvas y HTML Audio) y la aplicación de soluciones específicas para game development.

Integración de Sistemas: La implementación del control del Dobot validó la capacidad de diseñar una capa de software que interactúa de manera confiable con un hardware externo, cumpliendo el objetivo de la robótica educativa.

Recomendaciones para Futuras Mejoras:

Introducir Power-ups (ej., extensión de paleta, multibola) mediante objetos que caigan de los ladrillos.

Migrar el audio a la Web Audio API para implementar variaciones dinámicas de pitch y volumen en los rebotes.

6. Anexos

A. Solución a la Mutación del Estado (Game.js)

// Asegura la inmutabilidad de los mapas originales al cargar un nivel
this.mapMatrix.fillFromArray(JSON.parse(JSON.stringify(this.allMaps[this.currentLevel]))); 


B. Solución de Audio de Alta Frecuencia (SoundManager)

// Clonación del nodo para reproducción simultánea
const clone = sound.cloneNode(true); 
clone.currentTime = 0; 
clone.play().catch(e => {}); 
