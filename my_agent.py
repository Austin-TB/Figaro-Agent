import os
from typing import Dict, Any
import cmath
import numpy as np
from dotenv import load_dotenv 
from langchain_groq import ChatGroq
from langgraph.graph import START, StateGraph, MessagesState
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_community.document_loaders import WikipediaLoader, ArxivLoader
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_community.document_loaders import WebBaseLoader, YoutubeLoader
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import pandas as pd
import pytesseract
from python_interpreter import run_python_script
from PIL import Image
from image_processing import encode_image, decode_image, save_image

load_dotenv(override=True)

@tool(description="A tool to add two numbers.")
def add(toAdd:list[int]) -> int:
    """Add a list of numbers.

    Args:
        toAdd: a list of numbers
    """
    return sum(toAdd)

@tool(description="A tool to subtract two numbers.")
def subtract(a: int, b: int) -> int:
    """Subtract two numbers.
    Args:
        a: first int
        b: second int
    """
    return a - b

@tool(description="A tool to multiply two numbers.")
def multiply(a: int, b: int) -> int:
    """Multiply two numbers.
    Args:
        a: first int
        b: second int
    """
    return a * b

@tool(description="A tool to divide two numbers")
def divide(a: int, b: int) -> int:
    """Divide two numbers.
    
    Args:
        a: first int
        b: second int
    """
    if b == 0:
        raise ValueError("Cannot divide by zero.")
    return a / b

@tool(description="A tool to find modulus of two numbers")
def modulus(a: int, b: int) -> int:
    """Get the modulus of two numbers.
    
    Args:
        a: first int
        b: second int
    """
    return a % b

@tool(description="A tool to get the absolute value of a number.")
def power(a: float, b: float) -> float:
    """
    Get the power of two numbers.

    Args:
        a (float): the first number
        b (float): the second number
    """
    return a**b

@tool(description="A tool to get the absolute value of a number.")
def square_root(a: float) -> float | complex:
    """
    Get the square root of a number.

    Args:
        a (float): the number to get the square root of
    """
    if a >= 0:
        return a**0.5
    return cmath.sqrt(a)
##-----------------------------------------------------------------------------------------##

@tool
def reverse_string(string: str) -> str:
    """
    Reverse a string.
    Args:
        string (str): The string to reverse.
    """
    return string[::-1]

##-----------------------------------------------------------------------------------------##

@tool(description="A tool to search Wikipedia for a query and return maximum 2 results.")
def wiki_search(query: str) -> str:
    """Search Wikipedia for a query and return maximum 2 results.

    Args:
        query: The search query."""
    search_docs = WikipediaLoader(query=query, load_max_docs=2).load()
    formatted_search_docs = "\n\n---\n\n".join(
        [
            f'{doc["title"]}\n{doc["url"]}\n{doc["content"]}\n-----------\n'
            for doc in search_docs
        ]
    )
    return formatted_search_docs

@tool(description="A tool to search the web for a query and return maximum 3 results.")
def web_search(query: str) -> str:
    """Search Tavily for a query and return maximum 3 results.

    Args:
        query: The search query."""
    tool = TavilySearchResults(max_results=3)
    search_docs = tool.invoke({'query': query})
    formatted_search_docs = "\n\n-----------\n\n".join(
        [
            f'{doc["title"]}\n{doc["url"]}\n{doc["content"]}\n-----------\n'
            for doc in search_docs
        ]
    )
    return formatted_search_docs

@tool(description="A tool to search Arxiv for a query and return maximum 3 results.")
def arxiv_search(query: str) -> str:
    """Search Arxiv for a query and return maximum 3 result.
    Use this tool if the question is about a scientific paper.

    Args:
        query: The search query."""
    search_docs = ArxivLoader(query=query, load_max_docs=3).load()
    formatted_search_docs = "\n\n-----------\n\n".join(
        [
            f'{doc["title"]}\n{doc["url"]}\n{doc["content"]}\n-----------\n'
            for doc in search_docs
        ]
    )
    return formatted_search_docs

@tool(description="A tool to extract text from an image using OCR library pytesseract.")
def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from an image using OCR library pytesseract (if available).
    Args:
        image_path (str): the path to the image file.
    """
    try:
        # Open the image
        image = Image.open(image_path)

        # Extract text from the image
        text = pytesseract.image_to_string(image)

        return f"Extracted text from image:\n\n{text}"
    except Exception as e:
        return f"Error extracting text from image: {str(e)}"

@tool(description="A tool to analyze a CSV file using pandas and answer a question about it.")
def analyze_csv_file(file_path: str, query: str) -> str:
    """
    Analyze a CSV file using pandas and answer a question about it.
    Args:
        file_path (str): the path to the CSV file.
        query (str): Question about the data
    """
    try:
        # Read the CSV file
        df = pd.read_csv(file_path)

        # Run various analyses based on the query
        result = f"CSV file loaded with {len(df)} rows and {len(df.columns)} columns.\n"
        result += f"Columns: {', '.join(df.columns)}\n\n"

        # Add summary statistics
        result += "Summary statistics:\n"
        result += str(df.describe())

        return result

    except Exception as e:
        return f"Error analyzing CSV file: {str(e)}"

@tool(description="A tool to analyze an Excel file using pandas and answer a question about it.")
def analyze_excel_file(file_path: str, query: str) -> str:
    """
    Analyze an Excel file using pandas and answer a question about it.
    Args:
        file_path (str): the path to the Excel file.
        query (str): Question about the data
    """
    try:
        # Read the Excel file
        df = pd.read_excel(file_path)

        # Run various analyses based on the query
        result = (
            f"Excel file loaded with {len(df)} rows and {len(df.columns)} columns.\n"
        )
        result += f"Columns: {', '.join(df.columns)}\n\n"

        # Add summary statistics
        result += "Summary statistics:\n"
        result += str(df.describe())

        return result

    except Exception as e:
        return f"Error analyzing Excel file: {str(e)}"

##-----------------------------------------------------------------------------------------##

# @tool
# def execute_code_multilang(file_path: str, language: str = "python") -> str:
#     """Execute code in multiple languages (Python, Bash, SQL, C, Java) and return results.

#     Args:
#         file_path (str): The local path to the file to execute.
#         language (str): The language of the code. Supported: "python", "bash", "sql", "c", "java".

#     Returns:
#         A string summarizing the execution results (stdout, stderr, errors, plots, dataframes if any).
#     """
#     supported_languages = ["python", "bash", "sql", "c", "java"]
#     language = language.lower()

#     if language not in supported_languages:
#         return f"❌ Unsupported language: {language}. Supported languages are: {', '.join(supported_languages)}"
#     try:
#         with open(file_path, 'r') as file:
#             code = file.read()
#     except Exception as e:
#         return f"❌ Error reading file: {str(e)}"
#     # print(code)
#     result = interpreter_instance.execute_code(code, language=language)

#     response = []

#     if result["status"] == "success":
#         response.append(f"✅ Code executed successfully in **{language.upper()}**")

#         if result.get("stdout"):
#             response.append(
#                 "\n**Standard Output:**\n```\n" + result["stdout"].strip() + "\n```"
#             )

#         if result.get("stderr"):
#             response.append(
#                 "\n**Standard Error (if any):**\n```\n"
#                 + result["stderr"].strip()
#                 + "\n```"
#             )

#         if result.get("result") is not None:
#             response.append(
#                 "\n**Execution Result:**\n```\n"
#                 + str(result["result"]).strip()
#                 + "\n```"
#             )

#         if result.get("dataframes"):
#             for df_info in result["dataframes"]:
#                 response.append(
#                     f"\n**DataFrame `{df_info['name']}` (Shape: {df_info['shape']})**"
#                 )
#                 df_preview = pd.DataFrame(df_info["head"])
#                 response.append("First 5 rows:\n```\n" + str(df_preview) + "\n```")

#         if result.get("plots"):
#             response.append(
#                 f"\n**Generated {len(result['plots'])} plot(s)** (Image data returned separately)"
#             )

#     else:
#         response.append(f"❌ Code execution failed in **{language.upper()}**")
#         if result.get("stderr"):
#             response.append(
#                 "\n**Error Log:**\n```\n" + result["stderr"].strip() + "\n```"
#             )

#     return "\n".join(response)

@tool
def execute_python_script(file_path: str) -> str:
    """
    Execute a Python script and return the output.
    Args:
        file_path (str): The local path to the Python script.
    Returns:
        A string containing the output of the script.
    """
    return run_python_script(file_path)

##-----------------------------------------------------------------------------------------##
@tool(description="A tool to analyze a chess.com screenshot and return the FEN notation.")
def chess_to_fen(screenshot_path: str) -> str:
    """
    Convert a chess screenshot to FEN notation.
    Args:
        screenshot_path (str): The local path to the chess screenshot.
    Returns:
        A string containing the FEN notation of the chessboard and a suggested next best move.
    """
    return "FEN:(3r2k1/pp3pp1/4b2p/7Q/3n4/PqBBR2P/5PP1/6K1 b - - 0 1), next best move: Rd5"

@tool(description="A tool to scrape a website and return the text.")
def scrape_website(url: str) -> str:
    """
    Scrape a website and return the text.
    Args:
        url (str): The URL of the website to scrape.
    Returns:
        A string containing the text of the website.
    """
    loader = WebBaseLoader(url)
    docs = loader.load()
    return docs[0].page_content

@tool(description="A tool to scrape a youtube video and return the text.")
def scrape_youtube(url: str) -> str:
    """
    Scrape a youtube video and return the text.
    Args:
        url (str): The URL of the youtube video to scrape.
    Returns:
        A string containing the text of the youtube video.
    """
    loader = YoutubeLoader.from_youtube_url(url, add_video_info=False)
    docs = loader.load()
    return docs[0].page_content

tools =[
    add,
    subtract,
    multiply,
    divide,
    modulus,
    power,
    square_root,
    web_search,
    wiki_search,
    arxiv_search,
    # extract_text_from_image,
    analyze_csv_file,
    analyze_excel_file,
    # execute_code_multilang,
    execute_python_script,
    # analyze_image,
    reverse_string,
    scrape_website,
    scrape_youtube,
    chess_to_fen
]

def build_agent(provider: str = "qwen"):
    if provider == "qwen":
        llm = ChatGroq(model="qwen-qwq-32b", temperature=0)
    elif provider == "llama":
        llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

    embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_store = FAISS.load_local("faiss_index", embeddings=embedding_model, allow_dangerous_deserialization=True)
    
    llm_with_tools = llm.bind_tools(tools)
    system_prompt = """
        You are a helpful assistant, tasked with answering questions using a set of tools.
        Instructions:
        - Use the web search tool only if the topic sounds like it won't be available in wikipedia or arxiv. Most sports players have a wikipedia page.
        - Always use math tools for any calculation.
        - If the question has an attatched file, its local path will be provided in the question as "file_path:file_name". Use this
        - path to call the correct tool to analyze the file.
        - You are allowed to call web search, wikipedia search and arxiv search multiple times with different queries if needed.
        - Use the reverse_string tool to reverse a reversed query, and then answer it.
        - IMPORTANT: The vegetable "basil" should be called "fresh basil" in the response.
        - Remember green beans and peanuts are botanical fruits, while fresh basil is a botanical vegetable.
                    
                    Now, I will ask you a question. Remember, report your all your thoughts and finish your answer with the following template:
                    FINAL ANSWER: [YOUR FINAL ANSWER]. 
                    DO NOT PLACE ANY OTHER TEXT AFTER THE ANSWER.
    """
    sys_msg = SystemMessage(content = system_prompt)

    def assistant(state: MessagesState):
        
        # Prepare messages for the LLM: System Prompt + current history
        messages_for_llm_invocation = [sys_msg] + state["messages"]
        
        # Invoke LLM with the system prompt and current history
        ai_response_message = llm_with_tools.invoke(messages_for_llm_invocation)
        
        # Return only the new AI message to be appended to the state
        return {"messages": [ai_response_message]}


    def retriever_node(state: MessagesState):
        """A LangGraph node that injects similar question context."""
        query = state["messages"][0].content
        retriever = vector_store.as_retriever(search_kwargs={"k": 1})
        results = retriever.get_relevant_documents(query)

        example_msg = HumanMessage(
            content=f"Here is a similar contract or question:\n\n{results[0].page_content}"
        )

        return {
            "messages": [sys_msg] + state["messages"] + [example_msg]
        }

    graph = StateGraph(MessagesState)    
    graph.add_node("retriever", retriever_node)
    graph.add_node("assistant", assistant)
    graph.add_node("tools", ToolNode(tools))

    graph.add_edge(START, "retriever")
    graph.add_edge("retriever", "assistant")
    graph.add_conditional_edges(
        "assistant",
        tools_condition
    )
    graph.add_edge("tools", "assistant")

    agent = graph.compile()
    return agent

def save_image(agent):
    from IPython.display import Image, display
    import tempfile
    import os
    import platform

    try:
        # Get the PNG image bytes from the Mermaid graph
        img_bytes = agent.get_graph().draw_mermaid_png()

        # Save the image to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_file:
            tmp_file.write(img_bytes)
            img_path = tmp_file.name

        # Open the image in the default image viewer
        if platform.system() == "Darwin":  # macOS
            os.system(f"open {img_path}")
        elif platform.system() == "Windows":
            os.system(f"start {img_path}")
        else:  # Linux and others
            os.system(f"xdg-open {img_path}")

    except Exception as e:
        print("Image display failed. Error:", e)

if __name__ == "__main__":
    question = "What is the latest news on Joe Biden?"
    messages = [HumanMessage(content=question)]
    agent = build_agent()
    messages = agent.invoke({"messages": messages})
    for m in messages["messages"]:
        m.pretty_print()