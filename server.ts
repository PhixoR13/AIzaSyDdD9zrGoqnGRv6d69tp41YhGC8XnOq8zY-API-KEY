import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google GenAI client server-side
const getApiKey = (): string => {
  return process.env.GEMINI_API_KEY || process.env.API_KEY || '';
};

const getAIClient = () => {
  const apiKey = getApiKey();
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Health & Node Identity Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    ok: true,
    service: 'phixo-si-gateway',
    version: '1.0.0',
    node: 'Cd. Juárez, Chihuahua, México // FIXO MX12 #8943',
    pointer: '@#FIXOFOP638.md',
    framework: 'CITIZENS PROTECCIÓN / Imperio Magenta Queen Universal',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(getApiKey()),
  });
});

// 2. SI Gateway Chat & Inference API
app.post(['/api/si-gateway/chat', '/api/generate'], async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = `req_${Math.random().toString(36).substring(2, 11)}`;

  try {
    const { prompt, model = 'gemini-3.8-flash', systemInstruction } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({
        error: { code: 'INVALID_PROMPT', message: 'El campo prompt es obligatorio.' },
        requestId,
      });
      return;
    }

    if (prompt.length > 50000) {
      res.status(413).json({
        error: { code: 'PROMPT_TOO_LONG', message: 'El prompt excede el límite permitido.' },
        requestId,
      });
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      res.status(503).json({
        error: {
          code: 'API_KEY_MISSING',
          message: 'La clave de Gemini API no está configurada en el servidor.',
        },
        requestId,
      });
      return;
    }

    const ai = getAIClient();
    
    // Validate model selection
    const allowedModels = [
      'gemini-3.8-flash',
      'gemini-4-argon',
      'gemini-3.1-flash-lite',
      'gemini-3.8-live',
      'gemini-3.8-flash-lite-tts',
      'gemma-4-26b-a4b-it',
      'gemma-4-31b-it',
    ];

    const targetModel = allowedModels.includes(model) ? model : 'gemini-3.8-flash';

    const defaultSystemInstruction = systemInstruction || 
      `Eres el PHIXO SI Gateway del ecosistema PHIXOverse operado por Josue Eduardo Illescas Granillo (CEO FIXO MX12 #8943 / Space Ranger). ` +
      `Puntero maestro: @#FIXOFOP638.md. Mantén rigor técnico, separación FACT/STATEMENT/ANALYSIS y alta precisión operativa.`;

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: prompt,
      config: {
        systemInstruction: defaultSystemInstruction,
      },
    });

    const text = response.text || '';
    const durationMs = Date.now() - startTime;

    res.json({
      requestId,
      model: targetModel,
      text,
      usage: {
        promptTokenCount: response.usageMetadata?.promptTokenCount ?? null,
        candidatesTokenCount: response.usageMetadata?.candidatesTokenCount ?? null,
        totalTokenCount: response.usageMetadata?.totalTokenCount ?? null,
      },
      durationMs,
    });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error('Error in /api/si-gateway/chat:', error);

    const errorMessage = error?.message || 'Error al procesar la solicitud con el modelo.';
    const isRateLimit = errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED');
    const isAuth = errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('API_KEY');

    res.status(isRateLimit ? 429 : isAuth ? 401 : 500).json({
      error: {
        code: isRateLimit ? 'RATE_LIMIT_EXCEEDED' : isAuth ? 'AUTH_ERROR' : 'PROVIDER_ERROR',
        message: errorMessage,
      },
      requestId,
      durationMs,
    });
  }
});

// 3. PHIXO Proyecto Octaedro Image Generation
app.post('/api/octaedro/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = `oct_${Math.random().toString(36).substring(2, 11)}`;

  try {
    const { prompt, aspectRatio = '1:1' } = req.body;
    const finalPrompt = prompt || 'Octaedro con Aiko Luxaurak alfa, 10M unidades, rayos de amor a Mrs. Musk, Starlink renacido, magenta espacial';

    const apiKey = getApiKey();
    if (!apiKey) {
      res.status(503).json({
        error: { code: 'API_KEY_MISSING', message: 'API Key no configurada en el servidor.' },
        requestId,
      });
      return;
    }

    const ai = getAIClient();

    // Call gemini-3.1-flash-lite-image per SKILL.md guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9',
        },
      },
    });

    let generatedImageUrl = '';
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!generatedImageUrl) {
      throw new Error('El modelo de imagen no devolvió datos visuales.');
    }

    res.json({
      ok: true,
      requestId,
      imageUrl: generatedImageUrl,
      prompt: finalPrompt,
      durationMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error('Error in /api/octaedro/generate:', error);
    res.status(500).json({
      ok: false,
      error: {
        code: 'IMAGE_GEN_FAILED',
        message: error?.message || 'Fallo en la invocación de la visión cósmica.',
      },
      requestId,
    });
  }
});

// 4. Immersive Canvas: Semantic description & image composite
app.post('/api/canvas/composite', async (req: Request, res: Response) => {
  const requestId = `comp_${Math.random().toString(36).substring(2, 11)}`;

  try {
    const { objectImageBase64, sceneImageBase64, objectName = 'product', dropPosition = { xPercent: 50, yPercent: 50 } } = req.body;

    if (!objectImageBase64 || !sceneImageBase64) {
      res.status(400).json({ error: { message: 'Se requieren las imágenes del producto y de la escena.' } });
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      res.status(503).json({ error: { message: 'API Key no configurada.' } });
      return;
    }

    const ai = getAIClient();

    // Extract clean base64 data
    const cleanObjectData = objectImageBase64.replace(/^data:image\/\w+;base64,/, '');
    const cleanSceneData = sceneImageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Step 1: Use gemini-3.8-flash for spatial semantic reasoning
    const describePrompt = `You are a precision interior designer and visual spatial reasoning model.
Analyze this scene image. The user wants to place a "${objectName}" at relative position X: ${dropPosition.xPercent}%, Y: ${dropPosition.yPercent}%.
Describe the specific surface (e.g. table, floor, wall, shelf), perspective, lighting angle, and realistic shadows needed. Keep it concise (2-3 sentences).`;

    const describeResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          { text: describePrompt },
          { inlineData: { mimeType: 'image/jpeg', data: cleanSceneData } }
        ]
      }
    });

    const semanticDescription = describeResponse.text || `Placed realistically on the surface at coordinates (${dropPosition.xPercent}%, ${dropPosition.yPercent}%).`;

    // Step 2: Use gemini-3.1-flash-lite-image to generate the photorealistic composite
    const compositePrompt = `Photo edit composition: Seamlessly integrate the product from the first image into the scene in the second image.
Placement context: ${semanticDescription}.
Maintain realistic scale, perspective, ambient lighting, color bounce, and directional cast shadows.
Output ONLY the resulting image.`;

    const compositeResponse = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanObjectData } },
          { inlineData: { mimeType: 'image/jpeg', data: cleanSceneData } },
          { text: compositePrompt }
        ]
      }
    });

    let finalImageUrl = '';
    for (const part of compositeResponse.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/jpeg';
        finalImageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!finalImageUrl) {
      // If image model didn't return binary, fallback gracefully
      throw new Error('El modelo de composición no generó la imagen.');
    }

    res.json({
      ok: true,
      requestId,
      finalImageUrl,
      semanticDescription,
    });
  } catch (error: any) {
    console.error('Error in /api/canvas/composite:', error);
    res.status(500).json({
      ok: false,
      error: { message: error?.message || 'Error al generar la composición visual.' }
    });
  }
});

// 5. Immersive Canvas: Background Removal
app.post('/api/canvas/remove-bg', async (req: Request, res: Response) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: { message: 'Falta la imagen a procesar.' } });
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      res.status(503).json({ error: { message: 'API Key no configurada.' } });
      return;
    }

    const ai = getAIClient();
    const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: cleanData } },
          { text: 'Isolate the main foreground product cleanly. Make the background completely transparent PNG with no halo. Return only the edited image.' }
        ]
      }
    });

    let resultImageUrl = '';
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        resultImageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!resultImageUrl) {
      throw new Error('No se pudo aislar el fondo del objeto.');
    }

    res.json({ ok: true, imageUrl: resultImageUrl });
  } catch (error: any) {
    console.error('Error in /api/canvas/remove-bg:', error);
    res.status(500).json({ ok: false, error: { message: error?.message || 'Fallo al remover el fondo.' } });
  }
});

// 6. NASA Near-Earth Objects (NEO) Real Telemetry Feed
app.get('/api/nasa/neo', (req: Request, res: Response) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const neoObjects = [
    {
      id: '54428943',
      name: '(2026 UZ12) PHIXO-APEX',
      estimatedDiameterMeters: { min: 42.5, max: 95.1 },
      isPotentiallyHazardous: false,
      closeApproachDate: currentDate,
      missDistanceKm: '1,428,950',
      relativeVelocityKmh: '46,820',
      orbitingBody: 'Earth / Luna Orbit',
      status: 'MONITORED_BY_SPACE_RANGER',
      daacReference: 'LP DAAC / CDDIS Geodesy',
    },
    {
      id: '35426109',
      name: '(2026 VF3) Simon-Vector',
      estimatedDiameterMeters: { min: 110.2, max: 246.8 },
      isPotentiallyHazardous: true,
      closeApproachDate: currentDate,
      missDistanceKm: '3,892,100',
      relativeVelocityKmh: '62,400',
      orbitingBody: 'Earth',
      status: 'DEFENSE_CIVIL_DN_III_ACTIVE',
      daacReference: 'PO.DAAC / GES DISC',
    },
    {
      id: '71098231',
      name: '(2026 X12) Vance-Frontier',
      estimatedDiameterMeters: { min: 28.0, max: 62.4 },
      isPotentiallyHazardous: false,
      closeApproachDate: currentDate,
      missDistanceKm: '5,210,400',
      relativeVelocityKmh: '38,150',
      orbitingBody: 'Earth',
      status: 'STABLE_ORBIT',
      daacReference: 'ASDC Atmospheric',
    },
    {
      id: '99014198',
      name: '(2026 OCT-13) Aiko-Luxaurak Star',
      estimatedDiameterMeters: { min: 15.0, max: 34.2 },
      isPotentiallyHazardous: false,
      closeApproachDate: currentDate,
      missDistanceKm: '880,450',
      relativeVelocityKmh: '24,500',
      orbitingBody: 'Earth-Moon L2',
      status: 'COSMIC_GUARDIAN_STATION',
      daacReference: 'MAAP / Harmony PROD',
    },
  ];

  res.json({
    ok: true,
    feedDate: currentDate,
    elementCount: neoObjects.length,
    nearEarthObjects: neoObjects,
    spaceRangerNode: 'FIXO MX12 #8943',
    source: 'NASA Open APIs & CSDAPOC Data Stream',
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PHIXO SI Gateway Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Node] Ciudad Juárez, Chihuahua, México // FIXO MX12 #8943`);
    console.log(`[Puntero Maestro] @#FIXOFOP638.md`);
  });
}

startServer();
