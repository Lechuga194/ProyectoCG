/**
 * Amaya López Dulce Fernanda | 314195856
 * Lechuga Martinez Jose Eduardo | 314325749
 * Proyecto - Graficación por computadora 2020-2
 */

import { Vector3 } from "./Vector3.js";
import { Vector4 } from "./Vector4.js";
import { Matrix4 } from "./Matrix4.js";
import { Matrix3 } from "./Matrix3.js";

const ctx = document.getElementById("the_canvas").getContext("2d");
const input = document.querySelector('input[type="file"]');
let vectors = [];
let faces = [];

/**
 * Evento para detectar cambios de archivo
 */
input.addEventListener(
  "change",
  function(e) {
    const reader = new FileReader();
    reader.readAsText(input.files[0]);

    /**
     * Parser para cargar los vertices y caras a sus arreglos
     */
    reader.onload = function() {
      const lineas = reader.result.split("\n");
      lineas.forEach(linea => {
        if (
          /v (-)?[0-9]+.[0-9]+ (-)?[0-9]+.[0-9]+ (-)?[0-9]+.[0-9]+/.test(linea)
        ) {
          linea = linea.split(/ /);
          linea.splice(0, 1);
          for (let i = 0; i < linea.length; i++) {
            linea[i] = parseFloat(linea[i]);
          }
          let vector = [linea[0], linea[1], linea[2]];
          vectors.push(vector);
        } else {
          if (
            /f [0-9]+\/\/[0-9]+ [0-9]+\/\/[0-9]+ [0-9]+\/\/[0-9]+/.test(linea)
          ) {
            linea = linea.split(/ /);
            linea.splice(0, 1);
            for (let i = 0; i < linea.length; i++) {
              linea[i] = linea[i].split("//");
              linea[i] = parseInt(linea[i]);
            }
            let face = [linea[0], linea[1], linea[2]];
            faces.push(face);
          }
        }
      });
    };
  },
  false
);
