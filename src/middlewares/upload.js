import createMulter from "../configs/upload.multer.js";

const upload = createMulter({
    pasta: 'imagens',
    tiposPermitidos: ['image/png', 'image/jpeg', 'image/jpg'],
    tamanhoArquivo: 10 * 1024 * 1024 // 10MB
});

export default upload;