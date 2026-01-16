// ==========================================================
// 0. UTILITÁRIOS (GERADOR DE ID)
// ==========================================================
const Utils = {
    gerarId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// ==========================================================
// 1. API SIMULADA (LOCAL STORAGE COM IDs)
// ==========================================================
const AlexandriaAPI = {
    key: "alexandria_db_v2", 

    dadosPadrao: {
        grupos: [], 
        livros: []
    },

    // --- LEITURA E MIGRAÇÃO ---
    lerTudo: function() {
        const dadosString = localStorage.getItem(this.key);
        let db = dadosString ? JSON.parse(dadosString) : this.dadosPadrao;

        // --- MIGRAÇÃO AUTOMÁTICA DE DADOS ANTIGOS ---
        // Se existirem livros sem ID, adicionamos agora para não quebrar o sistema
        let houveMudanca = false;

        db.livros.forEach(livro => {
            if (!livro.id) {
                livro.id = Utils.gerarId();
                houveMudanca = true;
            }
        });

        db.grupos.forEach(grupo => {
            if (!grupo.id) {
                grupo.id = Utils.gerarId();
                houveMudanca = true;
            }
            // Migrar subgrupos de String para Objeto {id, nome}
            grupo.subgrupos = grupo.subgrupos.map(sub => {
                if (typeof sub === 'string') {
                    houveMudanca = true;
                    return { id: Utils.gerarId(), nome: sub };
                }
                return sub;
            });
        });

        if (houveMudanca) {
            this.salvarTudo(db);
        }
        // ---------------------------------------------

        return db;
    },

    getGrupos: function() {
        return this.lerTudo().grupos;
    },

    getLivros: function() {
        return this.lerTudo().livros;
    },

    getLivroPorId: function(id) {
        return this.lerTudo().livros.find(l => l.id === id);
    },

    // --- ESCRITA ---
    salvarTudo: function(dados) {
        localStorage.setItem(this.key, JSON.stringify(dados));
    },

    adicionarGrupo: function(novoNome) {
        const db = this.lerTudo(); 
        const novoGrupo = { 
            id: Utils.gerarId(),
            nome: novoNome, 
            subgrupos: [] 
        };
        db.grupos.push(novoGrupo); 
        this.salvarTudo(db); 
    },

    adicionarSubgrupo: function(idGrupo, nomeSub) {
        const db = this.lerTudo();
        const grupo = db.grupos.find(g => g.id === idGrupo);
        
        if (grupo) {
            grupo.subgrupos.push({
                id: Utils.gerarId(),
                nome: nomeSub
            });
            this.salvarTudo(db);
        }
    },

    adicionarLivro: function(livro) {
        const db = this.lerTudo();
        // Garante que o livro tenha ID ao entrar
        livro.id = Utils.gerarId();
        db.livros.push(livro);
        this.salvarTudo(db);
    },

    // --- ATUALIZAÇÃO ---
    atualizarLivro: function(idLivro, livroAtualizado) {
        const db = this.lerTudo();
        const index = db.livros.findIndex(l => l.id === idLivro);
        
        if (index !== -1) {
            // Mantém o ID original para segurança
            livroAtualizado.id = idLivro;
            db.livros[index] = livroAtualizado;
            this.salvarTudo(db);
        }
    },

    // --- REMOÇÃO ---
    removerGrupo: function(idGrupo) {
        const db = this.lerTudo();
        db.grupos = db.grupos.filter(g => g.id !== idGrupo);
        this.salvarTudo(db);
    },

    removerSubgrupo: function(idGrupo, idSub) {
        const db = this.lerTudo();
        const grupo = db.grupos.find(g => g.id === idGrupo);
        
        if (grupo) {
            grupo.subgrupos = grupo.subgrupos.filter(sub => sub.id !== idSub);
            this.salvarTudo(db);
        }
    }
};

// ==========================================================
// 2. VARIÁVEIS DE CONTROLE DE ESTADO
// ==========================================================
let listaAtualLivros = []; 
let direcaoOrdenacao = {}; 
let idLivroEmEdicao = null; // Mudamos de índice para ID

// ==========================================================
// 3. CAPTURA DE ELEMENTOS DO HTML
// ==========================================================
// (Mantido igual ao original)
const selectGrupo = document.querySelector("#grupo");
const selectSubgrupo = document.querySelector("#subGrupo");
const inputVolume = document.querySelector("#volume");
const formCadastro = document.querySelector(".cadastroLivros");
const btnGerarCodigo = document.querySelector("#gerarCodigo");

const listaGruposUl = document.querySelector(".listaGrupos ul");
const listaSubgruposContainer = document.querySelector(".listaSubgrupos");

const fade = document.querySelector("#fade");
const btnsCancelar = document.querySelectorAll(".btn-cancelar");

// Modais
const modalGrupo = document.querySelector("#modal-grupo");
const btnAbrirGrupo = document.querySelector("#btnAbrirModalGrupo");
const btnSalvarGrupo = document.querySelector("#btnSalvarGrupo");
const inputNomeNovoGrupo = document.querySelector("#inputNomeNovoGrupo");

const modalSubgrupo = document.querySelector("#modal-subgrupo");
const btnAbrirSub = document.querySelector("#btnAbrirModalSub");
const btnSalvarSub = document.querySelector("#btnSalvarSub");
const selectGrupoParaSub = document.querySelector("#selectGrupoParaSub");
const inputNomeNovoSub = document.querySelector("#inputNomeNovoSub");

const modalEditarLivro = document.querySelector("#modal-editar-livro");
const formEdicaoBody = document.querySelector("#formEdicaoBody"); 
const btnSalvarEdicao = document.querySelector("#btnSalvarEdicao");
const btnDescartarLivro = document.querySelector("#btnDescartarLivro"); 

const editTitulo = document.querySelector("#editTitulo");
const editAutor = document.querySelector("#editAutor");
const editEditora = document.querySelector("#editEditora");
const editEdicao = document.querySelector("#editEdicao");
const editCodigo = document.querySelector("#editCodigo");
const editLido = document.querySelector("#editLido");
const editObservacao = document.querySelector("#editObservacao"); 

// ==========================================================
// 4. INICIALIZAÇÃO
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    atualizarInterfaceGeral();
    iniciarDarkMode();
});

function atualizarInterfaceGeral() {
    const grupos = AlexandriaAPI.getGrupos();
    // Se não estiver filtrado, pega tudo, senão mantém a lista filtrada (apenas atualizando dados)
    if(document.querySelector("#pesquisar").value === "") {
        listaAtualLivros = AlexandriaAPI.getLivros(); 
    } else {
        // Se estiver pesquisando, re-executa a pesquisa para atualizar dados
        filtrarLivros();
        return; // filtrarLivros já chama renderizar
    }

    atualizarSelectsPrincipais(grupos);
    atualizarListaLateral(grupos);
    renderizarTabela(listaAtualLivros);
}

// ==========================================================
// 5. FUNÇÕES DE RENDERIZAÇÃO
// ==========================================================

function atualizarSelectsPrincipais(grupos) {
    const valorAtual = selectGrupo.value; 
    
    selectGrupo.innerHTML = `<option disabled selected>Grupo</option>`;
    selectSubgrupo.innerHTML = `<option disabled selected>Subgrupo</option>`;

    grupos.forEach(g => {
        let op = document.createElement("option");
        // Nota: O Value do select principal continua sendo o NOME para salvar no livro como string
        // Isso facilita a busca visual, mas o gerenciamento interno usa ID
        op.value = g.nome; 
        op.textContent = g.nome;
        // Adicionamos data-id apenas para referência se necessário
        op.dataset.id = g.id;
        selectGrupo.appendChild(op);
    });

    if (grupos.some(g => g.nome === valorAtual)) {
        selectGrupo.value = valorAtual;
        // Dispara evento para carregar subgrupos
        // selectGrupo.dispatchEvent(new Event('change')); // Evitar loop se não necessário
        carregarSubgruposNoSelect(valorAtual);
    }
}

function carregarSubgruposNoSelect(nomeGrupo) {
    const grupos = AlexandriaAPI.getGrupos();
    const grupo = grupos.find(g => g.nome === nomeGrupo);
    
    selectSubgrupo.innerHTML = `<option disabled selected>Subgrupo</option>`;
    
    if(grupo && grupo.subgrupos) {
        grupo.subgrupos.forEach(sub => {
            let op = document.createElement("option");
            op.value = sub.nome; // Value é o nome
            op.textContent = sub.nome;
            selectSubgrupo.appendChild(op);
        });
    }
}

function atualizarListaLateral(grupos) {
    listaGruposUl.innerHTML = "";
    listaSubgruposContainer.innerHTML = "";

    if (grupos.length === 0) {
        listaGruposUl.innerHTML = "<li style='color:#ccc'>Nenhum grupo</li>";
        return; 
    }

    // Ordenar para exibição
    grupos.sort((a, b) => a.nome.localeCompare(b.nome));

    grupos.forEach((g) => {
        // --- Lista Superior (Grupos) ---
        let li = document.createElement("li");
        li.className = "item-lista-com-delete";
        
        let spanTexto = document.createElement("span");
        spanTexto.textContent = g.nome;
        spanTexto.className = "item-clicavel"; 
        spanTexto.onclick = () => { filtrarPorGrupo(g.nome); };
        
        let btnDelGrupo = document.createElement("button");
        btnDelGrupo.textContent = "×";
        btnDelGrupo.className = "btn-excluir";
        
        // AGORA USAMOS O ID PARA EXCLUIR
        btnDelGrupo.onclick = (e) => {
            e.stopPropagation(); 
            if(confirm(`Tem certeza que deseja excluir o grupo "${g.nome}"?`)) {
                AlexandriaAPI.removerGrupo(g.id);
                atualizarInterfaceGeral();
            }
        };

        li.appendChild(spanTexto);
        li.appendChild(btnDelGrupo);
        listaGruposUl.appendChild(li);

        // --- Lista Inferior (Subgrupos) ---
        let div = document.createElement("div");
        div.className = "divSubGrupos";
        
        let h4 = document.createElement("h4");
        h4.textContent = g.nome;
        div.appendChild(h4);
        
        let ulSubs = document.createElement("ul");
        
        // Ordenar subgrupos (agora são objetos)
        const subgruposOrdenados = [...g.subgrupos].sort((a, b) => a.nome.localeCompare(b.nome));

        if (subgruposOrdenados.length === 0) {
            ulSubs.innerHTML = "<li style='color:#999; font-size:0.8em'>Sem subgrupos</li>";
        } else {
            subgruposOrdenados.forEach((sub) => {
                let liSub = document.createElement("li");
                liSub.className = "item-lista-com-delete";

                let spanSub = document.createElement("span");
                spanSub.textContent = sub.nome;
                spanSub.className = "item-clicavel"; 
                spanSub.onclick = () => { filtrarPorSubgrupo(g.nome, sub.nome); };

                let btnDelSub = document.createElement("button");
                btnDelSub.textContent = "×";
                btnDelSub.className = "btn-excluir";
                
                // USANDO ID DO GRUPO E ID DO SUBGRUPO
                btnDelSub.onclick = (e) => {
                    e.stopPropagation(); 
                    if(confirm(`Excluir o subgrupo "${sub.nome}"?`)) {
                        AlexandriaAPI.removerSubgrupo(g.id, sub.id);
                        atualizarInterfaceGeral();
                    }
                };

                liSub.appendChild(spanSub);
                liSub.appendChild(btnDelSub);
                ulSubs.appendChild(liSub);
            });
        }
        div.appendChild(ulSubs);
        listaSubgruposContainer.appendChild(div);
    });
}

function renderizarTabela(lista) {
    const corpoTabela = document.querySelector("#corpoTabela");
    const contador = document.querySelector("#contadorLivros");
    
    corpoTabela.innerHTML = "";
    
    if (lista.length === 0) {
        corpoTabela.innerHTML = "<tr><td colspan='4' style='padding:20px;'>Nenhum livro encontrado.</td></tr>";
        if(contador) contador.textContent = "0 livros";
        return;
    }

    lista.forEach((livro) => {
        let tr = document.createElement("tr");
        let displayTitulo = livro.titulo;
        
        if (livro.descartado) {
            displayTitulo = `<span class="titulo-descartado">${livro.titulo} (DESCARTADO)</span>`;
        }

        // Passamos o ID (string) para a função
        // Precisamos de aspas simples dentro da string do HTML para o ID funcionar
        tr.innerHTML = `
            <td>
                <span class="link-livro" onclick="abrirModalEdicao('${livro.id}')">
                    ${displayTitulo}
                </span>
            </td>
            <td class="${livro.descartado ? 'titulo-descartado' : ''}">${livro.autor}</td>
            <td class="${livro.descartado ? 'titulo-descartado' : ''}">${livro.codigo}</td>
            <td style="color: ${livro.lido ? '#27ae60' : '#e74c3c'}; font-weight:bold;">
                ${livro.lido ? "Lido" : "Não Lido"}
            </td>
        `;
        corpoTabela.appendChild(tr);
    });

    if(contador) contador.textContent = `Exibindo ${lista.length} livro(s)`;
}

// ==========================================================
// 6. FUNÇÕES DE FILTRO E ORDENAÇÃO
// ==========================================================
// (Lógica permanece quase igual, pois filtramos por string, o que é OK para leitura)

function filtrarLivros() {
    const termo = document.querySelector("#pesquisar").value.toLowerCase();
    const todos = AlexandriaAPI.getLivros();

    listaAtualLivros = todos.filter(livro => 
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor.toLowerCase().includes(termo) ||
        livro.codigo.toLowerCase().includes(termo)
    );

    renderizarTabela(listaAtualLivros);
}

function filtrarPorGrupo(nomeGrupo) {
    const todos = AlexandriaAPI.getLivros();
    listaAtualLivros = todos.filter(livro => {
        if (livro.grupo) return livro.grupo === nomeGrupo;
        const prefixo = nomeGrupo.substring(0, 3).toUpperCase();
        return livro.codigo && livro.codigo.startsWith(prefixo + '-');
    });
    renderizarTabela(listaAtualLivros);
    const contador = document.querySelector("#contadorLivros");
    if(contador) contador.textContent = `Filtrado por Grupo: ${nomeGrupo} (${listaAtualLivros.length})`;
}

function filtrarPorSubgrupo(nomeGrupo, nomeSubgrupo) {
    const todos = AlexandriaAPI.getLivros();
    listaAtualLivros = todos.filter(livro => {
        if (livro.subgrupo && livro.grupo) {
            return livro.subgrupo === nomeSubgrupo && livro.grupo === nomeGrupo;
        }
        // Fallback para código antigo
        const preGrupo = nomeGrupo.substring(0, 3).toUpperCase();
        const preSub = nomeSubgrupo.substring(0, 3).toUpperCase();
        const busca = `${preGrupo}-${preSub}-`;
        return livro.codigo && livro.codigo.startsWith(busca);
    });
    renderizarTabela(listaAtualLivros);
    const contador = document.querySelector("#contadorLivros");
    if(contador) contador.textContent = `Filtrado: ${nomeGrupo} > ${nomeSubgrupo} (${listaAtualLivros.length})`;
}

function ordenarPor(criterio) {
    if (!direcaoOrdenacao[criterio] || direcaoOrdenacao[criterio] === 'desc') {
        direcaoOrdenacao[criterio] = 'asc';
    } else {
        direcaoOrdenacao[criterio] = 'desc';
    }

    const ordem = direcaoOrdenacao[criterio];

    listaAtualLivros.sort((a, b) => {
        let valorA = a[criterio];
        let valorB = b[criterio];

        if (typeof valorA === 'string') valorA = valorA.toLowerCase();
        if (typeof valorB === 'string') valorB = valorB.toLowerCase();

        if (valorA < valorB) return ordem === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordem === 'asc' ? 1 : -1;
        return 0;
    });

    renderizarTabela(listaAtualLivros);
}

function resetarTabela() {
    const inputPesquisa = document.querySelector("#pesquisar");
    if(inputPesquisa) inputPesquisa.value = ""; 
    listaAtualLivros = AlexandriaAPI.getLivros(); 
    renderizarTabela(listaAtualLivros);
}

// ==========================================================
// 7. EVENTOS DO SISTEMA
// ==========================================================

selectGrupo.addEventListener("change", () => {
    carregarSubgruposNoSelect(selectGrupo.value);
});

btnGerarCodigo.addEventListener("click", () => {
    const grpNome = selectGrupo.value;
    const subNome = selectSubgrupo.value;

    if (!grpNome || grpNome === "Grupo") return alert("Selecione um Grupo.");
    if (!subNome || subNome === "Subgrupo" || subNome === "SUBGRUPO") return alert("Selecione um Subgrupo.");

    const prefixoBusca = `${grpNome.substring(0, 3).toUpperCase()}-${subNome.substring(0, 3).toUpperCase()}-`;
    const livros = AlexandriaAPI.getLivros();
    let maiorVolume = 0;

    livros.forEach(livro => {
        if (livro.codigo && livro.codigo.startsWith(prefixoBusca)) {
            const partes = livro.codigo.split("-"); 
            const numeroLivro = parseInt(partes[2]);
            if (!isNaN(numeroLivro) && numeroLivro > maiorVolume) {
                maiorVolume = numeroLivro;
            }
        }
    });
    inputVolume.value = maiorVolume + 1;
});

// Cadastro
formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.querySelector("#titulo").value.trim();
    const autor = document.querySelector("#autor").value.trim();
    const editora = document.querySelector("#editora").value.trim();
    const edicao = document.querySelector("#edicao").value.trim();
    
    const grp = selectGrupo.value;
    const sub = selectSubgrupo.value;
    const vol = inputVolume.value.trim();

    if (!titulo || !autor || !editora || !edicao || !grp || !sub || !vol) {
        alert("Preencha todos os campos.");
        return; 
    }

    let codigoFinal = "S/C";
    if (grp && sub && vol) {
        codigoFinal = `${grp.substring(0,3).toUpperCase()}-${sub.substring(0,3).toUpperCase()}-${vol}`;
    }

    const novoLivro = {
        titulo, autor, editora, edicao, 
        codigo: codigoFinal, 
        lido: false,
        grupo: grp,      // Salvamos o NOME para exibição
        subgrupo: sub,   // Salvamos o NOME para exibição
        descartado: false,
        observacao: "" 
        // ID gerado automaticamente na API
    };

    AlexandriaAPI.adicionarLivro(novoLivro);
    atualizarInterfaceGeral(); 
    formCadastro.reset();
    document.querySelector("#titulo").focus();
});

// ==========================================================
// 8. EVENTOS DOS MODAIS E EDIÇÃO (COM IDs)
// ==========================================================

const toggleModal = () => {
    fade.classList.add("hide");
    modalGrupo.classList.add("hide");
    modalSubgrupo.classList.add("hide");
    modalEditarLivro.classList.add("hide");
    idLivroEmEdicao = null; // Limpa o ID em edição
};

[fade, ...btnsCancelar].forEach(el => el.addEventListener("click", toggleModal));

// Alterado: Recebe ID em vez de Index
window.abrirModalEdicao = function(id) {
    const livro = AlexandriaAPI.getLivroPorId(id);

    if (livro) {
        idLivroEmEdicao = id; // Armazena ID globalmente para salvar depois

        editTitulo.value = livro.titulo;
        editAutor.value = livro.autor;
        editEditora.value = livro.editora || "";
        editEdicao.value = livro.edicao || "";
        editCodigo.value = livro.codigo;
        editLido.value = livro.lido ? "true" : "false"; 
        editObservacao.value = livro.observacao || ""; 

        const inputsEdicao = formEdicaoBody.querySelectorAll("input, select");
        
        if (livro.descartado) {
            inputsEdicao.forEach(input => input.disabled = true);
            formEdicaoBody.classList.add("modal-bloqueado");
            editObservacao.disabled = false;
            
            btnSalvarEdicao.classList.remove("oculto");
            btnSalvarEdicao.textContent = "Salvar Observação"; 
            btnDescartarLivro.classList.add("oculto");
        } else {
            inputsEdicao.forEach(input => {
                if (input.id !== "editCodigo") input.disabled = false;
            });
            editObservacao.disabled = false;
            formEdicaoBody.classList.remove("modal-bloqueado");
            
            btnSalvarEdicao.classList.remove("oculto");
            btnSalvarEdicao.textContent = "Salvar Alterações";
            btnDescartarLivro.classList.remove("oculto");
        }

        fade.classList.remove("hide");
        modalEditarLivro.classList.remove("hide");
    } else {
        alert("Erro: Livro não encontrado.");
    }
};

btnSalvarEdicao.addEventListener("click", () => {
    if (!idLivroEmEdicao) return;

    const original = AlexandriaAPI.getLivroPorId(idLivroEmEdicao);
    if (!original) return;

    let livroEditado;

    if (original.descartado) {
        livroEditado = {
            ...original,
            observacao: editObservacao.value 
        };
    } else {
        livroEditado = {
            ...original, 
            titulo: editTitulo.value,
            autor: editAutor.value,
            editora: editEditora.value,
            edicao: editEdicao.value,
            lido: editLido.value === "true",
            observacao: editObservacao.value
        };
    }

    AlexandriaAPI.atualizarLivro(idLivroEmEdicao, livroEditado);
    atualizarInterfaceGeral();
    toggleModal();
});

btnDescartarLivro.addEventListener("click", () => {
    if (!idLivroEmEdicao) return;

    if(confirm("Descartar este livro?")) {
        const original = AlexandriaAPI.getLivroPorId(idLivroEmEdicao);
        
        const livroDescartado = {
            ...original,
            descartado: true,
            observacao: editObservacao.value 
        };

        AlexandriaAPI.atualizarLivro(idLivroEmEdicao, livroDescartado);
        atualizarInterfaceGeral();
        toggleModal();
    }
});

// Modais Grupo/Subgrupo
btnAbrirGrupo.addEventListener("click", () => {
    fade.classList.remove("hide");
    modalGrupo.classList.remove("hide");
    inputNomeNovoGrupo.value = "";
    inputNomeNovoGrupo.focus();
});

btnSalvarGrupo.addEventListener("click", () => {
    const nome = inputNomeNovoGrupo.value.trim();
    if (!nome) return alert("Digite um nome!");
    
    const gruposAtuais = AlexandriaAPI.getGrupos();
    if (gruposAtuais.some(g => g.nome.toLowerCase() === nome.toLowerCase())) {
        return alert("Grupo já existe!");
    }

    AlexandriaAPI.adicionarGrupo(nome);
    atualizarInterfaceGeral();
    toggleModal();
});

btnAbrirSub.addEventListener("click", () => {
    const grupos = AlexandriaAPI.getGrupos();
    if (grupos.length === 0) return alert("Crie um Grupo primeiro!");

    fade.classList.remove("hide");
    modalSubgrupo.classList.remove("hide");
    inputNomeNovoSub.value = ""; 

    selectGrupoParaSub.innerHTML = `<option value="" disabled selected>Selecione o grupo</option>`;
    grupos.forEach((g) => {
        let op = document.createElement("option");
        op.value = g.id; // USAMOS O ID NO VALUE AGORA
        op.textContent = g.nome;
        selectGrupoParaSub.appendChild(op);
    });
    inputNomeNovoSub.focus();
});

btnSalvarSub.addEventListener("click", () => {
    const idGrupo = selectGrupoParaSub.value; // Isso agora é o UUID
    const nomeSub = inputNomeNovoSub.value.trim();

    if (idGrupo === "") return alert("Escolha o Grupo!");
    if (!nomeSub) return alert("Digite o nome!");

    const grupos = AlexandriaAPI.getGrupos();
    const grupoAlvo = grupos.find(g => g.id === idGrupo);

    // Verifica duplicação no subgrupo
    const jaExiste = grupoAlvo.subgrupos.some(sub => 
        sub.nome.toLowerCase() === nomeSub.toLowerCase()
    );

    if (jaExiste) {
        return alert("Este subgrupo já existe neste grupo!");
    }

    AlexandriaAPI.adicionarSubgrupo(idGrupo, nomeSub);

    // Refresh no select principal se necessário
    if (selectGrupo.value === grupoAlvo.nome) {
        carregarSubgruposNoSelect(grupoAlvo.nome);
    }

    atualizarInterfaceGeral();
    inputNomeNovoSub.value = ""; 
    toggleModal();
});

// ==========================================================
// 9, 10, 11: FUNÇÕES DE EXPORT/IMPORT/THEME (Mantidas iguais)
// ==========================================================
// (Código de Exportar/Importar, Dark Mode e Excel mantém-se compatível)
// Apenas certifique-se de que ao importar JSON antigo, o lerTudo() vai rodar e adicionar IDs.

const btnExportar = document.querySelector("#btnExportar");
const btnImportar = document.querySelector("#btnImportar");
const inputArquivoJson = document.querySelector("#inputArquivoJson");

btnExportar.addEventListener("click", (e) => {
    e.preventDefault();
    const dados = AlexandriaAPI.lerTudo();
    const jsonString = JSON.stringify(dados, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alexandria_backup_${dataFormatada}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

btnImportar.addEventListener("click", (e) => { e.preventDefault(); inputArquivoJson.click(); });

inputArquivoJson.addEventListener("change", (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = (evento) => {
        try {
            const dadosCarregados = JSON.parse(evento.target.result);
            if (!dadosCarregados.grupos || !dadosCarregados.livros) throw new Error("Inválido!");
            
            if(confirm("Substituir todos os dados?")) {
                AlexandriaAPI.salvarTudo(dadosCarregados);
                // Ao chamar lerTudo, a migração roda se necessário
                AlexandriaAPI.lerTudo(); 
                atualizarInterfaceGeral();
                alert("Restaurado!");
            }
        } catch (erro) {
            alert("Erro: " + erro.message);
        }
        inputArquivoJson.value = "";
    };
    leitor.readAsText(arquivo);
});

function iniciarDarkMode() {
    const btnTema = document.querySelector("#btnTema");
    if(!btnTema) return;
    const temaSalvo = localStorage.getItem("temaAlexandria");
    if (temaSalvo === "dark") {
        document.body.classList.add("dark-mode");
        btnTema.textContent = "☀ Luz";
    } else {
        btnTema.textContent = "🌙 Tema";
    }
    btnTema.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("temaAlexandria", isDark ? "dark" : "light");
        btnTema.textContent = isDark ? "☀ Luz" : "🌙 Tema";
    });
}

const btnExcel = document.querySelector("#btnExcel");
const btnResetar = document.querySelector("#btnResetar");

btnExcel.addEventListener("click", (e) => {
    e.preventDefault();
    const livros = AlexandriaAPI.getLivros();
    if (livros.length === 0) return alert("Sem dados.");

    let csvContent = "ID;Título;Autor;Editora;Edição;Código;Lido;Descartado;Observação\n";
    livros.forEach(l => {
        const linha = [
            l.id, // Exporta ID também
            l.titulo, l.autor, l.editora || "", l.edicao || "",
            l.codigo, l.lido ? "Sim" : "Não", l.descartado ? "Sim" : "Não",
            (l.observacao || "").replace(/\n/g, " ")
        ].join(";");
        csvContent += linha + "\n";
    });

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `alexandria_livros.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

btnResetar.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Apagar TUDO permanentemente?")) {
        localStorage.removeItem(AlexandriaAPI.key);
        window.location.reload();
    }
});