import { GoogleGenAI, Type } from "@google/genai";

export const generateLegislativeMinute = async (prompt: string): Promise<any> => {
  // Use gemini-3-pro-preview for complex reasoning and formal legal documentation generation.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Você é um Consultor Jurídico Sênior e Especialista em Redação Parlamentar.
    Sua missão é converter notas de sessões em ATAS LEGISLATIVAS OFICIAIS com rigor jurídico e extrema formalidade.
    
    DIRETRIZES TÉCNICAS OBRIGATÓRIAS:
    1. LINGUAGEM: Use o pretérito perfeito, voz passiva formal e pronomes de tratamento adequados (Excelentíssimos, Nobres Edis).
    2. ESTRUTURA: Obedeça rigorosamente à sequência: Abertura, Verificação de Quórum, Pequeno Expediente, Ordem do Dia (Votações) e Encerramento.
    3. CONFORMIDADE: O texto deve estar alinhado às normas da ABNT para documentos oficiais e regimentos internos brasileiros.
    4. PRECISÃO: Transcreva as propostas de forma clara, indicando autor e resultado da votação de maneira destacada.
    5. TRANSCRIÇÕES DO YOUTUBE: Se o texto parecer uma transcrição automática, corrija erros de reconhecimento de voz, pontuação e nomes próprios.
    
    IMPORTANTE: O retorno deve ser EXCLUSIVAMENTE um objeto JSON válido seguindo o esquema fornecido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reuniao_numero: { type: Type.STRING },
            sessao_numero: { type: Type.STRING },
            camara_nome: { type: Type.STRING },
            cidade_estado: { type: Type.STRING },
            data_extenso: { type: Type.STRING },
            data_numerica: { type: Type.STRING },
            hora_extenso: { type: Type.STRING },
            hora_numerica: { type: Type.STRING },
            local: { type: Type.STRING },
            vereadores_presentes: { type: Type.ARRAY, items: { type: Type.STRING } },
            municipes_presentes: { type: Type.ARRAY, items: { type: Type.STRING } },
            presidente_nome: { type: Type.STRING },
            secretario_nome: { type: Type.STRING },
            leitura_biblica_nome: { type: Type.STRING },
            leitura_biblica_passagem: { type: Type.STRING },
            ata_anterior_aprovacao: { type: Type.STRING },
            pequeno_expediente: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  orador: { type: Type.STRING },
                  relato: { type: Type.STRING }
                }
              }
            },
            materias_legislativas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  titulo: { type: Type.STRING },
                  autor: { type: Type.STRING },
                  descricao: { type: Type.STRING },
                  justificativa: { type: Type.STRING },
                  resultado: { type: Type.STRING },
                  debates: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        vereador: { type: Type.STRING },
                        fala: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            grande_expediente: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  orador: { type: Type.STRING },
                  fala: { type: Type.STRING }
                }
              }
            },
            encerramento_horario: { type: Type.STRING },
            data_assinatura: { type: Type.STRING }
          },
          required: ["reuniao_numero", "camara_nome", "presidente_nome", "data_extenso"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro Crítico Gemini:", error);
    throw new Error("Falha na geração do documento. Verifique os dados de entrada.");
  }
};