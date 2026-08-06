const axios = require('axios');

// FastAPI service (ml/src/app.py). Defaults to the local dev port from
// its own docstring (`uvicorn app:app --reload --port 8000`).
const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

exports.analyze = async (req, res) => {
  try {
    const response = await axios.post(`${ML_API_URL}/analyze`, req.body, {
      timeout: 10000,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      // FastAPI validated the request and rejected it (422 for bad/
      // out-of-range input) or hit an internal error (500) - pass its
      // status and message straight through so the frontend can show
      // the real reason instead of a generic failure.
      return res.status(error.response.status).json({
        error: error.response.data?.detail || 'The analysis service rejected the request.',
      });
    }

    // No response at all - the ML service is down, unreachable, or timed
    // out. This is a failure of OUR upstream dependency, not the caller's
    // request, so 502 Bad Gateway is the right status rather than 500.
    console.error('ML service unreachable:', error.message);
    return res.status(502).json({
      error: 'The analysis service is currently unavailable. Please try again shortly.',
    });
  }
};
