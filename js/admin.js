// =============================================
// FUNÇÕES GERAIS (válidas para todas as páginas do admin)
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Ativa o dropdown do usuário no topo
    setupUserDropdown();
    
    // Verifica o caminho da URL para identificar a página atual
    const path = window.location.pathname;

    // Executa funções específicas dependendo da página
    if (path.includes('estoque/index.html')) {
        setupEstoqueListagem(); // Página de listagem de veículos
    } else if (path.includes('estoque/editar.html')) {
        setupEstoqueEdicao(); // Página de edição de veículos
    } else if (path.includes('clientes/index.html')) {
        setupClientesListagem(); // Página de listagem de clientes
    } else if (path.includes('clientes/editar.html')) {
        setupClientesEdicao(); // Página de edição de clientes
    } else if (path.includes('vendas/index.html')) {
        setupVendasDashboard(); // Página de dashboard de vendas
    }
});

// =============================================
// Dropdown do usuário (menu suspenso no topo)
// =============================================
function setupUserDropdown() {
    const userDropdown = document.querySelector('.user-dropdown');
    if (!userDropdown) return; // Se não existir, sai da função

    userDropdown.addEventListener('click', function(e) {
        e.stopPropagation(); // Impede o clique de se propagar
        const menu = this.querySelector('.dropdown-menu');
        // Alterna a exibição do menu
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', function() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(d => d.style.display = 'none');
    });
}

// =============================================
// ESTOQUE - Página de Listagem
// =============================================
function setupEstoqueListagem() {
    // Botões de excluir veículo com confirmação
    document.querySelectorAll('.btn-excluir-veiculo').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Tem certeza que deseja excluir este veículo?')) {
                window.location.href = this.href; // Redireciona para excluir
            }
        });
    });

    // Filtro rápido pelo campo de busca
    const searchInput = document.getElementById('search-veiculos');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const termo = this.value.toLowerCase();
            // Mostra ou oculta linhas conforme o texto buscado
            document.querySelectorAll('.veiculo-linha').forEach(linha => {
                linha.style.display = linha.textContent.toLowerCase().includes(termo) ? '' : 'none';
            });
        });
    }
}

// =============================================
// ESTOQUE - Página de Edição
// =============================================
function setupEstoqueEdicao() {
    // Upload de imagens
    const uploadArea = document.querySelector('.upload-imagem');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.multiple = true;

            fileInput.addEventListener('change', function(e) {
                const files = e.target.files;
                const previewContainer = document.querySelector('.preview-imagens');

                for (let file of files) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const imgPreview = document.createElement('div');
                        imgPreview.className = 'imagem-preview';
                        imgPreview.innerHTML = `
                            <img src="${event.target.result}">
                            <button class="btn-remover-imagem">&times;</button>
                        `;
                        previewContainer.appendChild(imgPreview);
                    };
                    reader.readAsDataURL(file);
                }
            });

            fileInput.click(); // Abre o seletor de arquivos
        });

        // Remove imagem ao clicar no botão de remover
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-remover-imagem')) {
                e.target.closest('.imagem-preview').remove();
            }
        });
    }

    // Validação de preço no formulário
    const formEdicao = document.querySelector('.form-editar-veiculo');
    if (formEdicao) {
        formEdicao.addEventListener('submit', function(e) {
            const preco = document.getElementById('preco').value;
            if (isNaN(preco) || preco <= 0) {
                e.preventDefault();
                alert('Preço inválido!');
            }
        });
    }
}

// =============================================
// CLIENTES - Página de Listagem
// =============================================
function setupClientesListagem() {
    // Máscara para telefone
    document.querySelectorAll('.input-telefone').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value
                .replace(/\D/g, '')                         // Remove não-números
                .replace(/(\d{2})(\d)/, '($1) $2')          // Adiciona parênteses e espaço
                .replace(/(\d{5})(\d)/, '$1-$2');           // Adiciona hífen
        });
    });

    // Troca entre abas de conteúdo
    document.querySelectorAll('.aba-clientes').forEach(aba => {
        aba.addEventListener('click', function() {
            const alvo = this.getAttribute('data-aba');
            document.querySelectorAll('.conteudo-aba').forEach(conteudo => {
                conteudo.style.display = conteudo.id === alvo ? 'block' : 'none';
            });
        });
    });
}

// =============================================
// CLIENTES - Página de Edição
// =============================================
function setupClientesEdicao() {
    // Máscara para CPF
    const inputCPF = document.getElementById('cpf');
    if (inputCPF) {
        inputCPF.addEventListener('input', function() {
            this.value = this.value
                .replace(/\D/g, '')                         // Remove não-números
                .replace(/(\d{3})(\d)/, '$1.$2')            // Adiciona ponto
                .replace(/(\d{3})(\d)/, '$1.$2')            // Adiciona outro ponto
                .replace(/(\d{3})(\d)/, '$1-$2');           // Adiciona hífen
        });
    }

    // Busca de endereço a partir do CEP via API ViaCEP
    const inputCEP = document.getElementById('cep');
    if (inputCEP) {
        inputCEP.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.erro) {
                            document.getElementById('endereco').value = data.logradouro;
                            document.getElementById('bairro').value = data.bairro;
                            document.getElementById('cidade').value = data.localidade;
                            document.getElementById('estado').value = data.uf;
                        }
                    });
            }
        });
    }
}

// =============================================
// VENDAS - Página de Dashboard
// =============================================
function setupVendasDashboard() {
    // Aplica efeito de hover nas barras do gráfico
    document.querySelectorAll('.chart-bar').forEach(bar => {
        bar.addEventListener('mouseover', function() {
            this.style.opacity = '0.8'; // Fica levemente transparente
        });
        bar.addEventListener('mouseout', function() {
            this.style.opacity = '1'; // Retorna à opacidade normal
        });
    });
}