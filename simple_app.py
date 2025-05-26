"""Simple Question Fetcher and Display App"""
import gradio as gr
from langchain_core.messages import HumanMessage
from my_agent import build_agent

class BasicAgent:
    """A langgraph agent."""
    def __init__(self):
        print("BasicAgent initialized.")
        self.graph = build_agent()

    def __call__(self, question: str) -> str:
        print(f"Agent received question (first 50 chars): {question[:50]}...")
        # Wrap the question in a HumanMessage from langchain_core
        messages = [HumanMessage(content=question)]
        messages = self.graph.invoke({"messages": messages})
        for m in messages["messages"]:
            m.pretty_print()
        answer = messages['messages'][-1].content
        return answer[14:]

def agent_response(message, _):
    agent = BasicAgent()
    response = agent(message)
    # print(response)
    try:
        yield response.split('FINAL ANSWER:')[1]
    except:
        yield response

with gr.Blocks() as demo:
    gr.ChatInterface(
        agent_response,
        chatbot=gr.Chatbot(height=600, type='messages'),
        textbox=gr.Textbox(placeholder="Ask a question...", container=False, scale=7),
        title="Question Chat",
        description="Making it work",
        theme="soft",
        examples=[["Explain this youtube video: https://www.youtube.com/watch?v=Qw6b1a2d3e4"]["what is the Capital of France?"],],
        cache_examples=False,
        type="messages"
    )

if __name__ == "__main__":
    print("\n" + "-"*30 + "Figaro" + "-"*30)
    demo.launch(debug=True, share=False)