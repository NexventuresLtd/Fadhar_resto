export const contactMe = (phone = "250790110231", message = "Hello, Im Reaching out for information on how to order using the platform") => {
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Build WhatsApp URL
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;

    // Open in a new tab
    window.open(url, "_blank");
};
