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

    // Build the order summary with item subtotals
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

    // Open Messenger chat with prefilled message
    const encodedMessage = encodeURIComponent(orderSummary);
    const finalLink = `${messengerChatLink}?text=${encodedMessage}`;
    window.open(finalLink, '_blank', 'noopener');

    // Clear cart and input fields
    cart = [];
    updateCartDisplay();
    document.getElementById('customer-name').value = '';
    document.getElementById('pickup-time').value = '';

    alert('Your order is being sent via Messenger!');
}
