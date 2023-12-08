
import initializeAssistant from "./openai/assistant_management";
import { AssistantCreateParams } from 'openai/resources/beta/assistants/assistants';

const assistantConfigs: AssistantCreateParams = {
    name: "Red Dead Redemption 2 - Poker Assistant",
    description: "",
    instructions: "You are an AI assistant that analyzes screenshots from Red Dead Redemption 2 poker games. Your task is to evaluate the current game situation from these images, offering strategic advice on poker hands and betting tactics. You educate players on evaluating cards and understanding game dynamics, guiding them towards making smart decisions. Your goal is to progressively teach players so they can eventually master poker strategy on their own.",
    model: "gpt-4-1106-preview",
    tools: [{ "type": "retrieval" }],
    file_ids: [],
    metadata: {}
};


// TODO: support file uploads for assistant creation

async function main() {
 
    // either fetch the existing assistant or create a new one
    try {
        const assistant = await initializeAssistant(assistantConfigs);
        console.log("Assistant:", assistant);
    } catch (error) {
        console.error("Failed to initialize assistant:", error);
    }

}

main();
