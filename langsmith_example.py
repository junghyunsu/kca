from langsmith import wrappers, Client
from pydantic import BaseModel, Field
from openai import OpenAI

from const import MODEL_NAME

client = Client()
openai_client = wrappers.wrap_openai(OpenAI())

# For other dataset creation methods, see: https://docs.smith.langchain.com/evaluation/how_to_guides/manage_datasets_programmatically https://docs.smith.langchain.com/evaluation/how_to_guides/manage_datasets_in_application

# Create inputs and reference outputs
examples = [
  (
      "Which country is Mount Kilimanjaro located in?",
      "Mount Kilimanjaro is located in Tanzania.",
  ),
  (
      "What is Earth's lowest point?",
      "Earth's lowest point is The Dead Sea.",
  ),
]

inputs = [{"question": input_prompt} for input_prompt, _ in examples]
outputs = [{"answer": output_answer} for _, output_answer in examples]

# Programmatically create a dataset in LangSmith
dataset = client.create_dataset(
	dataset_name = "Sample dataset",
	description = "A sample dataset in LangSmith."
)

# Add examples to the dataset
client.create_examples(inputs=inputs, outputs=outputs, dataset_id=dataset.id)

# 평가하고자 하는 애플리케이션 로직을 target 함수 안에 정의하세요
# SDK가 데이터셋에 있는 입력값들을 자동으로 target 함수에 전달해줍니다
def target(inputs: dict) -> dict:
    response = openai_client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            { "role": "system", "content": "Answer the following question accurately" },
            { "role": "user", "content": inputs["question"] },
        ]
    )
    return { "response": response.choices[0].message.content.strip() }

# Define instructions for the LLM judge evaluator
instructions = """Evaluate Student Answer against Ground Truth for conceptual similarity and classify true or false: 
- False: No conceptual match and similarity
- True: Most or full conceptual match and similarity
- Key criteria: Concept should match, not exact wording.
"""

# Define output schema for the LLM judge
class Grade(BaseModel):
    score: bool = Field(description="Boolean that indicates whether the response is accurate relative to the reference answer")

# Define LLM judge that grades the accuracy of the response relative to reference output
def accuracy(outputs: dict, reference_outputs: dict) -> bool:
  response = openai_client.beta.chat.completions.parse(
    model=MODEL_NAME,
    messages=[
      { "role": "system", "content": instructions },
      { "role": "user", "content": f"""Ground Truth answer: {reference_outputs["answer"]}; 
      Student's Answer: {outputs["response"]}"""
  }],
    response_format=Grade
  );
  return response.choices[0].message.parsed.score

# After running the evaluation, a link will be provided to view the results in langsmith
experiment_results = client.evaluate(
    target,
    data = "Sample dataset",
    evaluators = [
        accuracy,
        # can add multiple evaluators here
    ],
    experiment_prefix = "first-eval-in-langsmith",
    max_concurrency = 2,
)