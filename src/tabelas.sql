DROP DATABASE s1_r3_r4;
CREATE DATABASE S1_R3_R4;
USE S1_R3_R4;

CREATE TABLE categorias (
id_categoria INT auto_increment PRIMARY KEY,
nome VARCHAR (50) NOT NULL,
descricao VARCHAR(100),
data_cad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR (100),
    preco DECIMAL(10,2) NOT NULL,
    caminho_imagem VARCHAR(300),
    quantidade_estoque INT NOT NULL,
    id_categoria INT,
    data_cad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
);

CREATE TABLE pedidos (
id_pedido INT AUTO_INCREMENT PRIMARY KEY,
subTotal DECIMAL (18,2) NOT NULL,
status ENUM ('Aberto', 'Finalizado', 'Pendente') NOT NULL,
quantidade_itens INT DEFAULT(0),
dataCad  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itens_pedido (
    idItem INT AUTO_INCREMENT PRIMARY KEY,
    produtoId INT NOT NULL,
    pedidoId INT NOT NULL,
    quantidade DECIMAL(18,2) NOT NULL,
    valorItem DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (produtoId) REFERENCES produtos(id_produto) ON DELETE CASCADE,
    FOREIGN KEY (pedidoId) REFERENCES pedidos(id_pedido) ON DELETE CASCADE
);