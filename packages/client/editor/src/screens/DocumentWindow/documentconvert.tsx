import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.js'
import * as Tesseract from 'tesseract.js'
import * as mammoth from 'mammoth'
import { PDFPageProxy } from 'pdfjs-dist/types/web/interfaces'
import * as XLSX from 'xlsx/xlsx.mjs'

type SupportedFileTypes =
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'xls'
  | 'xlsx'
  | 'ppt'
  | 'pptx'

interface OCRConfig {
  engine: 'tesseract' | 'other'
  other: any
}

export async function convertFileToText(
  file: File,
  ocrConfig?: OCRConfig
): Promise<any> {
  const fileExt = file.name
    .split('.')
    .pop()!
    .toLowerCase() as SupportedFileTypes

  switch (fileExt) {
    case 'pdf':
      return await convertPdfToText(file, ocrConfig?.engine, ocrConfig?.other)
    case 'doc':
    case 'docx':
      return await convertWordToText(file)
    case 'xls':
    case 'xlsx':
      return await convertExcelToText(file)
    /* case 'ppt':
        case 'pptx':
            return await convertPowerpointToText(file); */
    default:
      throw new Error(`Unsupported file type: ${fileExt}`)
  }
}

export async function numberOfPages(file: File): Promise<number> {
  const fileExt = file.name
    .split('.')
    .pop()!
    .toLowerCase() as SupportedFileTypes

  switch (fileExt) {
    case 'pdf':
      return pdfNumberOfPages(file)
    case 'doc':
    case 'docx':
      return 0
    case 'xls':
    case 'xlsx':
      return 0
    /* case 'ppt':
        case 'pptx':
            return await convertPowerpointToText(file); */
    default:
      throw new Error(`Unsupported file type: ${fileExt}`)
  }
}

async function pdfNumberOfPages(file: File) {
  // Read the PDF file
  const pdfBuffer = await readFileAsBuffer(file)

  // Define the PDF.js worker source path (needed for loading PDF.js)
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'
  //Load the PDF document
  const pdfDocument = await pdfjsLib.getDocument({ data: pdfBuffer }).promise
  return pdfDocument.numPages
}

async function convertPdfToText(
  file: File,
  ocrEngine = 'tesseract',
  ocrConfig?: any
): Promise<any[]> {
  // Read the PDF file
  const pdfBuffer = await readFileAsBuffer(file)

  // Define the PDF.js worker source path (needed for loading PDF.js)
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

  // Load the PDF document
  const pdfDocument = await pdfjsLib.getDocument({ data: pdfBuffer }).promise

  const text = []

  if (ocrEngine === 'tesseract') {
    // Initialize Tesseract.js with the English language
    const worker = await Tesseract.createWorker({
      logger: m => console.log(m),
    })

    await worker.loadLanguage('eng')
    await worker.initialize('eng')

    // Loop through each page of the PDF document
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      // Get the page object
      const page = await pdfDocument.getPage(i)

      // Get the text content of the page
      const content = await page.getTextContent()
      const items = content.items

      if (items.length === 1 && !items[0].str) {
        // If the page has only one item and it's an image, use OCR to extract the text
        const pngBuffer = await pdfPageToPngBuffer(page)
        //@ts-ignore
        const ocrResult = await worker.recognize(pngBuffer, { lang: 'eng' })
        //text += ocrResult.data.text;
        text.push(ocrResult.data.text)
      } else {
        // If the page has multiple items, loop through each item
        for (let j = 0; j < items.length; j++) {
          const item = items[j]

          if (item.str === '') {
            //TODO: Only Extract the part of the table that is visible on the page
            // If the item is an image, extract its text content
            /* const imagePngBuffer = await pdfPageToPngBuffer(page);
                        //@ts-ignore
                        const imageOcrResult = await worker.recognize(imagePngBuffer, { lang: 'eng' });
                        //text += imageOcrResult.data.text;
                        text.push(imageOcrResult.data.text); */
          } else {
            // If the item is a text element or table, append its raw text content to the output file
            //text += item.str;
            text.push(item.str)
          }
        }
      }
    }
  } else {
    // TODO: Implement alternative OCR engine
    throw new Error(`Unsupported OCR engine: ${ocrEngine}`)
  }

  return text
}

async function convertWordToText(file: File): Promise<string> {
  const arrayBuffer = await readFileAsBuffer(file)
  const result = await mammoth.convertToHtml({ arrayBuffer })
  return result.value.replace(/(<([^>]+)>)/gi, '')
}
/* async function convertPowerpointToText(file: File): Promise<string> {
    console.log('convertPowerpointToText')
    const arrayBuffer = await readFileAsBuffer(file);
    console.log(arrayBuffer)
    const result = await mammoth.extractRawText({ arrayBuffer });
    console.log(result)
    return result.value.replace(/(<([^>]+)>)/gi, '');
} */
async function convertExcelToText(file: File): Promise<string> {
  const arrayBuffer = await readFileAsBuffer(file)
  // Read the Excel file
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })

  let text = ''
  let wordCount = 0

  // Loop through each worksheet in the workbook
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    // Convert the worksheet to an array of rows
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    // Get the table column headings
    const columnHeadings = rows.shift() as []

    // Append the column headings to the output text
    text += columnHeadings.join('\t') + '\n'

    // Append the rows to the output text
    for (const row of rows) {
      text += (row as []).join('\t') + '\n'

      // Count the number of words added
      const words = (row as []).join(' ').split(' ')
      wordCount += words.length

      // Check if 7000 words have been added
      if (wordCount >= 7000) {
        // Add "<<BREAK>>" marker
        text += '<<BREAK>>\n'

        // Reset the word count
        wordCount = 0

        // Append the column headings again
        text += columnHeadings.join('\t') + '\n'
      }
    }
  }

  return text
}

async function pdfPageToPngBuffer(pdfPage: PDFPageProxy): Promise<Uint8Array> {
  const canvas = document.createElement('canvas')
  const viewport = pdfPage.getViewport({ scale: 1.0 })
  canvas.width = viewport.width
  canvas.height = viewport.height
  const ctx = canvas.getContext('2d')!
  const renderContext: any = {
    canvasContext: ctx,
    viewport: viewport,
  }
  const renderTask: any = pdfPage.render(renderContext)
  await renderTask.promise
  const blob = await (await fetch(canvas.toDataURL('image/png'))).blob()
  const arrayBuffer = await blob.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

async function readFileAsBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'))
      }
    }
    reader.onerror = () => {
      reject(reader.error)
    }
    reader.readAsArrayBuffer(file)
  })
}
