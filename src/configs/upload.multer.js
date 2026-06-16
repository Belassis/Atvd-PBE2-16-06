import multer from "multer";
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// Diretório base para uploads
const baseUploadDir = path.resolve(process.cwd(), 'uploads');

// Função que verifica se o diretório existe e o cria se não existir
const verificaDir = (dir) => {
    if (!fs.existsSync(dir)) { // Verifica se o diretório NÃO existe
        fs.mkdirSync(dir, { recursive: true }); // Cria o diretório se não existir
    }
}

// Função para criar a configuração do Multer
const createMulter = ({ pasta, tiposPermitidos, tamanhoArquivo }) => {
    const pastaFinal = path.join(baseUploadDir, pasta);
    verificaDir(pastaFinal); // Verifica e cria o diretório se necessário

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, pastaFinal); // Define o diretório de destino
        },
        filename: (req, file, cb) => {
            const hash = crypto.randomBytes(12).toString('hex'); // Gera um hash extradecimal
            cb(null, `${hash}-${file.originalname}`); // Define o nome do arquivo
        }
    });

    const fileFilter = (req, file, cb) => {
        if (!tiposPermitidos.includes(file.mimetype)) {
            return cb(new Error("Tipo de arquivo não permitido")); // Verifica o tipo de arquivo
        }
        cb(null, true); // Continua o processo se o tipo for permitido
        //cb = callback, ve se não tem erro e depois retorna o valor se der tudo certo
    }

    return multer({
        storage,
        limits: { fileSize: tamanhoArquivo }, // Limite de tamanho do arquivo
        fileFilter // Filtro de arquivos
    });
}

export default createMulter;