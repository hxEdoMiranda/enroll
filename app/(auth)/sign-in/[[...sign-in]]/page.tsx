"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, EyeIcon } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function SignInPage() {
  const cambiarClaveButtonRef = useRef<HTMLButtonElement | null>(null);

  const [identifier, setIdentifier] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorCode, setErrorCode] = useState("");

  // Simular clic en el botón automáticamente si hay un error pwned
  useEffect(() => {
    if (errorCode === "form_password_pwned" && cambiarClaveButtonRef.current) {
      cambiarClaveButtonRef.current.click();
    }
  }, [errorCode]);

  const handleChangeIdentifier = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setIdentifier(value ? (isMail ? value : "usr" + value) : "");
  };

  return (
    <main className="min-h-screen p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white rounded-[32px] overflow-hidden flex flex-row shadow-lg">
        <div className="w-1/2">
          <Image
            src="/img/sign-in/img-1.png"
            width={600}
            height={1000}
            alt="XD"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-1/2">
          <SignIn.Root>
            <SignIn.Step
              name="start"
              className="h-full flex flex-col justify-between"
            >
              <div className="w-full gap-y-8 flex flex-col p-8">
                <header className="flex justify-center">
                  <Image
                    src="/img/shared/logo-medismart.png"
                    alt="Logo Medismart"
                    width={328}
                    height={100}
                  />
                </header>

                <div className="flex flex-col gap-y-4">
                  <Clerk.Field
                    name="identifier"
                    className="flex-col gap-y-4 hidden"
                  >
                    <Clerk.Label className="text-base font-bold">
                      Ingresa tu RUT o correo electrónico
                    </Clerk.Label>
                    <Clerk.Input
                      value={identifier}
                    />
                    <Clerk.FieldError className="block text-sm text-red-400" />
                  </Clerk.Field>
                  <div className="flex flex-col gap-y-4">
                    <label className="text-base font-bold" htmlFor="identifier">
                      Ingresa tu RUT o correo electrónico
                    </label>
                    <input
                      id="identifierClone"
                      type="text"
                      onChange={handleChangeIdentifier}
                      className="border border-border rounded-md p-3"
                      required
                    />
                  </div>
                </div>

                <SignIn.Action
                  className="bg-primary text-white rounded-full text-base font-bold px-5 py-3"
                  submit
                >
                  CONTINUAR
                </SignIn.Action>

                <p className="flex items-center gap-x-3 text-base font-medium before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                  o inicia sesión con
                </p>

                <Clerk.Connection
                  name="google"
                  className="flex items-center justify-center gap-x-3 text-lg font-medium border border-border rounded-full p-3"
                >
                  <Clerk.Icon className="w-8 h-8" />
                  Google
                </Clerk.Connection>
              </div>

              <div className="bg-[#EFF2FF] h-20 flex items-center justify-center">
                <p className="text-sm font-normal flex items-center justify-center">
                  ¿Necesitas soporte o ayuda?&nbsp;
                  <a
                    href="/soporte"
                    className="flex items-center gap-x-2 text-primary underline"
                  >
                    Ingresa aquí
                    <FaWhatsapp />
                  </a>
                </p>
              </div>
            </SignIn.Step>

            <SignIn.Step
              name="verifications"
              className="bg-white w-full m-auto h-full flex flex-col justify-between "
            >
              <div className="max-w-md m-auto gap-y-8 flex flex-col">
                <header className="flex justify-center">
                  <Image
                    src="/img/shared/logo-medismart.png"
                    alt="Logo Medismart"
                    width={328}
                    height={100}
                  />
                </header>
                <SignIn.Strategy name="password">
                  <Clerk.Field
                    name="password"
                    className="flex flex-col gap-y-4"
                  >
                    <Clerk.Label className="text-base font-bold">
                      Clave
                    </Clerk.Label>
                    <div className="border border-border rounded-md p-3 flex flex-row">
                      <Clerk.Input
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full focus:outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={() => setShowPassword(true)}
                        onMouseUp={() => setShowPassword(false)}
                        onMouseLeave={() => setShowPassword(false)}
                        className="flex items-center text-sm text-primary underline"
                      >
                        <EyeIcon
                          className={`w-5 h-5`}
                          fill={showPassword ? "#0b9ce0" : "#262626"}
                        />
                      </button>
                    </div>
                    <Clerk.FieldError className="block text-sm text-red-400">
                      {({ code }) => {
                        if (code === "form_password_pwned") {
                          console.log("pwned");
                          setErrorCode(code);
                        }
                        return null;
                      }}
                    </Clerk.FieldError>
                  </Clerk.Field>

                  <SignIn.Action
                    navigate="forgot-password"
                    className="text-base font-bold text-right underline"
                    ref={cambiarClaveButtonRef}
                  >
                    ¿Olvidaste tu clave?
                  </SignIn.Action>
                  {errorCode === "form_password_pwned" ? (
                    <SignIn.Action
                      navigate="forgot-password"
                      className="bg-primary text-white rounded-full text-base font-bold px-5 py-3"
                    >
                      CAMBIAR CLAVE
                    </SignIn.Action>
                  ) : (
                    <SignIn.Action
                      className="bg-primary text-white rounded-full text-base font-bold px-5 py-3"
                      submit
                    >
                      INGRESAR
                    </SignIn.Action>
                  )}
                </SignIn.Strategy>

                <SignIn.Strategy name="reset_password_email_code">
                  <div className="flex flex-row items-center gap-2">
                    <CheckCircle className="w-10 h-10" fill="green" />
                    <p className="text-wrap">
                      Te hemos enviado un correo a <SignIn.SafeIdentifier />,
                      revisa tu bandeja de entrada o bandeja de spam.{" "}
                    </p>
                  </div>

                  <Clerk.Field name="code" className="flex flex-col gap-y-4">
                    <Clerk.Label className="text-base font-bold">
                      Ingresa el código de verificación
                    </Clerk.Label>
                    <Clerk.Input
                      type="otp"
                      className="flex justify-center has-[:disabled]:opacity-50"
                      autoSubmit
                      render={({ value, status }) => {
                        return (
                          <div
                            data-status={status}
                            className={cn(
                              "relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                              {
                                "z-10 ring-2 ring-ring ring-offset-background":
                                  status === "cursor" || status === "selected",
                              }
                            )}
                          >
                            {value}
                            {status === "cursor" && (
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
                              </div>
                            )}
                          </div>
                        );
                      }}
                    />
                    <Clerk.FieldError />
                  </Clerk.Field>

                  <SignIn.Action
                    className="bg-primary text-white rounded-full text-base font-bold px-5 py-3"
                    submit
                  >
                    CONTINUAR
                  </SignIn.Action>
                </SignIn.Strategy>
              </div>
              <div className="bg-[#EFF2FF] h-20 rounded-br-[32px] flex items-center justify-center">
                <p className="text-sm font-normal flex items-center justify-center">
                  ¿Necesitas soporte o ayuda?&nbsp;
                  <a
                    href="/soporte"
                    className="flex items-center gap-x-2 text-primary underline"
                  >
                    Ingresa aquí
                    <FaWhatsapp />
                  </a>
                </p>
              </div>
            </SignIn.Step>

            <SignIn.Step
              name="forgot-password"
              className="bg-white rounded-[32px] w-10/12 m-auto h-5/6 flex flex-col justify-between shadow-lg"
            >
              <div className="max-w-md m-auto gap-y-8 flex flex-col">
                <header className="flex justify-center">
                  <Image
                    src="/img/login/logo-medismart.svg"
                    alt="Logo Medismart"
                    width={328}
                    height={100}
                  />
                </header>
                {errorCode === "form_password_pwned" ? (
                  <>
                    <h1 className="text-center text-base">
                      Bienvenido(a) por primera vez. Por favor, genera tu clave
                      personal para comenzar a usar el sistema.
                    </h1>
                    <SignIn.SupportedStrategy name="reset_password_email_code">
                      <button className="bg-primary text-white rounded-full text-base font-bold px-5 py-3 w-full">
                        GENERAR CLAVE
                      </button>
                    </SignIn.SupportedStrategy>
                  </>
                ) : (
                  <>
                    <h1 className="text-center text-base">
                      Si olvidaste tu clave, presiona
                      <span className="font-bold">
                        “RESTABLECER CONTRASEÑA”
                      </span>
                      . Te enviaremos un código a tu correo electrónico asociado
                      para que puedas restablecerla fácilmente.
                    </h1>
                    <SignIn.SupportedStrategy name="reset_password_email_code">
                      <button className="bg-primary text-white rounded-full text-base font-bold px-5 py-3 w-full">
                        RESTABLECER CONTRASEÑA
                      </button>
                    </SignIn.SupportedStrategy>
                  </>
                )}
                <SignIn.Action
                  navigate="previous"
                  className="text-secondary underline"
                >
                  Volver
                </SignIn.Action>
              </div>
              <div className="bg-[#EFF2FF] h-20 rounded-b-[32px] flex items-center justify-center">
                <p className="text-sm font-normal flex items-center justify-center">
                  ¿Necesitas soporte o ayuda?&nbsp;
                  <a
                    href="/soporte"
                    className="flex items-center gap-x-2 text-primary underline"
                  >
                    Ingresa aquí
                    <FaWhatsapp />
                  </a>
                </p>
              </div>
            </SignIn.Step>

            <SignIn.Step
              name="reset-password"
              className="bg-white rounded-[32px] w-10/12 m-auto h-5/6 flex flex-col justify-between shadow-lg"
            >
              <div className="max-w-md m-auto gap-y-8 flex flex-col">
                <header className="flex justify-center">
                  <Image
                    src="/img/login/logo-medismart.svg"
                    alt="Logo Medismart"
                    width={328}
                    height={100}
                  />
                </header>
                <h1 className="text-primary text-center text-4xl font-bold">
                  Cambiar de clave
                </h1>
                <div className="flex flex-col gap-y-2">
                  <Clerk.Field
                    name="password"
                    className="flex flex-col gap-y-4"
                  >
                    <Clerk.Label className="text-base font-bold">
                      Escribe aquí tu nueva clave
                    </Clerk.Label>
                    <div className="border border-border rounded-md p-3 flex flex-row">
                      <Clerk.Input
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full focus:outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={() => setShowPassword(true)}
                        onMouseUp={() => setShowPassword(false)}
                        onMouseLeave={() => setShowPassword(false)}
                        className="flex items-center text-sm text-primary underline"
                      >
                        <EyeIcon
                          className={`w-5 h-5`}
                          fill={showPassword ? "#0b9ce0" : "#262626"}
                        />
                      </button>
                    </div>
                    <Clerk.FieldError />
                  </Clerk.Field>
                  <Clerk.Field
                    name="confirmPassword"
                    className="flex flex-col gap-y-4"
                  >
                    <Clerk.Label className="text-base font-bold">
                      Confirma tu nueva clave
                    </Clerk.Label>
                    <div className="border border-border rounded-md p-3 flex flex-row">
                      <Clerk.Input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="w-full focus:outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={() => setShowConfirmPassword(true)}
                        onMouseUp={() => setShowConfirmPassword(false)}
                        onMouseLeave={() => setShowConfirmPassword(false)}
                        className="flex items-center text-sm text-primary underline"
                      >
                        <EyeIcon
                          className={`w-5 h-5`}
                          fill={showConfirmPassword ? "#0b9ce0" : "#262626"}
                        />
                      </button>
                    </div>
                    <Clerk.FieldError />
                  </Clerk.Field>
                </div>

                <SignIn.Action
                  submit
                  className="bg-primary text-white rounded-full text-base font-bold px-5 py-3"
                >
                  CONFIRMAR CAMBIO
                </SignIn.Action>
              </div>
              <div className="bg-[#EFF2FF] h-20 rounded-b-[32px] flex items-center justify-center">
                <p className="text-sm font-normal flex items-center justify-center">
                  ¿Necesitas soporte o ayuda?&nbsp;
                  <a
                    href="/soporte"
                    className="flex items-center gap-x-2 text-primary underline"
                  >
                    Ingresa aquí
                    <FaWhatsapp />
                  </a>
                </p>
              </div>
            </SignIn.Step>
          </SignIn.Root>
        </div>
      </div>
    </main>
  );
}
