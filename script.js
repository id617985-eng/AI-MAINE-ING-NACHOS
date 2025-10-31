let cart = [];
const currencySymbol = '₱';
const messengerChatLink = 'https://www.messenger.com/e2ee/t/8941907542595225';

function addToCart(name, price, btn) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartDisplay();
    const cartBtn = document.getElementById('cart-trigger');
    cartBtn.classList.add('bouncing');
    setTimeout(() => cartBtn.classList.remove('bouncing'), 500);

    const img = btn.closest('.menu-item').querySelector('img');
    flyToCart(img);
}

function updateCartDisplay() {
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    
    cartItemsList.innerHTML = '';
    
    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li class="empty-cart">Your cart is empty.</li>';
        document.getElementById('checkout-btn').disabled = true;
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            totalItems += item.quantity;

            const li = document.createElement('li');
            li.innerHTML = `
                <span class="item-name">${item.name}</span>
                <div class="quantity-controls">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <span class="item-price">${currencySymbol}${itemTotal.toFixed(0)}</span>
            `;
            cartItemsList.appendChild(li);
        });
        document.getElementById('checkout-btn').disabled = false;
    }

    cartTotalElement.textContent = `${currencySymbol}${total.toFixed(0)}`;
    cartCountElement.textContent = totalItems;
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartDisplay();
}

function toggleCart() {
    document.getElementById('cart-popup').classList.toggle('hidden');
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const customerName = document.getElementById('customer-name').value.trim();
    const pickupTime = document.getElementById('pickup-time').value.trim();
    const paymentMethod = document.getElementById('payment-method').value;

    if (!customerName || !pickupTime) {
        alert('Please enter your Name and desired Pick-up Time!');
        return;
    }

    let orderSummary = `Hello! I'm placing an order for pick-up.
*CUSTOMER NAME: ${customerName}
*PICK-UP TIME: ${pickupTime}
*PAYMENT METHOD: ${paymentMethod}
--- ORDER DETAILS ---`;

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderSummary += `\n(${item.quantity}x) ${item.name} - ${currencySymbol}${item.price} each (Subtotal: ${currencySymbol}${itemTotal.toFixed(0)})`;
    });

    orderSummary += `\nTOTAL AMOUNT: ${currencySymbol}${total.toFixed(0)}
Please confirm this order and let me know when it's ready for pick-up! Thank you.`;

    const encodedMessage = encodeURIComponent(orderSummary);
    const finalLink = `${messengerChatLink}?text=${encodedMessage}`;
    window.open(finalLink, '_blank', 'noopener');

    cart = [];
    updateCartDisplay();
    document.getElementById('customer-name').value = '';
    document.getElementById('pickup-time').value = '';

    alert('Your order is being sent via Messenger!');
}

function flyToCart(img) {
    const cartBtn = document.getElementById('cart-trigger');
    const imgClone = img.cloneNode(true);
    const imgRect = img.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    imgClone.style.position = 'fixed';
    imgClone.style.top = imgRect.top + 'px';
    imgClone.style.left = imgRect.left + 'px';
    imgClone.style.width = imgRect.width + 'px';
    imgClone.style.height = imgRect.height + 'px';
    imgClone.style.transition = 'all 0.7s ease-in-out';
    imgClone.style.zIndex = 1000;
    document.body.appendChild(imgClone);

    setTimeout(() => {
        imgClone.style.top = cartRect.top + 'px';
        imgClone.style.left = cartRect.left + 'px';
        imgClone.style.width = '30px';
        imgClone.style.height = '30px';
        imgClone.style.opacity = '0.5';
    }, 10);

    setTimeout(() => {
        imgClone.remove();
    }, 710);
}

updateCartDisplay();
