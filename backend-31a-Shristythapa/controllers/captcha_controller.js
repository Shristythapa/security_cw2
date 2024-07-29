const axios = require("axios");

async function verifyRecaptcha(recaptchaResponse) {
  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: "6Lc12RcqAAAAAFWt-XUoLLZ8cbbB5yldc0cbvqvF",
          response: recaptchaResponse,
        },
      }
    );

    return response.data.success;
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false;
  }
}

const captchaCheck = async (req, res) => {
  const { captcha } = req.body;

  try {
    const isRecaptchaValid = await verifyRecaptcha(captcha);

    if (!isRecaptchaValid) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    } else {
      return res.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  captchaCheck,
};
