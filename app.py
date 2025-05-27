"""Simple Question Fetcher and Display App"""
import gradio as gr
from langchain_core.messages import HumanMessage, AIMessage
from my_agent import build_agent

class BasicAgent:
    """A langgraph agent."""
    def __init__(self):
        print("BasicAgent initialized.")
        self.graph = build_agent()

    def __call__(self, conversation_messages: list) -> str:
        print(f"Agent received {len(conversation_messages)} messages.")
        if conversation_messages:
            # Optional: logging for checking message structure
            # print(f"First message content (type: {type(conversation_messages[0])}): {str(conversation_messages[0].content)[:50]}")
            # print(f"Last message content (type: {type(conversation_messages[-1])}): {str(conversation_messages[-1].content)[:50]}")
            pass

        response_data = self.graph.invoke({"messages": conversation_messages})
        
        for m in response_data["messages"]:
            m.pretty_print()
            
        answer = response_data['messages'][-1].content
        return answer

def agent_response(current_user_message: str, history_from_gradio: list):
    agent = BasicAgent()

    langchain_formatted_history = []
    for entry in history_from_gradio:
        role = entry.get("role")
        content = entry.get("content")
        if role == "user":
            langchain_formatted_history.append(HumanMessage(content=content))
        elif role == "assistant":
            langchain_formatted_history.append(AIMessage(content=content))
        else:
            print(f"Warning: Unknown role in history entry: {entry}")
            langchain_formatted_history.append(HumanMessage(content=str(content)))

    # Add the current user's message
    langchain_formatted_history.append(HumanMessage(content=current_user_message))

    response_content = agent(langchain_formatted_history)
    yield response_content

with gr.Blocks() as demo:
    gr.ChatInterface(
        agent_response,
        chatbot=gr.Chatbot(height=600, type='messages'),
        textbox=gr.Textbox(placeholder="Ask a question...", container=False, scale=7),
        title="Figaro",
        description="Making it work",
        theme="soft",
        examples=[["Explain this youtube video: https://www.youtube.com/watch?v=Qw6b1a2d3e4"],["what is the Capital of France?"]],
        cache_examples=False,
        type="messages"
    )

if __name__ == "__main__":
    print("\n" + "-"*30 + "Figaro" + "-"*30)
    demo.launch(debug=True, share=False)