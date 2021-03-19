// Criando o modal
const Modal = {
    open() {
        // Abrir o modal
        // Adicionar a classe active ao modal
        document
            .querySelector('.modal-overlay')
            .classList.add('active');
    },
    close() {
        // Fechar o modal
        // Remover a classe activo do modal
        document
            .querySelector('.modal-overlay')
            .classList.remove('active');
    }
}