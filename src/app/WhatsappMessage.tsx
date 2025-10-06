export const contactMe = (phone = "250783330008", message = "Hi, I’m contacting you to learn more about how to place an order through your platform.") => {
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Build WhatsApp URL
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;

    // Open in a new tab
    window.open(url, "_blank");
};
