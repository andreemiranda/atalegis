
export interface MateriaLegislativa {
  titulo: string;
  autor: string;
  descricao: string;
  justificativa: string;
  resultado: string;
  debates?: { vereador: string; fala: string }[];
}

export interface Orador {
  orador: string;
  relato: string;
}

export interface MinuteData {
  reuniao_numero: string;
  sessao_numero: string;
  camara_nome: string;
  cidade_estado: string;
  data_extenso: string;
  data_numerica: string;
  hora_extenso: string;
  hora_numerica: string;
  local: string;
  vereadores_presentes: string[];
  municipes_presentes: string[];
  presidente_nome: string;
  secretario_nome: string;
  leitura_biblica_nome: string;
  leitura_biblica_passagem: string;
  ata_anterior_aprovacao: string;
  pequeno_expediente: Orador[];
  materias_legislativas: MateriaLegislativa[];
  grande_expediente: { orador: string; fala: string }[];
  encerramento_horario: string;
  data_assinatura: string;
}

export interface UserProfile {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}
