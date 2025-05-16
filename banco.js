class ContaBancaria {
    static contadorContas = 1000; // Para gerar número automaticamente

    constructor(titular, senha) {
        this.titular = titular;
        this.#senha = senha;
        this.numeroConta = ContaBancaria.contadorContas++;
        this.#saldo = 0;
        this.extrato = [];
    }

    #saldo;
    #senha;

    autenticar(senha) {
        return this.#senha === senha;
    }

    depositar(valor) {
        if (valor > 0) {
            this.#saldo += valor;
            this.extrato.push(`Depósito: +R$${valor.toFixed(2)}`);
            console.log(`${this.titular}: Depósito de R$${valor.toFixed(2)} realizado.`);
        } else {
            console.log("Valor inválido para depósito.");
        }
    }

    sacar(valor) {
        if (valor > 0 && valor <= this.#saldo) {
            this.#saldo -= valor;
            this.extrato.push(`Saque: -R$${valor.toFixed(2)}`);
            console.log(`${this.titular}: Saque de R$${valor.toFixed(2)} realizado.`);
        } else {
            console.log("Saldo insuficiente para saque.");
        }
    }

    consultarSaldo() {
        console.log(`${this.titular}: Saldo atual é R$${this.#saldo.toFixed(2)}`);
        return this.#saldo;
    }

    verExtrato() {
        console.log(`Extrato de ${this.titular}:`);
        this.extrato.forEach(op => console.log(op));
    }
}

class ContaCorrente extends ContaBancaria {
    constructor(titular, senha, limite = 500) {
        super(titular, senha);
        this.limite = limite;
    }

    sacar(valor) {
        const saldoAtual = this.consultarSaldo();
        if (valor > 0 && valor <= saldoAtual + this.limite) {
            const novoSaldo = saldoAtual - valor;
            // Simula acesso ao atributo protegido com método
            super.depositar(-valor);
            this.extrato.push(`Saque (com limite): -R$${valor.toFixed(2)}`);
            console.log(`${this.titular}: Saque com limite de R$${valor.toFixed(2)} realizado.`);
        } else {
            console.log("Limite insuficiente para saque.");
        }
    }
}

class ContaPoupanca extends ContaBancaria {
    sacar(valor) {
        const saldoAtual = this.consultarSaldo();
        if (valor > 0 && valor <= saldoAtual) {
            super.depositar(-valor);
            this.extrato.push(`Saque: -R$${valor.toFixed(2)}`);
            console.log(`${this.titular}: Saque de R$${valor.toFixed(2)} realizado.`);
        } else {
            console.log("Saque não permitido. Saldo insuficiente.");
        }
    }
}

// Simulação de uma Agência
class Agencia {
    constructor(nome) {
        this.nome = nome;
        this.contas = [];
    }

    adicionarConta(conta) {
        this.contas.push(conta);
    }

    listarContas() {
        console.log(`Contas da Agência ${this.nome}:`);
        this.contas.forEach(conta => {
            console.log(`Titular: ${conta.titular}, Nº: ${conta.numeroConta}`);
        });
    }
}

// ========== SIMULAÇÃO ==========

const agencia = new Agencia("Agência Central");

// Criando contas
const conta1 = new ContaCorrente("Jose", "1234");
const conta2 = new ContaPoupanca("Jordan", "4321");

agencia.adicionarConta(conta1);
agencia.adicionarConta(conta2);

console.log("\n=== Operações com Jose (Conta Corrente) ===");
conta1.depositar(450);
conta1.consultarSaldo();
conta1.sacar(500); // Usando limite
conta1.consultarSaldo();
conta1.verExtrato();

console.log("\n=== Operações com Jordan (Conta Poupança) ===");
conta2.depositar(300);
conta2.consultarSaldo();
conta2.sacar(250); // Não deve permitir
conta2.sacar(150); // Deve permitir
conta2.consultarSaldo();
conta2.verExtrato();

console.log("\n=== Contas na Agência ===");
agencia.listarContas();