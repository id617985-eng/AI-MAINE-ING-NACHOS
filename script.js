<script>
let cart = [];
const currencySymbol = '₱';
const messengerUserId = '8941907542595225'; // Your FB Messenger Page/User ID

function addToCart(btn) {
    const menuItem = btn.closest('.menu-item');
    const name = menuItem.dataset.name;
    const price = parseFloat(menuItem.dataset.price);
    const img = menuItem.querySelector('img');

    const existingItem = cart.find(item => item.name === name);
    if(existingItem) { 
        existingItem.quantity += 1; 
    } else { 
        cart.push({name, price, quantity:1}); 
    }

    updateCartDisplay();

    const cartBtn = document.getElementById('cart-trigger');
    cartBtn.classList.add('bouncing');
    setTimeout(() => cartBtn.classList.remove('bouncing'), 500);

    flyToCart(img);
}

function updateCartDisplay() {
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');

    cartItemsList.innerHTML = '';
    let total = 0, totalItems = 0;

    if(cart.length === 0) { 
        cartItemsList.innerHTML = '<li>Your cart is empty.</li>'; 
        document.getElementById('checkout-btn').disabled = true;
    } else {
        cart.forEach((item,index)=>{
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            totalItems += item.quantity;

            const li = document.createElement('li');
            li.innerHTML = `<span>${item.name}</span>
                            <div class="quantity-controls">
                                <button onclick="changeQuantity(${index},-1)">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="changeQuantity(${index},1)">+</button>
                            </div>
                            <span>${currencySymbol}${itemTotal.toFixed(0)}</span>`;
            cartItemsList.appendChild(li);
        });
        document.getElementById('checkout-btn').disabled = false;
    }

    cartTotalElement.textContent = `${currencySymbol}${total.toFixed(0)}`;
    cartCountElement.textContent = totalItems;
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if(cart[index].quantity <= 0) cart.splice(index,1);
    updateCartDisplay();
}

function toggleCart() { 
    const popup = document.getElementById('cart-popup');
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block'; 
}

function checkout() {
    if(cart.length === 0){ 
        alert('Cart empty!'); 
        return; 
    }

    const customerName = document.getElementById('customer-name').value;
    const pickupTime = document.getElementById('pickup-time').value;
    const paymentMethod = document.getElementById('payment-method').value;

    if(!customerName || !pickupTime){ 
        alert('Enter Name & Pick-up Time!'); 
        return; 
    }

    // Pre-written message template
    let message = `🌽 *Ai-Maize-ing Nachos Order* 🌽\n\n`;
    message += `👤 Name: ${customerName}\n⏰ Pick-up: ${pickupTime}\n💰 Payment: ${paymentMethod}\n\n🛒 *Order Items:*\n`;

    let total = 0;
    cart.forEach(item => { 
        message += `- ${item.quantity} x ${item.name} = ${currencySymbol}${item.price * item.quantity}\n`; 
        total += item.price * item.quantity; 
    });
    message += `\n💵 *Total: ${currencySymbol}${total.toFixed(0)}*\n\n`;
    message += `Please prepare my order. Thank you! 🙌`;

    openMessenger(message);
}

// Open Messenger app on mobile or fallback to web
function openMessenger(message) {
    const mobileLink = `fb-messenger://user-thread/${messengerUserId}?text=${encodeURIComponent(message)}`;
    const webLink = `https://m.me/${messengerUserId}?ref=${encodeURIComponent(message)}`;

    // Try app first
    const newWindow = window.open(mobileLink, '_blank');

    // If app not opened, fallback to web after 1s
    setTimeout(() => {
        if(!newWindow || newWindow.closed){
            window.open(webLink, '_blank');
        }
    }, 1000);
}

function flyToCart(img) {
    const cartBtn = document.getElementById('cart-trigger');
    const clone = img.cloneNode(true);
    const rect = img.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    clone.style.position = 'fixed';
    clone.style.top = rect.top + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.transition = 'all 0.7s ease-in-out';
    clone.style.zIndex = 1000;
    document.body.appendChild(clone);

    setTimeout(() => {
        clone.style.top = cartRect.top + 'px';
        clone.style.left = cartRect.left + 'px';
        clone.style.width = '25px';
        clone.style.height = '25px';
        clone.style.opacity = '0.5';
    }, 10);

    setTimeout(() => clone.remove(), 710);
}

// Initialize
updateCartDisplay();
</script>
