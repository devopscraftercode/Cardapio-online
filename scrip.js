const menu = document.getElementById('menu');
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");;
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addresssInput = document.getElementById("addresss");
const addressWarn = document.getElementById("address-warn");

let cart = [];


//Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

//fechar o modal do carrinho clicando fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//fechar o modal do carrinho clicando Fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    //console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn") // procurar uma classe precisa colocar o . antes do nome
    //console.log(parentButton)

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat (parentButton.getAttribute("data-price")) // para ser valor precisa utlizar o float

        //console.log(name)
        //console.log(price)


        //Adicionar no carrinho
        addToCart(name, price)
    }

})

//Função para adicionar no carrinho
function addToCart (name, price) {
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity +=1;
    }else {
        cart.push({
        name,
        price,
        quantity:1,
        })
    }

    updateCartModal()
}

//Atualiza o Carrinho
function updateCartModal () {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                
               
                <button class="remove-from-cart-btn py-1 px-4 hover:bg-red-500 hover:text-white hover:px-4 hover:py-1 hover:rounded" data-name="${item.name}">
                    Remover
                </button>
                
            </div>        
        `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    // Aqui você pode criar uma variável para armazenar o valor total
    const totalPrice = total;

    cartTotal.textContent = totalPrice.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}
//Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart (name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart[index];


        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        
        cart.splice(index, 1);
        updateCartModal();
        
    }
}

addresssInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if(inputValue !== "") {
        addresssInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")        
    }


})

//FInalizar o Pedido
checkoutBtn.addEventListener("click", function() {

    const isOpen = checkRestaurantOPen();
    if(!isOpen) {

        Toastify({
            text: "O Restaurante está fechado no momento",
            duration: 3000,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "rgb(255,100,100)",
            },
            
          }).showToast();


       
        return;
    }

    if(cart.length ===0) return;
    if(addresssInput.value === ""){
        addressWarn.classList.remove("hidden")
        addresssInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para API Whats
    const cartItems = cart.map((item) => {
        return `Quantidade (${item.quantity}) - ${item.name} - Preço: R$${(item.price * item.quantity).toFixed(2)} \n`;
    }).join("");

    // Calcula o valor total do carrinho
    let total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Abre uma nova janela do WhatsApp com a mensagem do pedido e o valor total
    const message = encodeURIComponent(`${cartItems} \n Valor Total: R$${total.toFixed(2)}`);
    const phone = "393286979406";
    window.open(`https://wa.me/${phone}?text=${message} \n Endereço: ${addresssInput.value}`, "_blank");

    // Limpa o carrinho e atualiza o modal do carrinho
    cart = [];
    updateCartModal();
});

// Verificar a hora e manipular o card Horario//
function checkRestaurantOPen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 16 && hora <22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOPen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}