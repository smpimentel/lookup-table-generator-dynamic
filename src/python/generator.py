import csv
import itertools
from typing import List, Dict
import json

def generate_combinations(parameters: List[Dict[str, List[str]]]) -> List[List[str]]:
    """Generate all possible combinations of parameter values."""
    parameter_values = [param['values'] for param in parameters]
    return list(itertools.product(*parameter_values))

def create_csv(parameters: List[Dict[str, str]], combinations: List[List[str]], output_file: str):
    """Create a CSV file with the parameter combinations."""
    headers = [param['name'] for param in parameters]
    
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(combinations)

def process_parameters(input_json: str, output_file: str):
    """Process parameters from JSON and create CSV output."""
    parameters = json.loads(input_json)
    combinations = generate_combinations(parameters)
    create_csv(parameters, combinations, output_file)

if __name__ == "__main__":
    # Example usage
    parameters = [
        {
            "name": "Length",
            "values": ["10", "20", "30"]
        },
        {
            "name": "Width",
            "values": ["5", "10"]
        }
    ]
    process_parameters(json.dumps(parameters), "output.csv")