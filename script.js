// Criando o modal
const Modal = {
    // Abrir o modal
    open() {
        // Adicionar a classe active ao modal
        document
            .querySelector('.modal-overlay')
            .classList.add('active');
    },
    // Fechar o modal
    close() {
        // Remover a classe activo do modal
        document
            .querySelector('.modal-overlay')
            .classList.remove('active');
    }
}

// Armazenando os dados no navegador
const Storage = {
    // Pegando as informações
    get() {
        // String -> Array
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
    },
    // Guardando as informações
    set(transactions) {
        // Array -> String
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
    }
}

// Funcionalidade das transações
const Transaction = {
    // Criando um atalho para todas as transações
    all: Storage.get(),

    // Adicionando as transações
    add(transaction) {
        Transaction.all.push(transaction);

        App.reload();
    },
    // Removendo as transações
    remove(index) {
        Transaction.all.splice(index, 1);

        App.reload();
    },
    // Entradas
    incomes() {
        // Somar as entradas
        let income = 0;

        Transaction.all.forEach((transaction) => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        });
        
        return income;
    },
    // Saídas
    expenses() {
        // Somar as saídas
        let expense = 0;

        Transaction.all.forEach(transaction => {
            if( transaction.amount < 0 ) {
                expense += transaction.amount;
            }
        })

        return expense;
    },
    // Total
    total() {
        // Entradas - Saídas
        return Transaction.incomes() + Transaction.expenses();
    }
}

// Colocando as transações no HTML
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    // Adiciona o HTML na página
    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;
        
        DOM.transactionsContainer.appendChild(tr)
    },
    // Criando o HTML que mostra a transação
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
        <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `

        return html;
    },
    // Atualiza os valores do balanço
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes());
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses());
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total());
    },
    // Limpando as transações antes de colocar uma nova
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
}

// Funcionalidade úteis para o programa
const Utils = {
    // Formatar para o Real
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        return signal + value;
    },
    // Formatar o valor de entrada
    formatAmount(value) {   
        value = Number(value) * 100;
        
        return value;
    },
    // Formatar a data de entrada
    formatDate(date) {
        const splittedDate = date.split("-");

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    }
}

// Formulário de cadastro de transações
const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    // Pegando os valores das propriedas
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    // Verificando os campos
    validateFields() {
        const { description, amount, date } = Form.getValues();
        
        // Verificando se os campos estão vazios
        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            // Criando uma nova mensagem de erro
            throw new Error("Por favor, preencha todos os campos");
        }
    },
    // Formatar os dados
    formatValues() {
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount);

        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
        }
    },
    // Salvar as transações
    saveTransaction(transaction) {
        Transaction.add(transaction);
    },
    // Limpar os campos do forms
    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },
    // Envio da transação
    submit(event) {
        // Não deixa os dados aparecerem na URL
        event.preventDefault();

        try {
            // Verifica se todas as informações foram preenchidas
            Form.validateFields();

            // Formata os dados para salvar
            const transaction = Form.formatValues();

            // Salvar a transação
            Form.saveTransaction(transaction);

            // Apagar os dados do formulário para uma nova transação
            Form.clearFields();

            // Fechar o modal
            Modal.close();

        } catch (error) {
            alert(error.message);
        }
    }
}

// Aplicação
const App = {
    // Inicia a aplicação
    init() {
        // Adiciona todas as transações no HTML
        Transaction.all.forEach(function(transaction, index) {
            DOM.addTransaction(transaction, index)
        });

        DOM.updateBalance();

        Storage.set(Transaction.all);
    },
    // Recarega a aplicação
    reload() {
        DOM.clearTransactions();
        App.init();
    }
}

App.init();