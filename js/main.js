/**
 * Amaya López Dulce Fernanda | 314195856
 * Lechuga Martinez Jose Eduardo | 314325749
 * Proyecto - Graficación por computadora 2020-2
 */

import { Vector3 } from "./Vector3.js";
import { Vector4 } from "./Vector4.js";
import { Matrix4 } from "./Matrix4.js";
import { Matrix3 } from "./Matrix3.js";

//Definicion del canvas y contexto de dibujo
let canvas = document.getElementById("the_canvas");
const ctx = document.getElementById("the_canvas").getContext("2d");

//Seleccion de el documento
const input = document.querySelector('input[type="file"]');

let verticesAux = []; //Arreglo auxiliar para guardar los vertices del parseo
let vertices = [0]; //Arreglo que guardara los vertices
let caras = []; //Arreglo que guardara las caras
let camara = new Vector3(3, 2, 4); //Define la posicion de la camara
let pi = new Vector3(0, 0, 0); //Definie el punto de interes
let vista = Matrix4.lookAt(camara, pi, new Vector3(0, 1, 0)); //Matriz de vista

// se crea una matriz de proyección de perspectiva con un campo de visión (fov) de 75 grados, una distancia cercana de 0.1 y una lejana de 2000 (unidades)
let matrizProyeccion = Matrix4.perspective(
  (75 * Math.PI) / 180,
  canvas.width / canvas.height,
  0.1,
  2000
);
// se crea una matrix que conjunta las transformaciones de la cámara y de la proyección
let vistaProyeccion = Matrix4.multiply(matrizProyeccion, vista);

/**
 * Esta función en necesaria ya que estamos usando 2D para dibujar los objetos 3D
 * Cuando veamos WebGL esta transformación desaparece, ya que WebGL realiza la transformación automáticamente
 */
function imageTransform(w, h, v) {
  // hay que notar que las coordenadas de los puntos se dividen entre su componente w, lo que es necesario para aplicar de forma completa la transformación de proyección
  return {
    x: ((v.x / v.w) * w) / 2 + w / 2,
    y: ((-v.y / v.w) * h) / 2 + h / 2,
    z: v.z / v.w
  };
}

/**
 * Evento para detectar cambios de archivo
 * y agregar los nuevos datos a sus respectivos
 * arreglos.
 */
input.addEventListener(
  "change",
  function(e) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    const lector = new FileReader();
    lector.readAsText(input.files[0]);

    /**
     * Parser para el archivo
     */
    lector.onload = function() {
      const lineas = lector.result.split("\n"); //Separa el doc por lineas

      lineas.forEach(linea => {
        //REGEX para vertices
        if (
          /v (-)?[0-9]+.[0-9]+ (-)?[0-9]+.[0-9]+ (-)?[0-9]+.[0-9]+/.test(linea)
        ) {
          linea = linea.split(/ /);
          linea.splice(0, 1);
          for (let i = 0; i < linea.length; i++) {
            linea[i] = parseFloat(linea[i]);
          }
          let vector = [linea[0], linea[1], linea[2]];
          verticesAux.push(vector);
        } else {
          //REGEX para caras
          if (
            /f [0-9]+\/([\/]+)?[0-9]+(\/([\/]+)?[0-9]+)? [0-9]+\/([\/]+)?[0-9]+(\/([\/]+)?[0-9]+)? [0-9]+\/([\/]+)?[0-9]+(\/([\/]+)?[0-9]+)?/.test(
              linea
            )
          ) {
            linea = linea.split(/ /);
            linea.splice(0, 1);
            for (let i = 0; i < linea.length; i++) {
              linea[i] = linea[i].split("//");
              linea[i] = parseInt(linea[i]);
            }
            let cara = [linea[0], linea[1], linea[2]];
            caras.push(cara);
          }
        }
      });
      addVertices();
      let vertex;
      ctx.strokeStyle = " rgb(255, 255, 255)";
      ctx.fillRect(10, 10, 100, 100);
      caras.forEach(cara => {
        cara.forEach((vertex_index, index) => {
          // transformamos los vértices con la matriz de vista y proyección, realizando simplemente una multiplicación
          vertex = vistaProyeccion.multiplyVector(vertices[vertex_index]);

          // transformamos los vértices a coordenadas de pantalla para dibujarlos
          vertex = imageTransform(canvas.width, canvas.height, vertex);

          if (index === 0) {
            ctx.moveTo(vertex.x, vertex.y);
          } else {
            ctx.lineTo(vertex.x, vertex.y);
          }
        });

        ctx.closePath();
        ctx.stroke();
      });

      console.log(vertices);
      console.log(caras);
    };
  },
  false
);

/**
 * Funcion que transforma el resultado del parseo a objetos Vector4
 * y los agrega al arreglo vertices
 */
function addVertices() {
  for (let i = 0; i < verticesAux.length; i++) {
    vertices.push(
      new Vector4(verticesAux[i][0], verticesAux[i][1], verticesAux[i][2], 1)
    );
  }
}
