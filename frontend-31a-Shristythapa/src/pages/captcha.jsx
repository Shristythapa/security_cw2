import ReCAPTCHA from "react-google-recaptcha";

function MyFormComponent() {
  const onRecaptchaChange = (value) => {
    console.log(value);
    if (value) {
      // send to backend for validation
    }
  };

  return (
    <div
      style={{ backgroundColor: "#FDFBFF" }}
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <form>
        // Your form fields
        <ReCAPTCHA
          sitekey="6Lc12RcqAAAAAHcF9MjpV5comKchpt2MXHnnHde2"
          onChange={onRecaptchaChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default MyFormComponent;
