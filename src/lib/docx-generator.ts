import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageOrientation,
  convertInchesToTwip,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import type { Sumario } from "./types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function numToWords(n: number): string {
  const units = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE",
    "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
  const tens = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
  if (n < 20) return units[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  return u === 0 ? tens[t] : `${tens[t]} Y ${units[u]}`;
}

export function buildResolucionDoc(sumario: Sumario, institucion = "[NOMBRE INSTITUCIÓN]", firmante = "[NOMBRE FIRMANTE]", cargoFirmante = "[CARGO FIRMANTE]"): Document {
  const fechaActual = formatDate(new Date().toISOString());
  const plazoLetras = numToWords(sumario.plazo);

  const spacer = () => new Paragraph({ text: "" });

  const heading = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    });

  const normal = (text: string, options?: { bold?: boolean; indent?: boolean }) =>
    new Paragraph({
      children: [new TextRun({ text, bold: options?.bold, size: 22 })],
      alignment: AlignmentType.JUSTIFIED,
      indent: options?.indent ? { left: convertInchesToTwip(0.4) } : undefined,
      spacing: { after: 120, line: 360, lineRule: "auto" },
    });

  const sectionLabel = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 22, allCaps: true })],
      alignment: AlignmentType.LEFT,
      spacing: { before: 240, after: 120 },
    });

  const sujetosText = sumario.sujetos.length > 0
    ? sumario.sujetos.map((s) => `${s.nombre}${s.cargo ? `, ${s.cargo}` : ""}`).join("; ")
    : "No se identifican sujetos investigados en esta etapa.";

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1.2),
              right: convertInchesToTwip(1.2),
              bottom: convertInchesToTwip(1.2),
              left: convertInchesToTwip(1.4),
            },
          },
        },
        children: [
          heading(institucion.toUpperCase()),
          heading(`RESOLUCIÓN Nº ${sumario.numero}`),
          spacer(),

          new Paragraph({
            children: [new TextRun({ text: fechaActual, italics: true, size: 22 })],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 400 },
          }),

          sectionLabel("Vistos:"),
          normal(
            `Lo establecido en el Estatuto Administrativo, en la normativa sobre sumarios administrativos, ` +
            `y la Resolución Nº ${sumario.resolucionInstructora} de fecha ${formatDate(sumario.fechaResolucion)}, ` +
            `que instruye el presente sumario administrativo; y,`
          ),
          spacer(),

          sectionLabel("Considerando:"),
          normal(
            `1°. Que en virtud de la resolución señalada en el Visto, se instruyó sumario administrativo tendiente a ` +
            `investigar y establecer responsabilidades respecto de los siguientes hechos: ${sumario.objeto}.`
          ),
          normal(
            `2°. Que para el adecuado cumplimiento del procedimiento sumarial se hace necesario designar un Fiscal ` +
            `que dirija la investigación con las facultades y obligaciones que le confiere la normativa vigente.`
          ),
          normal(
            `3°. Que el funcionario que se designa reúne los requisitos y la idoneidad para llevar a cabo la ` +
            `investigación, contando con un plazo de ${plazoLetras} (${sumario.plazo}) días hábiles para su sustanciación.`
          ),
          spacer(),

          sectionLabel("Resuelvo:"),
          normal(
            `1°. DESÍGNASE como Fiscal del sumario administrativo a que se refiere la presente resolución, al/la ` +
            `funcionario/a ${sumario.fiscalNombre.toUpperCase()}, quien deberá iniciar la investigación a partir del ` +
            `${formatDate(sumario.fechaDesignacion)}.`
          ),
          normal(
            `2°. El fiscal designado dispondrá de un plazo de ${plazoLetras} (${sumario.plazo}) días hábiles, ` +
            `contados desde la notificación de la presente resolución, para concluir la investigación.`
          ),
          ...(sumario.sujetos.length > 0
            ? [normal(
                `3°. Las personas que revestirán la calidad de investigados son: ${sujetosText}.`
              )]
            : []
          ),
          normal(
            `${sumario.sujetos.length > 0 ? "4°" : "3°"}. Anótese, comuníquese y archívese.`
          ),
          spacer(),
          spacer(),
          spacer(),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "___________________________", size: 20 })],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: firmante.toUpperCase(), bold: true, size: 20 })],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: cargoFirmante, size: 20 })],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: institucion, size: 20 })],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "___________________________", size: 20 })],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: sumario.fiscalNombre.toUpperCase(), bold: true, size: 20 })],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: "Fiscal designado/a", size: 20 })],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });
}
