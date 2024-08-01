import { type APIRoute } from "astro";
import { readFile } from 'node:fs/promises';
import { responseSSE } from "../../utils/sse";
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const question = url.searchParams.get('question');

    if (!id) {
        return new Response('Missing id', { status: 400 });
    }

    if (!question) {
        return new Response('Missing question', { status: 400 });
    }

    const txt = await readFile(`public/text/${id}.txt`, 'utf-8');

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
};