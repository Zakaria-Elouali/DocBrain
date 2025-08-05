import os
import torch

model_path = "D:/Coding/DocBrain Project/AI model/Meta-Llama-3-8B-Instruct"
print("Checking directory contents:")
if os.path.exists(model_path):
    print(f"Directory exists: {model_path}")
    print("Files in directory:")
    for file in os.listdir(model_path):
        print(f"- {file}")
else:
    print(f"Directory does not exist: {model_path}")


print("-------------Checking Cuda Existence----------------")
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"CUDA version: {torch.version.cuda}")
print(f"CUDA device count: {torch.cuda.device_count()}")
if torch.cuda.is_available():
    print(f"Current CUDA device: {torch.cuda.current_device()}")
    print(f"Device name: {torch.cuda.get_device_name(0)}")


# run command
# uvicorn app.main:app --reload
