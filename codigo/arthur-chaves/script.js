


const nome = document.getElementById("form-name");
const telefone = document.getElementById("form-tel");
const loc = document.getElementById("form-loc");
const email = document.getElementById("form-email");  
const form = document.getElementById("formulario");

function validarConta(promotores){
    return promotores.some(
        (user) => user.email.toLowerCase() === promotor.email.toLowerCase()
      );
}

function listaPromotoresDel(){
    const promotores = JSON.parse(localStorage.getItem("promotores")) || [];
    console.log(promotores)
    let lista = document.getElementById("select-promotor")
    for(let i = 0; i < promotores.length; i++){
        lista.insertAdjacentHTML("beforeend", `<option value="${promotores[i]["email"]}">${promotores[i]["nome"]} - ${promotores[i]["email"]}</option>`);
    }
}

function deletarPromotor(){
    const formDel = document.getElementById("formulario-del")
    formDel.addEventListener("submit", () => {
        const promotores = JSON.parse(localStorage.getItem("promotores")) || [];
        const email = document.getElementById("select-promotor")
        if(!email.value){
            alert("É necessário selecionar o usuário antes de deletá-lo!")
            formDel.reset();
            return;
        }
        for(let i = 0; i < promotores.length; i++){
            if(promotores[i]["email"] === email.value){
                promotores.splice(i, i)
            }
        }
        localStorage.setItem("promotores", JSON.stringify(promotores));
        alert("Usuário deletado com sucesso!");
        formDel.reset();
    })

}

function cadastrarPromotor(){
    
    form.addEventListener("submit", function (cadastro) {
        cadastro.preventDefault();
        if (!validarValores()) return;
        
        const promotor = {
            nome: nome.value.trim(),
            telefone: telefone.value.trim(),
            loc: loc.value.trim(),
            email: email.value.trim(),
          };
        
          const promotores = JSON.parse(localStorage.getItem("promotores")) || [];
          
          const teste = validarConta(promotores)
          if (teste) {
            alert("E-mail já veinculado a uma conta!.");
            email.focus();
            return;
          }

          promotores.push(promotor);
          localStorage.setItem("promotores", JSON.stringify(promotores));
        
          alert("Usuário cadastrado com sucesso!");
          form.reset();
        });
}

function validarValores(){
        let teste = true;
        // TESTA O TAMANHO DO NOME
        if (nome.value.trim().length < 5) {
            alert('O nome deve ter pelo menos 5 caracteres.');
            nome.focus();  
            teste = false;  
        // TESTA SE TEM NUMERO NO NOME
        } else if (/\d/.test(nome.value.trim())) {
            alert('O nome não pode conter números.');
            nome.focus();
            teste = false;
        } 
        // TESTA SE O EMAIL É VALIDO
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        if (!emailValido) {
            alert('Por favor, insira um e-mail válido.');
            email.focus();
            teste = false;
        }
        // TESTA O FORMATO DO TELEFONE
        const telefoneValido = /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone.value.trim());
        if (!telefoneValido) {
            alert('O telefone deve estar no formato (XX) XXXXX-XXXX.');
            telefone.focus();
            teste = false;
        }
        // TESTE MUITO BASICO NA LOCALIZAÇÃO
        if (loc.value.trim().length < 3) {
            alert('A localização deve ter pelo menos 3 caracteres.');
            loc.focus();  
            teste = false;  
        }   
        return teste
}

function validarTel(){
        telefone.addEventListener('input', function () {
        let valor = telefone.value.replace(/\D/g, ''); 

        if (valor.length > 11) {
            valor = valor.slice(0, 11); 
        }

        
        if (valor.length > 6) {
            telefone.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
        } else if (valor.length > 2) {
            telefone.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
        } else {
            telefone.value = `(${valor}`;
        }
    });
}
