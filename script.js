const QS = (elementos) => document.querySelector(elementos);
const QSA = (elementos) => document.querySelectorAll(elementos);

let modalQt = 1;
let modalKey = 0;
let carrinho = [ ];

//faz uma lista com todos os produtos
coffeJson.map(
    (item, index) => {       
        let itemCardapio = QS('.models .coffe-item').cloneNode(true);
        itemCardapio.setAttribute('data-key', index);

        //separa as propriedades de cada item
        itemCardapio.querySelector('.coffe-item--img img').src = item.img;
        itemCardapio.querySelector('.coffe-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
        itemCardapio.querySelector('.coffe-item--name').innerHTML = item.name;
        itemCardapio.querySelector('.coffe-item--desc').innerHTML = item.description;
        QS('.coffe-area').append(itemCardapio);

        //MODAL
        //igora a ação padrão do link nos produtos e abre o modal
        itemCardapio.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();

            modalQt = 1;
            QS('.coffeWindowArea').style.opacity = 0;
            QS('.coffeWindowArea').style.display = 'flex';

            //alteração de opacidade para aparecer a transição do modal. 
            //(como no *.css a propriedade transition está definida para 0.5, este intervalo fará uma transição de opacidade )
            setTimeout(() => {
                QS('.coffeWindowArea').style.opacity = 1;
            }, 200)

            //informações para o modal
            let key = e.target.closest('.coffe-item').getAttribute('data-key');
            modalKey = key;

            QS('.coffeBig img').src = coffeJson[key].img;
            QS('.coffeWindowArea h1').innerHTML = coffeJson[key].name;
            QS('.coffeInfo--desc').innerHTML = coffeJson[key].description;
            QS('.coffeInfo--actualPrice').innerHTML = `R$ ${coffeJson[key].price.toFixed(2)}`;
            QS('.coffeInfo--size.selected').classList.remove('selected');

            //reinicia o modal para a opção média sempre que for aberto
            QSA('.coffeInfo--size').forEach((size, sizeIndex) => {
                //0 = P,  1 = M e 2 = G //
                if (sizeIndex == 1) {
                    size.classList.add('selected');
                }

                size.querySelector('span').innerHTML = coffeJson[key].sizes[sizeIndex];
            });

            QS('.coffeInfo--qt').innerHTML = modalQt;

        });

    });

//MODAL events
function closeModal() {
    QS('.coffeWindowArea').style.opacity = 0;
    setTimeout(() => {
        QS('.coffeWindowArea').style.display = 'none';
    }, 500)   
}
//sai do modal caso usuário tecle e solte <esc>
document.addEventListener('keydown', function(event){
    if(event.key === "Escape"){
        closeModal()
    }
});

//gera um array com os botões de cancelar
QSA('.coffeInfo--cancelButton, .coffeInfo--cancelMobileButton').forEach( 
    (item) =>  item.addEventListener('click', closeModal) );

//buttons

QS('.coffeInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        QS('.coffeInfo--qt').innerHTML = modalQt;
    }
});

QS('.coffeInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    QS('.coffeInfo--qt').innerHTML = modalQt;
});

QSA('.coffeInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        QS('.coffeInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

QS('.coffeInfo--addButton').addEventListener('click', () => {  
    let size = parseInt( QS('.coffeInfo--size.selected').getAttribute('data-key') )
    let identifier = coffeJson[modalKey].id + "-" + size;
    let identifierKey = carrinho.findIndex((item) => item.identifier == identifier) ;

if (identifierKey > -1) {
    carrinho[identifierKey].qt += modalQt;
} else {
    carrinho.push({
        identifier,
        id  : coffeJson[modalKey].id,
        size,
        qt: modalQt
    });
}   
    closeModal();
    updateCarrinho();
});


//modal celular
QS('.menu-openner').addEventListener('click', () => {
    if (carrinho.length > 0) {
        QS('aside').style.left = 0;
    } 
});

QS('.menu-closer').addEventListener('click', () => {
    QS('aside').style.left = '100vw';
});


function updateCarrinho() {

    QS('.menu-openner span').innerHTML = carrinho.length;

    if (carrinho.length != 0) {
        QS('aside').classList.add('show');
        QS('.cart').innerHTML = '';
        
        let subtotal = 0
        let desconto = 0
        let total = 0


        //procura o id e retorna o array inteiro caso exista
        for(let i in carrinho){
            //produtos para carrinho
            let itemAdicionadoAoCarrinho = coffeJson.find((item) => item.id == carrinho[i].id);
            let itemCarrinho = QS('.models .cart--item').cloneNode(true);
            let itemSizeName;
            QS('.cart').append(itemCarrinho);
            switch (carrinho[i].size) {
                case 0:
                    itemSizeName = "P"
                    break;
                case 1:
                    itemSizeName = "M"
                    break;
                case 2:
                    itemSizeName = "G"
                    break;
            }

            let itemNameCarrinho = `${itemAdicionadoAoCarrinho.name} (${itemSizeName})`


            //informações de preço e desconto
            subtotal = itemAdicionadoAoCarrinho.price * carrinho[i].qt;

            itemCarrinho.querySelector('img').src = itemAdicionadoAoCarrinho.img;
            itemCarrinho.querySelector('.cart--item-nome').innerHTML = itemNameCarrinho
            itemCarrinho.querySelector('.cart--item--qt').innerHTML = carrinho[i].qt        
            
            itemCarrinho.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (carrinho[i].qt > 1) {
                    carrinho[i].qt--;
                } else {
                    carrinho.splice(i, 1);
                    updateCarrinho();
                }

            });

            itemCarrinho.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                carrinho[i].qt++;
                updateCarrinho();

            });

        };

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        QS('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        QS('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        QS('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
    //caso carrinho vazio, fecha visualização...
    }  else {
        QS('aside').classList.remove('show');
        QS('aside').style.left = '100vw';
    } 

}