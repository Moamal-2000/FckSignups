from addTool import getArrayInput, loadJSONFile, updateJSONFile

# GLOBAL CONSTANTS
JSON_PATH = "../tools.json"


def validate(fields):
    if len(fields) != 6:
        print("Invalid number of arguments.")
        raise

    github_url = fields[4]
    if github_url == "—":
        print("Missing GitHub link / Non-FOSS.")
        raise


def main():
    automation_input = input("Automation string: ")
    fields = automation_input.split(";;")

    validate(fields)

    tags = getArrayInput()


if __name__ == "__main__":
    main()
