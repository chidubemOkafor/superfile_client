import { useState } from "react";
import { MdOutlinePhone, MdOutlinePassword } from "react-icons/md";
import { LuScanBarcode } from "react-icons/lu";
import { FaLock } from "react-icons/fa";
import { useThemeStore } from "../stores/useThemeStore";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from 'sonner'
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { theme } = useThemeStore();
  const [step, setStep] = useState(1);
  const navigate = useNavigate()
  const [isTwoStep, setIsTwoStep] = useState(false)
  const [isFirst, setIsFirst] = useState(true)

  const phoneSchema = Yup.object({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9+\- ]+$/, "Invalid phone number"),
  });

  const codeSchema = Yup.object({
  code: Yup.string().required("Verification code is required"),
  channelUrl: Yup.string().when("$isFirst", {
    is: true,
    then: (schema) =>
      schema
        .url("Must be a valid URL")
        .test("is-telegram", "Must be a Telegram link", (value) =>
          value
            ? value.startsWith("https://t.me/") || value.startsWith("http://t.me/")
            : false
        ),
    otherwise: (schema) => schema.notRequired(),
    }),
  });

  const passwordSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleValidateNumber = async (phone: any) => {
    try {
      window.localStorage.setItem("phone", phone)
      const response = await axios.post(
        "http://localhost:5000/auth/validatenumber",
        { phone } 
      );
      console.log("response: ",response.data);
      setIsFirst(response.data.first_time)

      toast.message(response.data.message, {
        description: `expires_in: ${response.data.expires_in / 60} min`
      })
      setStep(2)
    } catch (e:any) {
      if (e.response.data.error === "Failed to send verification code") {
        console.log("error!")
        toast.error('Failed to send verification code')
      }
      setStep(2)
      console.error(e);
    }
  };

  const handleToken = async (code: string | null, vault_url: string ) => {
    try {
      if (code === null) {
        return
      }

      if (vault_url.length > 0) {
        window.localStorage.setItem("vault_url", vault_url)
      }

      const phone = window.localStorage.getItem("phone")

      const payload: any = {
        phone,
        code: parseInt(code),
      };

      if (vault_url && vault_url.trim() !== "") {
        payload.vault_url = vault_url;
      }
      
      console.log(payload)
      const response = await axios.post(
        "http://localhost:5000/auth/token",
        payload
      );
      setStep(3);
      console.log("response: ", response.data)
    } catch (e: any) {
      if(e.response.data.error === "Session expired") {
        toast("Session expired.")
        setStep(1)
        return
      }
      if(e.response.data.error === "2FA required") {
        toast("Two-step verification is enabled.")
        setIsTwoStep(true)
        setStep(3)
      }
      if(e.response.data.error === "Verification session expired or invalid") {
        toast.error(e.response.data.error)
      }
      console.error(e)
    }
  }

  const handle2faAuth = async(password: string) => {
    try {
      const phone = window.localStorage.getItem("phone")
      const vault_url = window.localStorage.getItem("vault_url")
      const payload: any = {
        password,
        phone
      }

      if (vault_url && vault_url.trim() !== "") {
        payload.vault_url = vault_url;
      }

      const response = await axios.post("http://localhost:5000/auth/two_step_verification", 
        payload,
        {
          withCredentials: true
        }
      )
      console.log("response: ", response)
      window.localStorage.removeItem("phone")
      window.localStorage.removeItem("vault_url")
      setIsTwoStep(false)
      toast.success("Authentication successful!")
      navigate('/process-file')
    } catch (e) {
      console.error(e)
    }
  }

  const labelObj = [
    {
      name: "Phone",
      icon: (
        <MdOutlinePhone
          className={`size-8 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        />
      ),
    },
    {
      name: "Code",
      icon: (
        <LuScanBarcode
          className={`size-8 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        />
      ),
    },
    {
      name: "Password",
      icon: (
        <MdOutlinePassword
          className={`size-8 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        />
      ),
    },
  ];

  const stepPercent = ((step - 1) / 2) * 100;

  const button =
    "w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 sm:py-5 px-8 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center space-x-3 text-sm sm:text-base";
  const input = `w-full ${
    theme === "dark" && "text-gray-400"
  } p-4 border border-gray-100 rounded-xl outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400 transition`;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className={`${
          theme === "dark" ? "" : "bg-white shadow-xl "
        } rounded-2xl w-full max-w-md p-8`}
      >
        <h1
          className={`${
            theme === "dark" ? "text-gray-300" : "text-gray-800"
          } text-3xl font-bold text-center mb-6`}
        >
          Telegram Auth
        </h1>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 h-2 transition-all duration-500 rounded-md"
            style={{ width: `${stepPercent}%` }}
          />
        </div>

        <div className="flex justify-between mb-8">
          {labelObj.map((label, idx) => (
            <div key={idx} className="relative flex flex-col items-center" onClick = {() => setStep(idx + 1)}>
              {label.name === "Password" && (
                isTwoStep || <FaLock className="absolute right-0 text-red-500" />
              )}
              {label.icon}
              <span
                className={`text-xs ${
                  label.name === "Password" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {label.name}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <Formik
            initialValues={{ phoneNumber: "" }}
            validationSchema={phoneSchema}
            onSubmit={(values) => {
              handleValidateNumber(values.phoneNumber);
            }}
          >
            {() => (
              <Form className="space-y-4">
                <Field
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone number"
                  className={input}
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="p"
                  className="text-red-500 text-sm"
                />

                <button type="submit" className={button}>
                  Send Code
                </button>
              </Form>
            )}
          </Formik>
        )}

        {step === 2 && (
          <Formik
            initialValues={{ code: "", channelUrl: "" }}
            validationSchema={codeSchema}
            validateOnChange={false}
            validateOnBlur={false}
            context={{ isFirst }}
            onSubmit={(values) => {
              handleToken(values.code, values.channelUrl)
              console.log("Code & Channel submitted:", values);
            }}
          >
            {() => (
              <Form className="space-y-4">
                <Field
                  type="text"
                  name="code"
                  placeholder="Verification code"
                  className={input}
                />
                <ErrorMessage
                  name="code"
                  component="p"
                  className="text-red-500 text-sm"
                />

                { isFirst &&
                  <>
                    <Field
                      type="url"
                      name="channelUrl"
                      placeholder="Telegram channel url"
                      className={input}
                    />
                    <ErrorMessage
                      name="channelUrl"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </>
                }

                <button type="submit" className={button}>
                  Verify Code
                </button>
              </Form>
            )}
          </Formik>
        )}

        {step === 3 && (
          <Formik
            initialValues={{ password: "" }}
            validationSchema={passwordSchema}
            onSubmit={(values) => {
              handle2faAuth(values.password)
              console.log("Password set:", values);
            }}
          >
            {() => (
              <Form className="space-y-4">
                <Field
                  type="password"
                  name="password"
                  placeholder="Set Password"
                  className={input}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm"
                />

                <button type="submit" className={button}>
                  Complete
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default Auth;
