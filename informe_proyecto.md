# **Proyecto Final de Programación 1**
## **ARKANOID Controlado por el Brazo Robótico DOBOT MG400**

### **Integrantes:**
- Miguel Angel Castedo Terrazas  
- Benjamin Coca Galarza

**Asignatura:** Programación 1  
**Carrera:** Ingeniería Industrial  
**Docente:** Eddy Escalante U.  
**Fecha de presentación:** 12/12/2025  

---

# 2. Introducción

El presente proyecto consiste en el desarrollo del videojuego **ARKANOID**, programado en **JavaScript**, el cual es controlado a través del brazo robótico **DOBOT MG400**.  
El objetivo general es integrar un videojuego con un sistema físico robotizado, demostrando la conexión entre la programación, la automatización y el control mediante hardware externo.

Este proyecto es importante en la materia de Programación 1 porque permite aplicar conceptos fundamentales de lógica de programación, manejo de eventos, interacción hardware–software y diseño de videojuegos. Además, fomenta el aprendizaje práctico mediante la integración de tecnologías reales.

---

# 3. Desarrollo del Proyecto

## 3.1. Diseño del Videojuego

### **Concepto general**
El videojuego ARKANOID consiste en una pelota que rebota dentro de un área de juego y una barra controlada por el jugador. El objetivo es evitar que la pelota caiga por la parte inferior de la pantalla.  
El jugador gana al destruir todos los bloques del nivel y pierde si la pelota cae.

### **Personajes y elementos**
- **Barra del jugador (Paddle):** Controlada mediante las flechas izquierda y derecha.  
- **Pelota:** Se mueve automáticamente con rebotes.  
- **Bloques:** Se destruyen al impactar con la pelota.  
- **Escenario:** Tres niveles con distinta dificultad.

### **Mecánicas del juego**
- El jugador puede mover la barra:
  - ← flecha izquierda  
  - → flecha derecha  
  - La tecla **Espacio** se utiliza para iniciar el juego  

- **Condiciones para ganar:**
  - Destruir todos los bloques del nivel.

- **Condiciones para perder:**
  - Dejar que la pelota caiga al fondo de la pantalla tres veces de forma consecutiva.

### **Descripción de los niveles**
- **Nivel 1:**    
  - Menor cantidad de bloques.  
  - Dificultad baja.  

- **Nivel 2:**    
  - Bloques con disposición diferente.  
  - Requiere mayor precisión y control.  
  - Aumenta la velocidad de la pelota.  

- **Nivel 3:** 
  - Bloques con disposición diferente.  
  - Requiere mayor precisión y control.  
  - Aumenta la velocidad de la pelota.  

---

## 3.2. Herramientas Utilizadas

- **Lenguaje de Programación:** JavaScript  
- **Entorno de Desarrollo:** Visual Studio Code  
- **Bibliotecas/librerías:** HTML5 Canvas, JS estándar  
- **Control Robótico:** DobotStudio Pro (para comunicar el MG400)  
- **Plataformas de colaboración:** GitHub

- La integración cumple el requisito de usar el Dobot como controlador de una funcionalidad, específicamente el Inicio y Reinicio del Juego.

### **Mecanismo Híbrido**

- El código de JavaScript (`game.js` / `initControls`) escucha la tecla **ENTER**.  
- El Dobot está programado en DobotStudio Pro para simular la pulsación de la tecla **ENTER** en un teclado externo mediante movimientos de precisión.

**Acciones controladas por Dobot:**

- **Lanzar la Pelota (Inicio):**  
  Si el juego está en pausa (`isStuck = true` y `lives > 0`), el Dobot presiona **ENTER**, lo que se traduce en `this.ball.launch()`.

- **Reiniciar el Juego:**  
  Si el juego está en *Game Over* (`lives <= 0`), el Dobot presiona **ENTER**, lo que llama a `this.resetGame()`.

---

## 3.3. Integración con el DOBOT MG400

### **Configuración**
- Instalación y conexión mediante **DobotStudio Pro**.  
- Configuración del modo de control y coordenadas del brazo.  
- Calibración del efector para presionar correctamente las teclas del teclado.

### **Interacción con el videojuego**
- El DOBOT controla:
  - Flecha izquierda  
  - Flecha derecha  
  - La tecla **Espacio** para dar inicio al juego

- La jugabilidad depende del tiempo de reacción del brazo robótico.  
- El robot se encargó de mover la barra automáticamente como si fuera un jugador físico.

---

## 3.3.1. Problemas técnicos y soluciones implementadas

### Desafío Técnico: Mutación de Estado Persistente (Data Corruption)
- **Análisis del Problema:**  
  El motor de JavaScript realizaba copia superficial de objetos anidados (matrices de mapas). Al modificar `this.mapMatrix` durante el juego, se modificaba la referencia al array original (`this.allMaps`), impidiendo reinicios correctos.

- **Solución Implementada (Garantía de Inmutabilidad):**  
  Se implementó la **Copia Profunda (Deep Copy)** mediante `JSON.parse(JSON.stringify(...))` al cargar cada nivel. Además, el método `Matrix.fillFromArray` fue reescrito con iteraciones anidadas para asegurar la copia por valor de cada elemento.

### Desafío Técnico: Fallo de Colisión por Velocidad (Tunneling)
- **Análisis del Problema:**  
  La alta velocidad de la pelota combinada con la discretización del tiempo (tasa de frames) hacía que la pelota "saltara" el área de colisión de un borde o ladrillo.

- **Solución Implementada (Reposicionamiento Forzado y Corrección de Trayectoria):**  
  Tras detectar una colisión inminente, la coordenada Y de la pelota se fuerza al borde exacto (`this.y = límite + this.radius`) antes de invertir el vector de velocidad. Esto elimina la ventana de error del tunneling y garantiza un rebote físico preciso.

### Desafío Técnico: Bloqueo del Audio de Alta Frecuencia
- **Análisis del Problema:**  
  `HTMLAudioElement` impone un bloqueo de recurso mientras una instancia de sonido está en reproducción. Llamadas rápidas a `play()` eran ignoradas por el navegador.

- **Solución Implementada (Estrategia de Clonación de Nodos):**  
  Se utilizó `sound.cloneNode(true)` dentro del `SoundManager`. Esta técnica crea una instancia desechable del objeto de audio en cada llamada, permitiendo la reproducción simultánea y superpuesta de múltiples rebotes sin latencia ni bloqueos de recurso.

---

## 3.4. Organización del Trabajo

### **Distribución de tareas**
- **Benjamin Coca Galarza:**
  - Programación del videojuego en JavaScript    
  - Integración inicial del teclado  
  - Configuración del DOBOT MG400  

- **Miguel Angel Castedo Terrazas:**
  - Configuración del DOBOT MG400  
  - Programación del control físico  
  - Informe formato MARKDOWN  

### **Uso de GitHub**
- Repositorio compartido:    
  - https://github.com/benjhamincoca/PROGRAMACION-1-UCB.git — Benjamin subió X commits relacionados con el control robótico.  

---

# 4. Resultados

### **Capturas de pantalla del videojuego**

![Juego funcionando](C:/Users/Miguel Angel Castedo/Downloads/Juego_funcional.jpeg)

![Juego terminado](C:/Users/Miguel Angel Castedo/Downloads/Imagen_juego_terminado.jpeg)

Ilustración de las mecánicas básicas del juego y el diseño de la paleta y los ladrillos.

Muestra la pantalla de Game Over, lista para ser reiniciada por el Dobot.

**Demostración Robótica**

El Robot Dobot MG400 posicionado para ejecutar la acción de la tecla **ENTER**, demostrando el control híbrido del videojuego.

---

# 5. Conclusiones y Lecciones Aprendidas

El proyecto Arkanoid es un éxito técnico que cumple con la totalidad de los requisitos de funcionalidad y demuestra soluciones efectivas a problemas complejos de programación.

## Éxitos Clave y Habilidades Adquiridas:
- **Dominio de la Inmutabilidad:** La solución a la mutación de estado a través del Deep Copy demostró un entendimiento avanzado de la gestión de la memoria y referencias de objetos en JavaScript.
- **Debugging de Sistemas de Baja Frecuencia:** La corrección del tunneling y el bloqueo de audio implicaron pensamiento crítico sobre las limitaciones del entorno (Canvas y HTML Audio).
- **Integración de Sistemas:** La implementación del control del Dobot validó la capacidad de diseñar una capa de software que interactúa de manera confiable con hardware externo.

## Recomendaciones para Futuras Mejoras:
- Introducir Power-ups (ej., extensión de paleta, multibola) mediante objetos que caigan de los ladrillos.
- Migrar el audio a la **Web Audio API** para implementar variaciones dinámicas de pitch y volumen en los rebotes.

---

# 6. Anexos

Esta sección detalla los fragmentos de código más importantes, no solo por su función directa, sino porque resuelven problemas fundamentales de integridad de datos y simulación física.

## A. Solución a la Mutación del Estado (Inmutabilidad)

**Contexto:** Este código en `game.js` previene el fallo de copia superficial. Sin esta línea, cada vez que se destruye un ladrillo, se modifica el mapa original, haciendo que los niveles sean irrecuperables al reiniciar.

```javascript
// Asegura la inmutabilidad de los mapas originales al cargar un nivel.
// 'JSON.parse(JSON.stringify(...))' es la técnica estándar para realizar un Deep Copy
// de estructuras de datos sencillas y romper las referencias de memoria.
this.mapMatrix.fillFromArray(JSON.parse(JSON.stringify(this.allMaps[this.currentLevel])));

// La función playSound() utiliza cloneNode(true) para crear una copia desechable
// del objeto Audio original.
playSound(name) {
    const sound = this.sounds[name];
    if (sound) {
        // Clonación del nodo para reproducción simultánea, reseteando el tiempo a 0.
        const clone = sound.cloneNode(true); 
        clone.currentTime = 0; 
        clone.play().catch(e => {}); // El catch previene errores de promesa no manejada
    }
}

// Fragmento de la función de colisión (hipotético)
if (isCollidingWithTopWall) {
    // 1. Invertir la dirección vertical
    this.vy *= -1; 
    // 2. Reposicionamiento forzado (CRÍTICO)
    // Asegura que la pelota esté exactamente al borde del muro (0 + radio)
    this.y = this.radius; 
}

