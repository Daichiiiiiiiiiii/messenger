let currentUser = ''; // Store the current user
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const replyContainer = document.getElementById('replyContainer'); // Container for reply context
const chatContainer = document.querySelector('.chat-container');

function selectUser(user) {
    currentUser = user; // Set the current user
    chatContainer.style.display = 'block'; // Show the chat container
    document.getElementById('loginMessage').textContent = `You logged in as ${user}`; // Set the login message
    document.getElementById('loginMessage').style.display = 'block'; // Show the login message

    // Clear the chat box before loading messages to prevent duplicates
    chatBox.innerHTML = '';
    loadMessages(); // Load previous messages
}

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(msg => addMessage(msg.content, msg.sender, false));
}

function addMessage(content, sender, save = true) {
    const message = document.createElement('div');

    if (sender === currentUser) {
        message.classList.add('message', 'sent'); // Current user's messages on the right
    } else {
        message.classList.add('message', 'received'); // Other user's messages on the left
        message.addEventListener('click', () => replyToMessage(content, sender)); // Add click event for replies
    }

    message.textContent = content; // Only show the message content

    const time = document.createElement('span');
    time.classList.add('timestamp');
    time.textContent = new Date().toLocaleTimeString(); // Get current time
    message.appendChild(time);

    chatBox.appendChild(message);

    if (save) saveMessage(content, sender);

    scrollToBottom(); // Scroll to the latest message after adding a new one
}

function saveMessage(content, sender) {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push({ content, sender });
    localStorage.setItem('messages', JSON.stringify(messages));
}

sendBtn.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        addMessage(messageText, currentUser); // Add message from the current user
        messageInput.value = ''; // Clear input after sending
        clearReply(); // Clear any reply context
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

// Clear Messages Functionality
const clearBtn = document.getElementById('clearBtn'); // Get the Clear Messages button
clearBtn.addEventListener('click', clearMessages); // Add event listener for the button

function clearMessages() {
    let confirmCount = 0; // Initialize confirmation count

    // Loop to ask for confirmation three times
    while (confirmCount < 3) {
        const userConfirmed = confirm("Ano sure kana ba na dedelete mo ha sira ulo ka pala eh!!!!");
        if (userConfirmed) {
            confirmCount++; // Increment count if confirmed
        } else {
            return; // Exit if the user cancels
        }
    }
    chatBox.innerHTML = ''; // Clear the chat box
    localStorage.removeItem('messages'); // Remove messages from localStorage
    alert("Messages have been cleared."); // Optional alert for confirmation
}

// Function to scroll to the latest message
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat box
}

// Function to handle replying to a message
function replyToMessage(content, sender) {
    messageInput.value = `Replying to ${sender}: ${content}`; // Populate the input with the message content
    messageInput.focus(); // Focus on the input field for editing
    displayReplyContext(content, sender); // Show reply context
}

// Function to display reply context
function displayReplyContext(content, sender) {
    replyContainer.innerHTML = `<strong>Replying to ${sender}:</strong><br><em>${content}</em>`;
    replyContainer.style.display = 'block'; // Show reply context
}

// Function to clear reply context
function clearReply() {
    replyContainer.innerHTML = ''; // Clear reply context
    replyContainer.style.display = 'none'; // Hide reply context
}
