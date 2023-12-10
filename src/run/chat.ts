import { Assistant } from "openai/resources/beta/assistants/assistants";
import client from '../openai/openai_client'; // Import the initialized OpenAI client

import initializeAssistant from "../openai/assistant_management";

function run_chat(assistant: Assistant) {
    client.beta.assistants.chat(assistant.id, {
        "prompt": "This is a test prompt",
        "temperature": 0.9,
        "max_tokens": 150,
        "stop": ["\n", " Human:", " AI:"]
    }).then((response) => {
        console.log("Response:", response);
    }).catch((error) => {
        console.error("Error:", error);
    });
    }
}

