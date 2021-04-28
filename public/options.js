const port = chrome.runtime.connect();
port.onMessage.addListener(message => {
    console.debug(message);
    if ("error" in message) {
        document.getElementById("error").textContent = message.error;
    } else if ("result" in message) {
        document.getElementById("result").textContent = message.result;
    }
});

document.getElementById("test-form").onsubmit = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    port.postMessage({ email, password });
}