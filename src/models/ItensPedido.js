export class ItensPedido {

    #pedidoId;
    #produtoId;
    #quantidade;
    #valorItem;

    // CONSTRUTOR
    constructor(pProdutoId, pQuantidade, pValorItem, pPedidoId) {
        this.#produtoId = pProdutoId;
        this.#quantidade = pQuantidade;
        this.#valorItem = pValorItem;
        this.#pedidoId = pPedidoId;
    }

    // GETTERS
    get pedidoId() {
        return this.#pedidoId;
    }
    get produtoId() {
        return this.#produtoId;
    }
    get quantidade() {
        return this.#quantidade;
    }
    get valorItem() {
        return this.#valorItem;
    }

    // SETTERS
    set pedidoId(value) {
        this.#validarPedidoId(value);
        this.#pedidoId = value;
    }
    set produtoId(value) {
        this.#validarProdutoId(value);
        this.#produtoId = value;
    }
    set quantidade(value) {
        this.#validarQuantidade(value);
        this.#quantidade = value;
    }
    set valorItem(value) {
        this.#validarValorItem(value);
        this.#valorItem = value;
    }

    // MÉTODOS AUXILIARES
    #validarPedidoId(value) {
        if (value !== null && value !== undefined && value <= 0) {
            throw new Error("Verifique o ID do pedido informado");
        }
    }
    #validarProdutoId(value) {
        if (!value || value <= 0) {
            throw new Error("Verifique o ID do produto informado");
        }
    }
    #validarQuantidade(value) {
        if (!value || value <= 0) {
            throw new Error("Não foi possível obter a quantidade");
        }
    }
    #validarValorItem(value) {
        if (!value || value <= 0) {
            throw new Error("Informe um valor para o item");
        }
    }

    static calcularSubTotalItens(itens) { 
        return itens.reduce(
            (total, item) => total + (item.valorItem * item.quantidade), 0); //Pega o total e soma com o valor do item multiplicado pela quantidade dos itens 
    }

    // DESIGN PATTERN
    static criar(dados) {
        return new ItensPedido(dados.produtoId, dados.quantidade, dados.valorItem,dados.pedidoId);
    }

    static editar(dados, id) {
        return new ItensPedido(dados.produtoId, dados.quantidade, dados.valorItem, dados.pedidoId);
    }

}