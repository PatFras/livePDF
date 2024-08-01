import type { APIRoute } from "astro";
import fs from 'node:fs/promises';
import path from 'node:path';

import {v2 as cloudinary, type UploadApiResponse} from 'cloudinary';
import axios from "axios";
          
cloudinary.config({ 
  cloud_name: 'dqtmqzix9', 
  api_key: '759599397434926', 
  api_secret: import.meta.env.cloudinary_secret 
});

const uploadStream = async (buffer: Uint8Array, options: {
  folder: string,
  ocr?: string,
}): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary
      .uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);      
      }).end(buffer)
    })
};

const uploadTextFileToVercelBlob = async (fileName: string, content: string) => {
  const endpoint = 'https://api.vercel.com/v2/blob';
  const apiKey = import.meta.env.BLOB_READ_WRITE_TOKEN;

  try {
    const response = await axios.post(endpoint, {
      name: fileName,
      content: Buffer.from(content).toString('base64'),
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.url; // URL pública del archivo subido
  } catch (error) {
    console.error('Error al subir el archivo a Vercel Blob:', error);
    throw error;
  }
};

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (file == null) {
    return new Response("No file found", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const unit8Array = new Uint8Array(arrayBuffer);

  const result = await uploadStream(unit8Array, {
    folder: 'pdf',
    ocr: 'adv_ocr'
  });

  const { asset_id: id, secure_url: url, pages, info } = result;

  const data = info?.ocr?.adv_ocr?.data;
  const text = data.map((blocks: { textAnnotations: { description: string }[] }) => {
    const annotations = blocks['textAnnotations'] ?? {}
    const first = annotations[0] ?? {}
    const content = first['description'] ?? ''
    return content.trim()
  }).filter(Boolean).join('\n');

  try {
    // Subir a Vercel Blob
    const txtFileUrl = await uploadTextFileToVercelBlob(`${id}.txt`, text);
    console.log(`Archivo .txt subido a Vercel Blob: ${txtFileUrl}`);

    return new Response(JSON.stringify({ id, url, pages, txtFileUrl }));
  } catch (error) {
    console.error('Error al subir el archivo .txt a Vercel Blob:', error);
    return new Response("Error al subir el archivo de texto.", { status: 500 });
  }
};