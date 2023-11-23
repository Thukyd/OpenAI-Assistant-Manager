
import initializeAssistant from "./openai/initial_assistant";
import { AssistantCreateParams } from 'openai/resources/beta/assistants/assistants';

const assistantConfigs: AssistantCreateParams = {
    name: "Red Dead Redemption 2 - Poker Assistant",
    description: "",
    instructions: "You are an AI assistant that analyzes screenshots from Red Dead Redemption 2 poker games...",
    model: "gpt-4-1106-preview",
    tools: [{ "type": "code_interpreter" }],
    file_ids: [],
    metadata: {}
};


async function main() {

    // either fetch the existing assistant or create a new one
    try {
        const assistant = await initializeAssistant(assistantConfigs);
        console.log("Assistant initialized:", assistant);
    } catch (error) {
        console.error("Failed to initialize assistant:", error);
    }

    // TODO: if initial assistant exists, check if the description / model / etc. is still up to date
        // Maybe you should do that in a separate function. You will still go with the initial assistant, but you will update the description / model / etc. in a different function is
        // which is called in the initial assistant function
    // probably smart to do that in the same initial assistant script as well in the same function
    // there should be logs for each change

}

main();
