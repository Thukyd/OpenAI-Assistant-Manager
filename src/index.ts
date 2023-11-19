
import initializeAssistant from "./openai/initial_assistant";

async function main() {

    // either fetch the existing assistant or create a new one
    try {
        const assistant = await initializeAssistant();
        console.log("Assistant initialized:", assistant);
    } catch (error) {
        console.error("Failed to initialize assistant:", error);
    }

    // TODO: if initial assistant exists, check if the description / model / etc. is still up to date
    // probably smart to do that in the same initial assistant script as well in the same function
    // there should be logs for each change

}

main();
