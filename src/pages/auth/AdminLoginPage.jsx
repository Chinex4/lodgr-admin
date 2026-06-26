import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Container, IconButton, InputAdornment, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { errorMessage } from "../../lib/api";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await toast.promise(login(form), { loading: "Signing in...", success: "Welcome back", error: (e) => errorMessage(e) });
      navigate(from, { replace: true });
    } finally { setLoading(false); }
  };

  return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "#0f2418", px: 2 }}>
    <Container maxWidth="sm">
      <Paper sx={{ p: { xs: 3, sm: 5 } }}>
        <Stack spacing={3} component="form" onSubmit={submit}>
          <Box><LockIcon color="primary" /><Typography variant="h4">Bealodgr Admin</Typography><Typography color="text.secondary">Sign in with your backend admin account.</Typography></Box>
          <TextField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ textAlign: "right" }}>
            <Link component="button" type="button" onClick={() => navigate("/forgot-password")}>
              Forgot password?
            </Link>
          </Box>
          <Button size="large" type="submit" variant="contained" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
        </Stack>
      </Paper>
    </Container>
  </Box>;
}
