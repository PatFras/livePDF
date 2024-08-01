import { type APIRoute } from "astro";
import axios from "axios";
import { responseSSE } from "../../utils/sse";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const question = url.searchParams.get('question');
  const txtFileUrl = url.searchParams.get('txtFileUrl');

  if (!id || !question || !txtFileUrl) {
    return new Response('Missing id, question, or txtFileUrl', { status: 400 });
  }

  try {
    // Descargar el contenido del archivo de texto desde Vercel Blob
    const response = await axios.get(txtFileUrl);
    const txt = response.data;

    return responseSSE({ request }, async (sendEvent) => {
      try {
        const prompt = `<context>${txt}</context><question>${question}</question>`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        sendEvent(text);
      } catch (error) {
        console.error("Error al obtener la respuesta de Gemini:", error);
        sendEvent("Error al procesar la pregunta.");
      } finally {
        sendEvent("__END__");
      }
    });
  } catch (error) {
    console.error("Error al obtener el archivo de texto:", error);
    return new Response("Error al obtener el archivo de texto.", { status: 500 });
  }
};
