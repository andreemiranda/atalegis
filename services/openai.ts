
import { GoogleGenAI, Type } from "@google/genai";

export const generateLegislativeMinute = async (prompt: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Você é um Consultor Jurídico e Redator Oficial de Câmaras Municipais.
    Sua tarefa é transformar relatos, anotações ou links de sessões em uma ATA LEGISLATIVA FORMAL.
    
    DIRETRIZES DE REDAÇÃO:
    1. Use o tempo verbal pretérito perfeito (ex: "O senhor presidente declarou...").
    2. Formalidade absoluta: use pronomes de tratamento adequados (Excelentíssimo, Nobre Vereador).
    3. Estrutura: Abertura, Verificação de Quórum, Leitura Bíblica, Pequeno Expediente, Ordem do Dia (Votações) e Encerramento.
    4. Se o input for um link, simule os dados baseando-se em sessões parlamentares padrão caso não consiga acessar o conteúdo em tempo real.
    
    RETORNO: EXCLUSIVAMENTE JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
            do_que_para_constar: { type: Type.STRING, description: "Texto de fechamento padrão: 'Do que para constar, eu, secretário, lavrei a presente ata...'" },
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
    throw new Error("Erro ao processar inteligência artificial. Tente reduzir o tamanho do texto ou verificar a conexão.");
  }
};
