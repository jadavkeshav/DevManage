export function formatMoney(amount) {
    if (isNaN(amount) || amount === null) {
        return '₹0.00'; // Handle invalid or null inputs
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
}
