let cart = JSON.parse(localStorage.getItem('cart')) || [
  {
    productId: 1,
    quantity: 2
  },
  {
    productId: 11,
    quantity: 1
  }
];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
  let quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
  let matchItem;
  cart.forEach(item => {
    if (productId === item.productId) {
      matchItem = item;
    }
  });
  if (matchItem) {
    matchItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveToStorage();
  updateCartDisplay();
}

function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach(item => {
    cartQuantity += item.quantity;
  });
  return cartQuantity;
}

function updateCartDisplay() {

  const checkoutItems = document.querySelector('.js-checkout-items');
  if (checkoutItems) {
    checkoutItems.innerHTML = `Checkout (${updateCartQuantity()} items)`;
  }
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = updateCartQuantity();
  } else {
    console.log("Cart count element not found");
  }
}


function removeCartItem(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveToStorage();
    updateCartDisplay();
}

function updateCartItemQuantity(productId, newQuantity) {
    cart.forEach(item => {
        if (item.productId === productId) {
            item.quantity = newQuantity;
        }
    });
    saveToStorage();
    updateCartDisplay();
}


updateCartDisplay();
