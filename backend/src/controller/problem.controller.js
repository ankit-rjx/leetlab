import { db } from "../libs/db.js";
import {
  deleteProblem,
  getProblemById,
  getAllProblems,
  getAllProblemsSolvedByUser,
  updateProblem,
  createproblem,
} from "../libs/judge0.lib.js";

export const createproblem = async (req, res) => {
  // ✅ Step 1: Get all required fields from request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolution,
  } = req.body;

  // ✅ Step 2: Check if the user is ADMIN
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "You are not allowed to create a problem",
    });
  }

  try {
    // ✅ Step 3: Loop through each language solution in referenceSolution
    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({
          error: `Language ${language} is not supported`,
        });
      }

      // ✅ Step 4: Prepare submission payload for Judge0
      const submission = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submission);

      const tokens = submissionResults.map((res) => res.token); // ✅ FIXED: this line was returning undefined earlier

      const results = await pollBatchResults(tokens);

      // ✅ Step 5: Check each test case result
      for (let i = 0; i < results.length; i++) {
        const result = results[i]; // ✅ FIXED: defined result before using it

        console.log("Result----", result); // ✅ NOW this will not throw error

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    // ✅ Step 6: All testcases passed, create problem in DB
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolution,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true, // ✅ Typo fix: "sucess" -> "success"
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.error("Error creating problem:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProblems = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const updateProblem = async (req, res) => {};

export const deleteProblem = async (req, res) => {};

export const getAllProblemsSolvedByUser = async (req, res) => {};
