export const getJudge0LanguageId = (Language) => {
  const languageMap = {
    JAVA: 62,
    PYTHON: 71,
    JAVASCRIPT: 63,
  };
  return languageMap[languageMap.toUppercase()] || null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// asking again and again this work is done or not.
export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submission/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      }
    );
    const results = data.submissions;

    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (isAllDone) {
      return results;
    }
    await sleep(1000);
  }
};

// this will hit the judge0 end point
export const submitbatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submission/batch?base64_encoded=false`,
    {
      submissions,
    }
  );

  console.log("Submisson Result :", data);

  return data; // [{token},{token},{token}]
};
