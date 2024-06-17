// checkout.js
document.querySelector('.js-checkout-items').innerHTML = `Checkout (${updateCartQuantity()} items)`;

function updateOrderSummary() {
    let subtotal = 0;
    let shipping = 499;
    let itemCount = 0;

    cart.forEach(item => {
        let productId = item.productId;
        let matchingProduct = products.find(product => product.id === productId);

        if (matchingProduct) {
            subtotal += matchingProduct.product.priceCents * item.quantity;
            itemCount += item.quantity;
        }
    });

    let tax = subtotal * 0.1;
    let total = subtotal + tax + shipping;
    if (total === 499) {
        total = 0;
    }

    document.getElementById('item-count').textContent = itemCount;
    document.getElementById('items-total').textContent = `$${(subtotal / 100).toFixed(2)}`;
    document.getElementById('subtotal').textContent = `$${((subtotal + shipping) / 100).toFixed(2)}`;
    document.getElementById('tax').textContent = `$${(tax / 100).toFixed(2)}`;
    document.getElementById('total').textContent = `$${(total / 100).toFixed(2)}`;
}

function displayCartItems() {
    let cartHtml = '';

    cart.forEach(item => {
        let productId = item.productId;
        let matchingProduct = products.find(product => product.id === productId);

        if (matchingProduct) {
            cartHtml += `
                <div class="cart-item-container js-cart-item-container-${matchingProduct.product.id}">
                    <img src='${matchingProduct.product.image}' alt="${matchingProduct.product.name}">
                    <div class="cart-item-details">
                        <h3>${matchingProduct.product.name}</h3>
                        <div class="quantity">
                            Quantity: 
                            <input type="number" value="${item.quantity}" min="1" data-product-id="${productId}" class="quantity-input">
                        </div>
                        <div class="price">Price: $${(matchingProduct.product.priceCents * item.quantity / 100).toFixed(2)}</div>
                    </div>
                    <button class="js-delete-quantity-link" data-product-id="${productId}">Remove</button>
                </div>
            `;
        }
    });

    if (cart.length === 0) {
        cartHtml = '<p>Your cart is empty.</p>';
    }

    document.querySelector('.js-order-summary').innerHTML = cartHtml;

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (event) => {
            let productId = parseInt(event.target.dataset.productId);
            let newQuantity = parseInt(event.target.value);
            updateCartItemQuantity(productId, newQuantity);
            updateOrderSummary();
            displayCartItems();
        });
    });

    document.querySelectorAll('.js-delete-quantity-link').forEach(link => {
        link.addEventListener('click', () => {
            let productId = parseInt(link.dataset.productId);
            removeCartItem(productId);
            updateOrderSummary();
            displayCartItems();
        });
    });

    updateOrderSummary();
}

document.querySelector('.place-order-button').addEventListener('click', () => {
    let total = parseFloat(document.getElementById('total').textContent.slice(1));

    if (total !== 0) {
        let existingOrderDetails = JSON.parse(localStorage.getItem('orderDetails'));

        if (!Array.isArray(existingOrderDetails)) {
            console.warn('orderDetails is not an array. Resetting to an empty array.');
            existingOrderDetails = [];
        }

        const newOrderDetails = {
            items: cart,
            total: document.getElementById('total').textContent,
            deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() // 7 days from now
        };

        existingOrderDetails.push(newOrderDetails);
        localStorage.setItem('orderDetails', JSON.stringify(existingOrderDetails));
        cart = [];
        saveToStorage();
        window.location.href = 'order.html';
    } else {
        alert("Your cart total is zero. Please add items to the cart before placing an order.");
    }
});

displayCartItems();
