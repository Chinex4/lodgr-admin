import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { api, errorMessage } from "../../lib/api";

export default function AdminForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    password_confirmation: "",
  });

  const requestOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await toast.promise(api.post("/forgot-password", { email: form.email }), {
        loading: "Sending OTP...",
        success: "OTP sent to email",
        error: (error) => errorMessage(error),
      });
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await toast.promise(api.post("/forgot-password/verify-otp", { email: form.email, otp: form.otp }), {
        loading: "Verifying OTP...",
        success: "OTP verified",
        error: (error) => errorMessage(error),
      });
      setStep("password");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await toast.promise(api.post("/reset-password", form), {
        loading: "Resetting password...",
        success: "Password reset. Sign in with the new password.",
        error: (error) => errorMessage(error),
      });
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const update = (name) => (event) => setForm({ ...form, [name]: event.target.value });

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "#0f2418", px: 2 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4">Reset admin password</Typography>
              <Typography color="text.secondary">Use the OTP sent to your email to choose a new password.</Typography>
            </Box>

            {step === "email" && (
              <Stack spacing={2} component="form" onSubmit={requestOtp}>
                <TextField label="Email" type="email" required value={form.email} onChange={update("email")} />
                <Button type="submit" variant="contained" disabled={loading}>Send OTP</Button>
              </Stack>
            )}

            {step === "otp" && (
              <Stack spacing={2} component="form" onSubmit={verifyOtp}>
                <TextField label="Email" type="email" required value={form.email} onChange={update("email")} />
                <TextField label="OTP" required inputProps={{ maxLength: 6 }} value={form.otp} onChange={update("otp")} />
                <Button type="submit" variant="contained" disabled={loading}>Verify OTP</Button>
              </Stack>
            )}

            {step === "password" && (
              <Stack spacing={2} component="form" onSubmit={resetPassword}>
                <TextField label="New password" type="password" required value={form.password} onChange={update("password")} />
                <TextField label="Confirm password" type="password" required value={form.password_confirmation} onChange={update("password_confirmation")} />
                <Button type="submit" variant="contained" disabled={loading}>Reset password</Button>
              </Stack>
            )}

            <Button onClick={() => navigate("/login")} disabled={loading}>Back to login</Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
