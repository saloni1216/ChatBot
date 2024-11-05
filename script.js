const chatinput = document.querySelector(".chat-input textarea");
const sendchatbtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatToggler = document.querySelector(".chatbot-toggler");
const chatbotclosebtn = document.querySelector(".close-btn");

let usermessage;
const inputheight = chatinput ? chatinput.scrollHeight : 0; 

// Helper function to create chat list item
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    const chatcontent = className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatcontent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

// Function to generate a response using an API call
const generateResponse = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");
    const apiKey = "AIzaSyD_zlUtCGT216I0TvI9Xx6biExWHeNKWr0"; // Replace with your actual API key

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: {
                    text: usermessage
                }
            })
        });

        const data = await response.json();
        if (data && data.responses && data.responses[0] && data.responses[0].text) {
            messageElement.textContent = data.responses[0].text;
        } else {
            messageElement.textContent = "Sorry, I didn't get that.";
        }
    } catch (error) {
        console.error("Error fetching response:", error);
        messageElement.textContent = "There was an error getting a response.";
    }

    chatbox.scrollTo(0, chatbox.scrollHeight);
};

// Handling chat
const handlechat = () => {
    usermessage = chatinput.value.trim();
    if (!usermessage) return;

    chatinput.value = "";
    chatinput.style.height = `${inputheight}px`;

    chatbox.appendChild(createChatLi(usermessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi); // Pass chat li to the function
    }, 600);
};

// Event listeners for input and button
chatinput?.addEventListener("input", () => {
    chatinput.style.height = `${inputheight}px`;
    chatinput.style.height = `${chatinput.scrollHeight}px`;
});

chatinput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handlechat();
    }
});

sendchatbtn?.addEventListener("click", handlechat);

// Toggle chatbot visibility
chatbotclosebtn?.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatToggler?.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
