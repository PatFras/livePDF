const functions = require("firebase-functions");
const { default: render } = require("./server"); // Importa el servidor generado por Astro

exports.ssr = functions.https.onRequest((req, res) => {
  render(req, res);
});
