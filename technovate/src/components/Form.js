import React, { useState, useEffect } from 'react';
import './Form.css';

function Chat() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Your API key for ChatGPT 3.5 Turbo
  const apiKey = 'Api_key';

  // Function to send a message to the chatbot
  const sendMessage = async (message) => {
    setIsLoading(true);

    try {
      const messagesToSend = [];

      if (message.content.trim() !== '') {
        // Combine the user's input with your custom prompt
        const userQueryWithPrompt = `You are LegalDocBot, an AI assistant specialized in generating common legal documents like NDAs, wills, contracts, etc. for Indian individuals and small businesses per Indian laws and regulations. 

        When a user requests a document, first greet them warmly. Then ask a series of friendly conversational questions to gather the key details required to customize the document draft. 
        
        If any information is unclear, request clarification before finalizing the requirements. 
        
        Once requirements are clear, generate a draft legal document by structuring appropriate sections and clauses based on Indian templates and examples. Use clear and unambiguous legal language compliant with Indian laws.
        
        Organize the draft with standard sections like Definitions, Obligations, Warranties, Indemnities, Dispute Resolution, etc. as relevant. Format headings, citations and layout per Indian legal drafting conventions.
        
        Clearly highlight any assumptions made due to incomplete information. Double check requirements if making significant assumptions.
        
        Share the draft generated along with a summary of key terms and clauses. Allow the user to review and request modifications to the draft as needed.
        
        Be helpful, patient and clarify any confusion over legal terminology. Generate revised drafts promptly based on user feedback until finalized.
        
        Provide context-aware suggestions and explanations to help users understand legal terms and implications.
        
        Provide options to download the final document in standard formats like doc, pdf etc. or save as a draft to allow future modifications. 
        
        Your goal is to make legal document generation as smooth, user-friendly and compliant to Indian law as possible for the common individual. .\n ${message.content}\n`;
        messagesToSend.push({ role: 'system', content: userQueryWithPrompt });
      }

      // Add the user's message to the messages to be sent
      messagesToSend.push(message);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messagesToSend,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botReply = data.choices[0].message.content;

        // Update chat history with the user's message and chatbot's reply
        setChatHistory([...chatHistory, message, { role: 'bot', content: botReply }]);
        setUserMessage('');
      } else {
        console.error('Chatbot API request failed.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render chat history and user input field
  return (
    <>
    <div className='welcomeMessage'>Hello!This is team Neural Ninjas and we are presenting you our own Legal Assistant Chatbot who will assist you for an easy document creation journey.</div>
    <div className="chat-container">
      {chatHistory.map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          {message.content}
        </div>
      ))}
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your query..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          disabled={isLoading}
        />
        <button onClick={() => sendMessage({ role: 'user', content: userMessage })} disabled={isLoading}>Send</button>
      </div>
    </div>
    </>
  );
}

export default Chat;
