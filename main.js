(function () {
    var btn_ler = document.getElementById('ler');
    var btn_gravar = document.getElementById('gravar');
    var btn_incluir = document.getElementById('incluir');
    var textArea = document.getElementById('json');


    var cont_id = 0;
    btn_ler.addEventListener("click", lerPessoa, false); 
    btn_incluir.addEventListener("click", incluirPessoa, false);
    btn_gravar.addEventListener("click", gravarPessoa, false); 

     
    var pessoas = [];
    var arrayFinal = {pessoas};
    textArea.value = JSON.stringify(arrayFinal, null, 8);

   function lerPessoa(e){
    
        e.preventDefault();
        var url = window.location.href;
        var ajax = new XMLHttpRequest();
        ajax.open('GET', url+'model/pessoa.php?action=ler');
        ajax.send();

            ajax.addEventListener('readystatechange', function(e){
                
            if(ajax.readyState===4 && ajax.status===200){
               
                var dados = ajax.responseText;
                    ultimoLido = dados;
                    var jsontext = JSON.parse(dados);
                    var arrayPessoas = jsontext.pessoas;
                    var tabelas = document.getElementById("tabelas");
                    tabelas.innerHTML = "";
                    pessoas = [];
                    arrayPessoas.forEach(function(item,value){
                        idPai = value;
                        criarTabela(item.nome, idPai);

                        if(item.filhos!= undefined){
                            arrayFilhos = item.filhos;
                            if(arrayFilhos.length>0){
                                arrayFilhos.forEach(function(filho, key){
                                    criarTabelaFilhos(idPai,filho.nome);
                                });
                                
                            }
                        }
                        
                    
                    }); 
                    arrayFinal = {pessoas}
                    textArea.value = JSON.stringify(arrayFinal, null, 8);
            }
            },false);
    }

    function gravarPessoa(e){
        e.preventDefault();
        var url = window.location.href;
        var ajax = new XMLHttpRequest();
        var dados_pessoas = "json=" + JSON.stringify(textArea.value);
        
        if(textArea.value!=""){

            ajax.open('POST', url+'model/pessoa.php?action=gravar')
            ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajax.send(dados_pessoas);
            ajax.addEventListener('readystatechange', function(e){
                if(ajax.readyState===4 && ajax.status===200){
                    var dados = ajax.responseText;
                    if(dados == "SUCESS"){
                        alert("Sucesso");
                    }else{
                        alert("Ocorreu um erro ao gravar");
                    }
                }
                },false);

        }
    }

    function incluirPessoa(e){
        e.preventDefault();
        
        var campo_pessoa = document.getElementById("pessoa");
        var pessoa_nome = campo_pessoa.value;

        if(pessoa_nome!="" && pessoa_nome != null){
            
            criarTabela(pessoa_nome, cont_id);
            textArea.value = JSON.stringify(arrayFinal, null, 8);
            campo_pessoa.value="";
            cont_id++;
        }
        
    }

    function removerPessoa(e){
        e.preventDefault();
        var id_pessa = this.getAttribute('id_pessoa');
        var tabelas = document.getElementById("tabelas");
        var tabela_pessoa = document.getElementById('pessoa_'+id_pessa);
        pessoas.splice(id_pessa,1);
        tabelas.removeChild(tabela_pessoa);
        textArea.value = JSON.stringify(arrayFinal, null, 8);
    }

    function adicionarFilho(e){
        e.preventDefault();
        var id = this.getAttribute('pessoa_id');
        var nome_filho = prompt('informe o nome');
        if(nome_filho!="" && nome_filho!=null){
            criarTabelaFilhos(id,nome_filho);
            textArea.value = JSON.stringify(arrayFinal, null, 8);
        }
        
        
    }

    function removerFilho(e){
        e.preventDefault();
        var id_filho = this.getAttribute('linha_filho');
        var id_tbody = this.getAttribute('tbody');
        var filho_removido = this.getAttribute('posicao_filho');
        var tbody = document.querySelector('[pessoa_tbody="'+id_tbody+'"]');
        var tr_filho = tbody.querySelector('[filho="'+id_filho+'"]');
        console.log(filho_removido);
        pessoas[id_tbody].filhos.splice(filho_removido,1);

        tbody.removeChild(tr_filho);
        var tbody = document.querySelector('[pessoa_tbody="'+id_tbody+'"]');
        var trFilhos = tbody.querySelectorAll('.btnRemoveFilho');

        trFilhos.forEach(function(index, value){
            index.setAttribute('posicao_filho', value);
        });

        textArea.value = JSON.stringify(arrayFinal, null, 8);
    }

    function criarTabelaFilhos(idPai, nome_filho){
        var id = idPai;
        var tbody = document.querySelector('[pessoa_tbody="'+id+'"]');
        var total_filhos = tbody.rows.length;
        var cont_filho = parseInt(total_filhos);
        var tr = document.createElement("tr");
        tr.className = "trFilho";
        tr.setAttribute('filho', cont_filho);
        var tdNomeFilho = document.createElement("td");
        var tdremoverFilho = document.createElement("td");
        var btnRemoverFilho =  document.createElement("button");
        btnRemoverFilho.textContent = "Remover filho";
        btnRemoverFilho.id = cont_filho;
        btnRemoverFilho.className = "btnRemoveFilho";
        btnRemoverFilho.setAttribute('linha_filho', cont_filho);
        btnRemoverFilho.setAttribute('posicao_filho', cont_filho-1);
        btnRemoverFilho.setAttribute('tbody', id);

        nome_filho_p = document.createTextNode(nome_filho);

        tdNomeFilho.appendChild(nome_filho_p);
        tdremoverFilho.appendChild(btnRemoverFilho);
        tr.appendChild(tdNomeFilho);
        tr.appendChild(tdremoverFilho);
        tbody.appendChild(tr);

        var botoesRemoverFilho = document.querySelectorAll('.btnRemoveFilho');

        botoesRemoverFilho.forEach(function(item) {
                item.addEventListener('click',removerFilho, false);
        });
        
        pessoas[id].filhos.push(nome_filho);
        
    }

    function criarTabela(nome_pes, pessoaId){
       
            var tabelas = document.getElementById("tabelas");
            var div_pessoa = document.createElement("div");
            div_pessoa.id = "pessoa_"+pessoaId;
            div_pessoa.className = "divPessoa";
            var tabela_pessoa = document.createElement("table");
            var tbody = document.createElement('tbody');
            tbody.setAttribute('pessoa_tbody', pessoaId);
            var tr = document.createElement("tr");
            
            tr.className="tr_pai";
            var tdNome = document.createElement("td");
            var tdremover = document.createElement("td");

            var btnRemover = document.createElement('button');
            btnRemover.textContent= "Remover";
            btnRemover.id = "remover_"+pessoaId;
            btnRemover.className = "btnRemoverPessoa";
            btnRemover.setAttribute('id_pessoa', pessoaId);

            var btnAddFilho = document.createElement('button');
            btnAddFilho.textContent= "Adicionar filho";
            btnAddFilho.id = 'addFilho_'+pessoaId;
            btnAddFilho.className = "btnAddFilho";
            btnAddFilho.setAttribute('pessoa_id', pessoaId);
        
            pessoa_nome = document.createTextNode(nome_pes);
            div_pessoa.appendChild(tabela_pessoa);
            div_pessoa.appendChild(btnAddFilho);
            tabela_pessoa.appendChild(tbody);
            tbody.appendChild(tr);
            tr.appendChild(tdNome);
            tdNome.appendChild(pessoa_nome);
            tr.appendChild(tdremover);
            tdremover.appendChild(btnRemover);
            tabelas.appendChild(div_pessoa);

            var botoesAddFilho = document.querySelectorAll('.btnAddFilho');

            botoesAddFilho.forEach(function(item) {
                item.addEventListener('click',adicionarFilho, false);
            });

            var botoesRemoverPessoa = document.querySelectorAll('.btnRemoverPessoa');

            botoesRemoverPessoa.forEach(function(item) {
                item.addEventListener('click',removerPessoa, false);
            });
            var pessoa = new Object();
                pessoa.nome = nome_pes;
                pessoa.filhos = [];
                pessoas.push(pessoa);

                
                
            
    }



})();