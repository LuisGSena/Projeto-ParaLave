var estrelas = document.querySelectorAll('.icone-estrela');

document.addEventListener('click',function(e){
    var classEstrela = e.target.classList;
    if(!classEstrela.contains('ativo')){
        estrelas.forEach(function(estrela){
            estrela.classList.remove('ativo');
        });
        classEstrela.add('ativo');
        console.log(e.target.getAttribute('data-avaliacao'));
    }
});