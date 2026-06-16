export class Pedido {
    #id;
    #subTotal;
    #status;
    #quantidade_itens;
    #dataCad;

    // CONSTRUTOR
    constructor(pSubTotal, pStatus, pQuantidade_itens, pDataCad, pId) {

        this.subTotal = pSubTotal;
        this.status = pStatus;
        this.quantidade_itens = pQuantidade_itens;
        this.dataCad = pDataCad;
        this.id = pId;

    }

    // GETTERS

    get id() {
        return this.#id;
    }

    get subTotal() {
        return this.#subTotal;
    }

    get status() {
        return this.#status;
    }

    get quantidade_itens() {
        return this.#quantidade_itens;
    }

    get dataCad() {
        return this.#dataCad;
    }

    // SETTERS

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    set subTotal(value) {
        this.#validarSubTotal(value);
        this.#subTotal = value;
    }

    set status(value) {
        this.#validarStatus(value);
        this.#status = value;
    }

    set quantidade_itens(value) {
        this.#validarQuantidadeItens(value);
        this.#quantidade_itens = value;
    }

    set dataCad(value) {
        this.#dataCad = value;
    }

    // MÉTODOS AUXILIARES

    #validarId(value) {
        if (value && value <= 0) {
            throw new Error("Verifique o ID informado");
        }

    }

    #validarSubTotal(value) {
        if (value === undefined || value === null || value < 0) {
            throw new Error("Não foi possível obter o subtotal");
        }

    }

    #validarStatus(value) {
        if (!value || value.trim().length === 0) {
            throw new Error("O status do pedido é obrigatório");
        }

    }

    #validarQuantidadeItens(value) {
        if (value === undefined || value === null || value < 0) {
            throw new Error("A quantidade de itens é inválida");
        }

    }

    // DESIGN PATTERN

    static criar(dados) {
        return new Pedido(dados.subTotal, dados.status, dados.quantidade_itens, dados.dataCad, null);
    }

    static editar(dados, id) {
        return new Pedido(dados.subTotal, dados.status, dados.quantidade_itens, dados.dataCad, id);
    }
}