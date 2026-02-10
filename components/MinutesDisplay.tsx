
import React, { useRef } from 'react';
import { 
  Box as ChakraBox, Button as ChakraButton, Heading as ChakraHeading, 
  Text as ChakraText, VStack as ChakraVStack, HStack as ChakraHStack, 
  Separator as ChakraSeparator, Flex as ChakraFlex
} from '@chakra-ui/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx';
import saveAs from 'file-saver';

const Box = ChakraBox as any;
const Button = ChakraButton as any;
const Heading = ChakraHeading as any;
const Text = ChakraText as any;
const VStack = ChakraVStack as any;
const HStack = ChakraHStack as any;
const Separator = ChakraSeparator as any;
const Flex = ChakraFlex as any;

interface Props {
  minutes: any;
}

export const MinutesDisplay: React.FC<Props> = ({ minutes }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ata_${minutes.reuniao_numero}_Oficial.pdf`);
    } catch (err) {
      alert("Erro ao gerar PDF oficial.");
    }
  };

  const handleDownloadWord = async () => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "ESTADO DO TOCANTINS", bold: true, size: 24, font: "Times New Roman" }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: (minutes.camara_nome || 'CÂMARA MUNICIPAL').toUpperCase(), bold: true, size: 28, font: "Times New Roman" }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 400 },
              children: [
                new TextRun({ 
                  text: `ATA DA ${minutes.reuniao_numero}ª REUNIÃO DA ${minutes.sessao_numero}ª SESSÃO ORDINÁRIA`, 
                  bold: true, 
                  size: 24, 
                  font: "Times New Roman" 
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { line: 360 },
              children: [
                new TextRun({
                  text: `Ata da ${minutes.reuniao_numero}ª reunião da ${minutes.sessao_numero}ª sessão ordinária da ${minutes.camara_nome} estado do Tocantins. `,
                  font: "Times New Roman",
                  size: 24
                }),
                new TextRun({
                  text: `Aos ${minutes.data_extenso} (${minutes.data_numerica}), às ${minutes.hora_extenso} (${minutes.hora_numerica}), no ${minutes.local}, compareceram os senhores vereadores (as): ${minutes.vereadores_presentes?.join(', ').toUpperCase() || 'NÃO INFORMADO'}. `,
                  font: "Times New Roman",
                  size: 24
                }),
                new TextRun({
                  text: `Compareceram os munícipes: ${minutes.municipes_presentes?.join(', ') || 'nenhum registrado'}. `,
                  font: "Times New Roman",
                  size: 24
                }),
                new TextRun({
                  text: `Havendo o número regimental dos nobres vereadores, o presidente ${minutes.presidente_nome} declarou aberta a reunião, em seguida, convidou o vereador secretário ${minutes.secretario_nome} para secretariá-lo e, na sequência, chamou o vereador ${minutes.leitura_biblica_nome} para fazer a leitura da passagem bíblica (${minutes.leitura_biblica_passagem}). Em seguida, iniciou-se a votação da ata da sessão anterior, que foi ${minutes.ata_anterior_aprovacao}.`,
                  font: "Times New Roman",
                  size: 24
                }),
              ],
            }),
            ...(minutes.pequeno_expediente?.length > 0 ? [
              new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "PEQUENO EXPEDIENTE:", bold: true, font: "Times New Roman", size: 24 })] }),
              ...minutes.pequeno_expediente.map((item: any) => new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { line: 360 },
                children: [
                  new TextRun({ text: `O vereador ${item.orador}: `, bold: true, font: "Times New Roman", size: 24 }),
                  new TextRun({ text: item.relato, font: "Times New Roman", size: 24 })
                ]
              }))
            ] : []),
            ...(minutes.materias_legislativas?.length > 0 ? [
              new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "ORDEM DO DIA (MATÉRIAS LEGISLATIVAS):", bold: true, font: "Times New Roman", size: 24 })] }),
              ...minutes.materias_legislativas.flatMap((m: any) => [
                new Paragraph({
                  spacing: { before: 200 },
                  children: [new TextRun({ text: `${m.titulo} - Autor: ${m.autor}`, bold: true, font: "Times New Roman", size: 24 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: m.descricao, italics: true, font: "Times New Roman", size: 24 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: `Resultado: ${m.resultado}`, bold: true, font: "Times New Roman", size: 24 })]
                })
              ])
            ] : []),
            new Paragraph({
              spacing: { before: 400 },
              alignment: AlignmentType.JUSTIFIED,
              children: [
                new TextRun({ 
                  text: `Não havendo mais assuntos a serem deliberados o senhor presidente, sob a proteção de Deus, declarou encerrada a reunião às ${minutes.encerramento_horario}. Em seguida, foi realizada a lavratura do termo da ata, que, após ser lida e considerada correta, segue assinada pelo Presidente e pelo Secretário.`,
                  font: "Times New Roman",
                  size: 24
                })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 600 },
              children: [new TextRun({ text: `${minutes.cidade_estado}, ${minutes.data_assinatura}.`, font: "Times New Roman", size: 24 })]
            }),
            new Paragraph({ spacing: { before: 800 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1 } }, children: [new TextRun({ text: "PRESIDENTE", bold: true, size: 20, font: "Times New Roman" })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: minutes.presidente_nome, size: 18, font: "Times New Roman" })] })
                      ]
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1 } }, children: [new TextRun({ text: "SECRETÁRIO", bold: true, size: 20, font: "Times New Roman" })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: minutes.secretario_nome, size: 18, font: "Times New Roman" })] })
                      ]
                    })
                  ]
                })
              ]
            })
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Ata_${minutes.reuniao_numero}_Oficial.docx`);
    } catch (error) {
      console.error(error);
      alert("Erro ao exportar documento Word.");
    }
  };

  if (!minutes) return null;

  return (
    <Box w="full" pb={10} className="animate-fade-in">
      <VStack gap={6} align="stretch">
        <Flex 
          justify="space-between" 
          bg="white" 
          p={4} 
          borderRadius="xl" 
          shadow="md" 
          direction={{ base: 'column', sm: 'row' }}
          gap={4}
          align={{ base: 'stretch', sm: 'center' }}
        >
          <Heading size="md" color="blue.700">Visualização do Documento</Heading>
          <HStack gap={2} flexWrap="wrap">
            <Button colorPalette="blue" variant="outline" size={{ base: "sm", md: "md" }} onClick={handleDownloadWord} flex={{ base: 1, sm: 'none' }}>
              Word (.docx)
            </Button>
            <Button colorPalette="blue" size={{ base: "sm", md: "md" }} onClick={handleDownloadPDF} flex={{ base: 1, sm: 'none' }}>
              PDF Oficial
            </Button>
          </HStack>
        </Flex>

        {/* Scrollable Container para Mobile */}
        <Box 
          w="full" 
          overflowX="auto" 
          className="custom-scrollbar"
          p={{ base: 2, md: 4 }}
          bg="gray.100"
          borderRadius="2xl"
        >
          <Box 
            ref={printRef}
            bg="white" 
            p={{ base: "10mm", md: "20mm" }} 
            shadow="xl" 
            w="full"
            minW={{ base: "210mm", md: "auto" }} // Garante proporção A4 no scroll mobile
            maxW="210mm"
            mx="auto"
            className="ata-document"
            fontSize={{ base: "sm", md: "md" }}
          >
            <VStack gap={8} align="stretch">
              <Box textAlign="center" mb={6}>
                <Heading size="md" textTransform="uppercase">Estado do Tocantins</Heading>
                <Heading size="lg" mt={2}>{minutes.camara_nome || 'Câmara Municipal'}</Heading>
                <Separator my={4} borderColor="black" />
              </Box>

              <Text fontWeight="bold" textAlign="center" fontSize={{ base: "lg", md: "xl" }} mb={4}>
                ATA DA {minutes.reuniao_numero}ª REUNIÃO DA {minutes.sessao_numero}ª SESSÃO ORDINÁRIA
              </Text>

              <Text textAlign="justify">
                Ata da {minutes.reuniao_numero}ª reunião da {minutes.sessao_numero}ª sessão ordinária da {minutes.camara_nome} estado do Tocantins. 
                Aos {minutes.data_extenso} ({minutes.data_numerica}), às {minutes.hora_extenso} ({minutes.hora_numerica}), no {minutes.local}, 
                compareceram os senhores vereadores (as): {minutes.vereadores_presentes?.join(', ').toUpperCase() || 'NÃO INFORMADO'}. 
                Compareceram os munícipes: {minutes.municipes_presentes?.join(', ') || 'nenhum registrado'}. 
                Havendo o número regimental dos nobres vereadores, o presidente {minutes.presidente_nome} declarou aberta a reunião, 
                em seguida, convidou o vereador secretário {minutes.secretario_nome} para secretariá-lo e, na sequência, chamou o vereador {minutes.leitura_biblica_nome} para fazer a leitura da passagem bíblica ({minutes.leitura_biblica_passagem}). 
                Em seguida, iniciou-se a votação da ata da sessão anterior, que foi {minutes.ata_anterior_aprovacao}.
              </Text>

              {minutes.pequeno_expediente?.length > 0 && (
                <>
                  <Text fontWeight="bold">PEQUENO EXPEDIENTE:</Text>
                  <Box pl={4}>
                    {minutes.pequeno_expediente.map((item: any, i: number) => (
                      <Text key={i} mb={3} textAlign="justify">
                        <strong>O vereador {item.orador}:</strong> {item.relato}
                      </Text>
                    ))}
                  </Box>
                </>
              )}

              {minutes.materias_legislativas?.length > 0 && (
                <>
                  <Text fontWeight="bold">ORDEM DO DIA (Matérias Legislativas):</Text>
                  <Box pl={4}>
                    {minutes.materias_legislativas.map((m: any, i: number) => (
                      <Box key={i} mb={6}>
                        <Text fontWeight="bold">{m.titulo} do Gabinete do vereador {m.autor}:</Text>
                        <Text fontStyle="italic" textAlign="justify">"{m.descricao}"</Text>
                        <Text mt={2} textAlign="justify">{m.justificativa}</Text>
                        {m.debates?.map((d: any, di: number) => (
                          <Text key={di} fontSize="sm" mt={1} textAlign="justify"><strong>{d.vereador}:</strong> {d.fala}</Text>
                        ))}
                        <Text mt={2} fontWeight="bold">Resultado: {m.resultado}</Text>
                      </Box>
                    ))}
                  </Box>
                </>
              )}

              <Text textAlign="justify">
                Não havendo mais assuntos a serem deliberados o senhor presidente, sob a proteção de Deus, declarou encerrada a reunião às {minutes.encerramento_horario}. 
                Em seguida, foi realizada a lavratura do termo da ata, que, após ser lida e considerada correta, segue assinada pelo Presidente e pelo Secretário.
              </Text>

              <Text mt={10} textAlign="right">{minutes.cidade_estado}, {minutes.data_assinatura}.</Text>

              <HStack gap={{ base: 4, md: 10 }} justify="center" mt={20}>
                <VStack gap={0} w="45%">
                  <Separator borderColor="black" />
                  <Text fontWeight="bold" fontSize={{ base: "xs", md: "sm" }}>PRESIDENTE</Text>
                  <Text fontSize="10px" textAlign="center">{minutes.presidente_nome}</Text>
                </VStack>
                <VStack gap={0} w="45%">
                  <Separator borderColor="black" />
                  <Text fontWeight="bold" fontSize={{ base: "xs", md: "sm" }}>SECRETÁRIO</Text>
                  <Text fontSize="10px" textAlign="center">{minutes.secretario_nome}</Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};
