"""Simple Question Fetcher and Display App"""
import os
import gradio as gr
import requests
import random
from langchain_core.messages import HumanMessage
from my_agent import build_agent

# Constants
DEFAULT_API_URL = "https://agents-course-unit4-scoring.hf.space"

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

def get_random_question():
    """
    Fetch a random question from the API and return it.
    """
    api_url = DEFAULT_API_URL
    questions_url = f"{api_url}/random-question"

    try:
        response = requests.get(questions_url, timeout=15)
        response.raise_for_status()
        questions_data = response.json()
        
        if not questions_data:
            return ""
        question = questions_data['question']
        task_id = questions_data['task_id']
        file_name = questions_data['file_name']
        if file_name:
            file_url = f"{api_url}/files/{task_id}"
            response = requests.get(file_url, timeout=15)
            response.raise_for_status()
            file_content = response.content
            file_path = f"temp_file_{file_name}"
            with open(file_path, 'wb') as f:
                f.write(file_content)
            return f"{question}\n---\n---\nfile_path:{file_path}"
        return f"{question}\n---\n---\nfile_path:None"
    except Exception as e:
        print(f"Error fetching questions: {e}")
        return []

def agent_response(message, _):
    agent = BasicAgent()
    response = agent(message)
    # print(response)
    try:
        yield response.split('FINAL ANSWER:')[1]
    except:
        yield response

current_question = get_random_question()

def fetch_new_question():
    global current_question
    print("Fetching new question...")
    current_question = get_random_question()

with gr.Blocks() as demo:
    gr.ChatInterface(
        agent_response,
        chatbot=gr.Chatbot(height=600, type='messages'),
        textbox=gr.Textbox(placeholder="Ask a question...", container=False, scale=7),
        title="Question Chat",
        description="Making it work",
        theme="soft",
        examples=[[current_question]],
        cache_examples=False,
        type="messages"
    )
    new_question_button = gr.Button("Fetch New Question")
    new_question_button.click(fetch_new_question, inputs=[], outputs=[])

if __name__ == "__main__":
    print("\n" + "-"*30 + "Test Agent" + "-"*30)
    demo.launch(debug=True, share=False)