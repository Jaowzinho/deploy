function carregarImagem(event) {
    const preview = document.getElementById('previewImagem');
    const btnRemover = document.getElementById('btnRemoverImagem');
    const btnImgWrapper = document.getElementById('btnImgWrapper');
    const inputFile = event.target;
  
    if (inputFile.files && inputFile.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        btnRemover.style.display = 'inline-block';
        btnImgWrapper.classList.add('has-image');
  
        // Se existir o elemento com classe .btn-text dentro do btnImgWrapper, altera a cor
        const btnText = btnImgWrapper.querySelector('.btn-text');
        if (btnText) {
          btnText.style.color = 'transparent';
        }
      }
      reader.readAsDataURL(inputFile.files[0]);
    }
  }
  
  function removerImagem() {
    const preview = document.getElementById('previewImagem');
    const btnRemover = document.getElementById('btnRemoverImagem');
    const inputImagem = document.getElementById('inputImagem');
    const btnImgWrapper = document.getElementById('btnImgWrapper');
  
    preview.src = 'icones/adicionar.png';
    inputImagem.value = '';
    btnRemover.style.display = 'none';
    btnImgWrapper.classList.remove('has-image');
  
    const btnText = btnImgWrapper.querySelector('.btn-text');
    if (btnText) {
      btnText.style.color = '#007BFF';
    }
  }
  