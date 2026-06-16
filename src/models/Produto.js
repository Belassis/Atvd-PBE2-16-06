export class Produto {
    #id;
    #idCategoria;
    #nome;
    #descricao;
    #preco;
    #caminho_imagem;
    #quantidade_estoque;
    #dataCad;

    constructor(pIdCategoria, pNome, pDescricao, pPreco, pQuantidadeEstoque, pCaminhoImagem, pDataCad, pId) {
        this.idCategoria = pIdCategoria;
        this.nome = pNome;
        this.descricao = pDescricao;
        this.preco = pPreco;
        this.quantidade_estoque = pQuantidadeEstoque;
        this.caminho_imagem = pCaminhoImagem;
        this.dataCad = pDataCad;
        this.id = pId;
    }

    // Getters e Setters

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    get idCategoria() {
        return this.#idCategoria;
    }
    set idCategoria(value) {
        this.#validarIdCategoria(value);
        this.#idCategoria = value;
    }

    get nome() {
        return this.#nome;
    }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get descricao() {
        return this.#descricao;
    }
    set descricao(value) {
        this.#validarDescricao(value);
        this.#descricao = value;
    }

    get preco() {
        return this.#preco;
    }
    set preco(value) {
        this.#validarPreco(value);
        this.#preco = value;
    }

    get quantidade_estoque() {
        return this.#quantidade_estoque;
    }
    set quantidade_estoque(value) {
        this.#validarQuantidadeEstoque(value);
        this.#quantidade_estoque = value;
    }

    get caminho_imagem() {
        return this.#caminho_imagem;
    }
    set caminho_imagem(value) {
        if (value !== undefined && value !== null) {
            this.#validarPathImagem(value);
        }

        this.#caminho_imagem = value;
    }

    get dataCad() {
        return this.#dataCad;
    }
    set dataCad(value) {
        this.#dataCad = value;
    }

    // Validações

    #validarId(value) {
        if (value && value <= 0) {
            throw new Error('Verifique o ID informado');
        }
    }

    #validarIdCategoria(value) {
        if (!value || value <= 0) {
            throw new Error('Verifique o ID da categoria informado');
        }
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error('O campo nome é obrigatório e deve ter entre 3 e 100 caracteres.');
        }
    }

    #validarDescricao(value) {
        if (!value || value.trim().length < 3) {
            throw new Error('O campo descrição é obrigatório.');
        }
    }

    #validarPreco(value) {
        if (value === undefined || value === null || value < 0) {
            throw new Error('O campo preco é obrigatório e deve ser um número positivo.');
        }
    }

    #validarQuantidadeEstoque(value) {
        if (value === undefined || value === null || value < 0) {
            throw new Error('A quantidade em estoque deve ser maior ou igual a zero.');
        }
    }

    #validarPathImagem(value) {
        if (!value || value.trim().length === 0) {
            throw new Error('O caminho da imagem é obrigatório.');
        }
    }

    // Factory methods

    static criar(dados) {
        return new Produto(dados.idCategoria, dados.nome, dados.descricao, dados.preco, dados.quantidade_estoque, dados.caminho_imagem, dados.dataCad, null);
    }

    static alterar(dados, id) {
        return new Produto(dados.idCategoria, dados.nome, dados.descricao, dados.preco, dados.quantidade_estoque, dados.caminho_imagem, dados.dataCad, id);
    }
}