import os
from urllib.parse import urlparse

import requests
from addTool import loadJSONFile, updateJSONFile

# DISCLAMER: AI generated until I learn GraphQL #
# Goes out and batch fetches the current stars_count from the repos
# I'm using GraphQL because I hit rate limits with the REST API.


GITHUB_API_URL = "https://api.github.com/graphql"


def parse_repo_url(url):
    path = urlparse(url).path.strip("/")

    parts = [p for p in path.split("/") if p]

    if len(parts) < 2:
        raise ValueError(f"Invalid GitHub repository URL: {url}")

    owner = parts[0]
    repo = parts[1].removesuffix(".git")

    return owner, repo


def chunks(items, size=100):
    for i in range(0, len(items), size):
        yield items[i : i + size]


def getStarsOfRepos(github_repo_urls):
    repos_and_stars = {url: 0 for url in github_repo_urls}

    for repo_chunk in chunks(github_repo_urls, 100):
        aliases = []
        alias_to_url = {}

        for i, url in enumerate(repo_chunk):
            owner, repo = parse_repo_url(url)

            alias = f"repo{i}"
            alias_to_url[alias] = url

            aliases.append(
                f"""
                {alias}: repository(owner: "{owner}", name: "{repo}") {{
                    stargazerCount
                }}
                """
            )

        query = f"""
        query {{
            {"".join(aliases)}
        }}
        """

        response = requests.post(
            GITHUB_API_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
            },
            json={"query": query},
            timeout=30,
        )

        response.raise_for_status()

        payload = response.json()

        if "errors" in payload:
            raise RuntimeError(payload["errors"])

        for alias, repo_data in payload["data"].items():
            if repo_data:
                repos_and_stars[alias_to_url[alias]] = repo_data["stargazerCount"]

    return repos_and_stars


def main():
    json_file_data = loadJSONFile()

    github_repo_urls = [
        tool["github"] for tool in json_file_data["tools"] if tool.get("github")
    ]

    try:
        repos_and_stars = getStarsOfRepos(github_repo_urls)

        for tool in json_file_data["tools"]:
            github_url = tool.get("github")

            if github_url in repos_and_stars:
                tool["stars"] = repos_and_stars[github_url]

    except Exception as e:
        print(f"Failed to fetch stars: {e}")
        raise

    updateJSONFile(json_file_data)


if __name__ == "__main__":
    main()
