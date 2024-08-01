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
    if (error.response) {
      if (error.response.status === 400) {
        return res.json({ message: "reCAPTCHA verification failed" });
      } else {
        return res.json({ message: "reCAPTCHA verification failed" });
      }
    } else {
      return res.json({ message: "reCAPTCHA verification failed" });
    }
  }
}

const captchaCheck = async (req, res) => {
  const { captcha } = req.body;

  try {
    const isRecaptchaValid = await verifyRecaptcha(captcha);

    if (!isRecaptchaValid) {
      return res.json({ message: "reCAPTCHA verification failed" });
    } else {
      return res.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    return res.json({ message: "reCAPTCHA verification failed" });
  }
};

module.exports = {
  captchaCheck,
};
