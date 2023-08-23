document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://localhost:5005'); // Modify the socket connection as needed
  
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
  
    sendButton.addEventListener('click', () => {
      const userMessage = messageInput.value;
      if (userMessage.trim() !== '') {
        socket.emit('user_message', userMessage);
        messageInput.value = '';
  
        // Display the user message in the chat interface
        appendMessage('You', userMessage);
      }
    });
  
    socket.on('bot_response', (response) => {
      // Display the AI's response in the chat interface
      appendMessage('AI', response);
    });
  
    function appendMessage(sender, message) {
      const messageElement = document.createElement('div');
      messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });  