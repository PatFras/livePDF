import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute } from 'astro';
import pdf from 'pdf-parse';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase.config';

const outputDir = path.join(process.cwd(), 'public/text');

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (file == null) {
    return new Response('No file found', { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const unit8Array = new Uint8Array(arrayBuffer);
  const fileId = uuidv4(); // Generar un ID único para el archivo
  const filePath = path.join(outputDir, `${fileId}.pdf`);

  await fs.writeFile(filePath, unit8Array);

  const textPath = path.join(outputDir, `${fileId}.txt`);

  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);

    const text = data.text;
    await fs.writeFile(textPath, text, 'utf-8');

    // Subir el archivo PDF a Firebase Storage
    const storageRef = ref(storage, `pdfs/${fileId}.pdf`);
    const pdfFile = new File([unit8Array], `${fileId}.pdf`, { type: 'application/pdf' });

    await uploadBytes(storageRef, pdfFile);
    const url = await getDownloadURL(storageRef);

    return new Response(JSON.stringify({ id: fileId, url, pages: data.numpages }));
  } catch (error) {
    console.error('Error al procesar el PDF:', error);
    return new Response('Error al procesar el PDF', { status: 500 });
  }
};
