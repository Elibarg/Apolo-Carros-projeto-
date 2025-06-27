// -----------------------------
// MENU MOBILE
// -----------------------------
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu'); // Botão de menu mobile (ícone ☰)
    const nav = document.querySelector('.nav'); // Menu de navegação
    const authButtons = document.querySelector('.auth-buttons'); // Botões de login/cadastro

    // Se os elementos existem, adiciona o evento de clique
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('show'); // Alterna a visibilidade do menu
            if (authButtons) {
                authButtons.classList.toggle('show'); // Alterna os botões de autenticação também
            }
        });
    }
}

// -----------------------------
// GALERIA DE IMAGENS (trocar imagem principal ao clicar nas miniaturas)
// -----------------------------
function setupImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail'); // Miniaturas clicáveis
    const mainImage = document.querySelector('.main-image img'); // Imagem grande principal

    if (thumbnails.length && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const thumbImg = thumb.querySelector('img');
                if (thumbImg) {
                    // Troca os `src` das imagens
                    const tempSrc = mainImage.src;
                    mainImage.src = thumbImg.src;
                    thumbImg.src = tempSrc;
                }
            });
        });
    }
}

// -----------------------------
// UPLOAD DE IMAGENS (com pré-visualização)
// -----------------------------
function setupImageUpload() {
    const uploadArea = document.querySelector('.upload-area'); // Área clicável
    const fileInput = document.querySelector('#car-images');   // Input invisível de arquivos
    const previewGrid = document.querySelector('.preview-grid'); // Onde as imagens vão aparecer

    if (uploadArea && fileInput && previewGrid) {
        // Ao clicar na área, simula clique no input de arquivos
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Quando arquivos são selecionados
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            previewGrid.innerHTML = ''; // Limpa previews anteriores

            for (let i = 0; i < files.length; i++) {
                if (i >= 12) break; // Limita a 12 imagens

                const reader = new FileReader();
                reader.onload = (event) => {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';

                    // Cria imagem com o conteúdo carregado
                    const img = document.createElement('img');
                    img.src = event.target.result;

                    // Botão de remover imagem
                    const removeBtn = document.createElement('span');
                    removeBtn.className = 'remove-image';
                    removeBtn.innerHTML = '&times;';
                    removeBtn.addEventListener('click', () => {
                        previewItem.remove(); // Remove a imagem da visualização
                    });

                    // Adiciona imagem + botão à grade de preview
                    previewItem.appendChild(img);
                    previewItem.appendChild(removeBtn);
                    previewGrid.appendChild(previewItem);
                };
                reader.readAsDataURL(files[i]); // Lê o conteúdo da imagem
            }
        });
    }
}

// -----------------------------
// CALCULADORA DE FINANCIAMENTO
// -----------------------------
function setupFinanceCalculator() {
    const calculateBtn = document.getElementById('calculate'); // Botão de calcular
    const resultDiv = document.getElementById('result');       // Div com resultado

    if (calculateBtn && resultDiv) {
        calculateBtn.addEventListener('click', () => {
            const carValue = parseFloat(document.getElementById('car-value').value) || 0;
            const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
            const term = parseInt(document.getElementById('term').value) || 48;

            // Validações básicas
            if (carValue <= 0) {
                alert('Por favor, insira um valor válido para o carro.');
                return;
            }

            if (downPayment >= carValue) {
                alert('O valor da entrada não pode ser maior ou igual ao valor do carro.');
                return;
            }

            // Cálculo de financiamento com juros compostos
            const financedAmount = carValue - downPayment;
            const interestRate = 0.015; // 1.5% ao mês
            const installment = (financedAmount * interestRate) / (1 - Math.pow(1 + interestRate, -term));
            const totalAmount = installment * term;

            // Atualiza o resultado na interface
            document.getElementById('financed-amount').textContent = `R$ ${financedAmount.toFixed(2).replace('.', ',')}`;
            document.getElementById('installments').textContent = `${term}x R$ ${installment.toFixed(2).replace('.', ',')}`;
            document.getElementById('total-amount').textContent = `R$ ${totalAmount.toFixed(2).replace('.', ',')}`;

            resultDiv.style.display = 'block';
        });
    }
}

// -----------------------------
// ABAS DO PAINEL (ex: Anúncios, Favoritos)
// -----------------------------
function setupSalesTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    if (tabBtns.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove .active de todos os botões e conteúdos
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                // Adiciona .active ao botão clicado
                btn.classList.add('active');

                // Mostra o conteúdo correspondente
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }
}

// -----------------------------
// BOTÃO DE FAVORITOS (coração)
// -----------------------------
function setupFavorites() {
    const favoriteBtns = document.querySelectorAll('.favorite, .remove-favorite');

    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');

            // Se o botão for um ícone de coração
            if (btn.classList.contains('fa-heart')) {
                if (btn.classList.contains('active')) {
                    btn.classList.replace('far', 'fas'); // ícone cheio
                    btn.style.color = '#e74c3c';         // cor vermelha
                } else {
                    btn.classList.replace('fas', 'far'); // ícone contorno
                    btn.style.color = '';
                }
            }
        });
    });
}

// -----------------------------
// INICIALIZAÇÃO GERAL
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupImageGallery();
    setupImageUpload();
    setupFinanceCalculator();
    setupSalesTabs();
    setupFavorites();

    // Atualiza automaticamente o ano no rodapé
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});