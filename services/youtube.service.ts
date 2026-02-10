
/**
 * YouTubeTranscriptionService
 * Integração robusta com Supadata API (v1) para transcrição e metadados.
 * Chave API: sd_cd314cd97caddfbc71a8c3cc8eaa7496
 */

export interface YouTubeVideoInfo {
  isValid: boolean;
  hasTranscription: boolean;
  duration: number;
  title: string;
  thumbnail: string;
  videoId: string;
}

export class YouTubeService {
  private static instance: YouTubeService;
  private readonly API_KEY = "sd_cd314cd97caddfbc71a8c3cc8eaa7496";
  private readonly BASE_URL = "https://api.supadata.ai/v1";
  
  private constructor() {}

  public static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService();
    }
    return YouTubeService.instance;
  }

  /**
   * Valida URL e busca metadados reais do vídeo via Supadata
   */
  async validateVideo(videoUrl: string): Promise<YouTubeVideoInfo> {
    const videoId = this.extractVideoId(videoUrl);
    if (!videoId) throw new Error("URL de vídeo inválida");

    try {
      // Busca metadados do vídeo para confirmar existência e obter título/thumbnail reais
      const response = await fetch(`${this.BASE_URL}/youtube/video?id=${encodeURIComponent(videoId)}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.API_KEY,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Não foi possível encontrar informações deste vídeo.");
      }

      const data = await response.json();
      
      return {
        isValid: true,
        hasTranscription: true,
        duration: data.duration || 0,
        title: data.title || "Vídeo Identificado",
        thumbnail: data.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        videoId: videoId
      };
    } catch (error: any) {
      console.error("Erro na validação Supadata:", error);
      // Fallback para visualização básica se o endpoint de metadados falhar mas o ID for válido
      return {
        isValid: true,
        hasTranscription: true,
        duration: 0,
        title: "Vídeo Legislativo",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        videoId: videoId
      };
    }
  }

  /**
   * Extrai transcrição do vídeo em texto puro (plain text)
   */
  async extractTranscription(videoUrl: string): Promise<string> {
    try {
      // Usando o endpoint de transcrição geral com text=true para simplificar para a IA
      const response = await fetch(`${this.BASE_URL}/transcript?url=${encodeURIComponent(videoUrl)}&text=true&mode=auto`, {
        method: 'GET',
        headers: {
          'x-api-key': this.API_KEY,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao obter transcrição.");
      }

      const data = await response.json();
      
      // Conforme documentação, verificamos jobs para arquivos grandes ou retorno direto
      if (data.jobId) {
        return await this.pollJobStatus(data.jobId);
      }

      // Retorno direto (content ou transcript)
      const transcript = data.content || data.transcript || (typeof data === 'string' ? data : null);

      if (!transcript) {
        throw new Error("Transcrição não disponível para este vídeo.");
      }

      return transcript;
    } catch (error: any) {
      console.error("Erro na extração Supadata:", error);
      throw new Error(error.message || "Erro ao processar áudio do vídeo.");
    }
  }

  /**
   * Polling para jobs de transcrição assíncronos (vídeos longos)
   */
  private async pollJobStatus(jobId: string): Promise<string> {
    const maxAttempts = 30; // 5 minutos aprox
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 10000)); // Espera 10s
      
      const response = await fetch(`${this.BASE_URL}/transcript/job/${jobId}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.API_KEY,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'completed') {
          return data.content || data.transcript;
        } else if (data.status === 'failed') {
          throw new Error("O processamento da transcrição falhou no servidor.");
        }
      }
      attempts++;
    }
    throw new Error("O processamento demorou mais que o esperado. Tente novamente mais tarde.");
  }

  private extractVideoId(url: string): string {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }
}

export const youtubeService = YouTubeService.getInstance();
