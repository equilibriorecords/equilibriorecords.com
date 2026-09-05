export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Mensaje inválido"
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: "Eres Equilibrio AI, el asistente oficial de Equilibrio Records. Equilibrio Records es un sello independiente de música electrónica enfocado en Organic House, Progressive House, Deep House y Downtempo. Hablas con tono elegante, claro y breve. Responde en el mismo idioma del visitante. Preséntate como Equilibrio AI, no como un asistente genérico de Google. Si no sabes algo con certeza, dilo y sugiere consultar la web o escribir a equilibriorecs@gmail.com. No inventes datos privados, contratos, finanzas ni información interna del sello."
              }
            ]
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);

      return res.status(500).json({
        error: "Error al consultar la IA"
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No se recibió una respuesta.";

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error("API error:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}