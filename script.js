const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("adress")
const nameInput = document.getElementById("name")
const cityInput = document.getElementById("city")
const cepInput = document.getElementById("cep")
const addressWarn = document.getElementById("address-warn")

let cart=[];
//abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal()
    cartModal.style.display = "flex"
    
})

//fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if (event.target === cartModal) {
       cartModal.style.display = "none" 
    }

})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none" 
})

menu.addEventListener("click", function(event){

   let parentButtom = event.target.closest(".add-to-cart-btn")
   if (parentButtom) {
    const name = parentButtom.getAttribute("data-name")
    const price = parseFloat(parentButtom.getAttribute("data-price"))

    addToCart(name, price)

   }
    

})

//função para adicionar no carrinho

function addToCart(name, price){
    const existingItem = cart.find(item =>item.name === name)
    if (existingItem) {
        existingItem.quantity+=1;
        
    }else{
        cart.push(
            {
                name,
                price,
                quantity: 1,
            }
        )
    }
    updateCartModal()
}

//atualiza carrinho
function updateCartModal(params) {
    cartItemsContainer.innerHTML = "";
    let total =0;

    cart.forEach(item=>{
        const cartitemElement = document.createElement("div");
        cartitemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartitemElement.innerHTML = `

       <div class="flex items-center justify-between">
        <div>
          <P class="font-medium">${item.name}</P>  
          <P>Qtd: ${item.quantity}</P>
          <P class="font-medium mt-2">R$ ${item.price.toFixed(2)}</P>
        </div>

        
            <button class="remove-from-cart-btn" data-name="${item.name}"
            >
              remover
            </button>
       

       </div>
       `
        total += item.price * item.quantity;
        
       cartItemsContainer.appendChild(cartitemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;
}
//função remover do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name)
    }
})
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    
    if(index !== -1){
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

//clicar dados
addressInput.addEventListener("click", function(event){
    let inputValue = event.target.value;

    if(inputValue !==""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

nameInput.addEventListener("click", function(event){
    let inputValue = event.target.value;})

cepInput.addEventListener("click", function(event){
    let inputValue = event.target.value;})

    
cityInput.addEventListener("click", function(event){
    let inputValue = event.target.value;})

//finalizar pedido
checkoutBtn.addEventListener("click", function () {
    if (cart.length ===0) return;
        if (addressInput.value ==="") {
            addressWarn.classList.remove("hidden")
            addressInput.classList.add("border-red-500")
            return;
        }
    //enviar pepido para api do wpp
    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} | `
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone = "61994280344"
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value} | Nome: ${nameInput.value} | cep:${cepInput.value}  | Cidade: ${cityInput.value}`,  "_blank")

   cart = [];
   updateCartModal();
})