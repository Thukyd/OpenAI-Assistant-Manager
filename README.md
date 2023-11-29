# OpenAI-Assistant-Manager

## Project Overview

This project follows two purposes:

1. Create a backend for the OpenAI Assistant functionalities to manage the assistant via code. This can be further used to create a web interface.
2. Create a an OpenAi Assistant to help players learn poker in Red Dead Redemption 2. It uses AI to analyze screenshots from the game and provides feedback on the poker gameplay.

## Status
[x] Create the backend to manage the assistant (create, store locally, update assistant)
[ ] Enable file upload to assistant
[ ] Create Assistant to analyze screenshots from the game

## What does the backend do?

1. **Create an assistant:** The assistant is created using the OpenAI API.
2. **Local assistant:** The assistant configs (id) is saved locally as a JSON file.
3. **Assistant management:** The assistant is managed via code, using the OpenAI API.

## How does the RDR2 Poker Assistant work?

1. **Capture:** Player takes a screenshot of their poker hand in the game.
2. **Upload:** The screenshot is uploaded to the assistant.
3. **Analysis:** The AI evaluates the image, identifying cards and game elements.
4. **Advice:** The assistant offers suggestions based on the current poker hand.
5. **Learn:** Aimed at improving poker decision-making skills within the game.

## Documentation Reference

This assistant is built following the instructional framework provided by OpenAI's GPT documentation, ensuring a robust and well-structured AI model for image analysis and learning. More information can be found in the OpenAI GPT [documentation](https://platform.openai.com/docs/assistants/overview).

## Contributions

Contributions from those with interest in gaming, AI, or software development are welcome. The project benefits from diverse perspectives and skills in enhancing its functionality and user experience.
