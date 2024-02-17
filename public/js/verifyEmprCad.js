
async function verificarcep() {

    const cep = document.querySelector("#endereco").value
    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`
    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log("nn achou a pasta")
    if (data && !data.erro) {
        document.querySelector("#bairro").value = data.bairro;
        document.querySelector("#Cidade").value = data.localidade;
        console.log("passou no if")
    }
}