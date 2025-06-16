import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { department, category, id, link } = req.body;

  if (!department || !category || !id || !link) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const owner = "elyas-hassan"; // <-- CHANGE
  const repo = "fiels";         // <-- CHANGE
  const path = "groups-data.json";

  try {
    // 1. Get the current file content
    const { data: fileData } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path,
    });

    const contentJSON = JSON.parse(
      Buffer.from(fileData.content, "base64").toString()
    );

    // 2. Update the data
    if (!contentJSON[department]) contentJSON[department] = {};
    if (!contentJSON[department][category]) contentJSON[department][category] = [];

    contentJSON[department][category].push({ id, link });

    const updatedContent = Buffer.from(JSON.stringify(contentJSON, null, 2)).toString("base64");

    // 3. Commit the update
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path,
      message: `Add group ${id} to ${department}/${category}`,
      content: updatedContent,
      sha: fileData.sha,
    });

    res.status(200).json({ message: "Group added successfully" });
  } catch (error) {
    console.error("GitHub API error:", error);
    res.status(500).json({ message: "Failed to update file" });
  }
}
