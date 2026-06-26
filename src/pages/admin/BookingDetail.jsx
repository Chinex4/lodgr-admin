import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Page from "../../components/common/Page";
import { api, errorMessage, unwrap } from "../../lib/api";
import { date, money } from "../../utils/formatters";

function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={700}>{value || "-"}</Typography>
    </Box>
  );
}

export default function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const payload = unwrap(await api.get(`/admin/bookings/${bookingId}`));
        if (active) setBooking(payload);
      } catch (requestError) {
        if (active) setError(errorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [bookingId]);

  if (loading) {
    return (
      <Stack sx={{ py: 8 }} alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Page title="Booking" subtitle="Unable to load booking details.">
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/bookings")}>Back to bookings</Button>
      </Page>
    );
  }

  const property = booking?.properties || {};
  const guest = booking?.profiles || {};
  const host = booking?.host || {};
  const payment = booking?.payment || {};
  const propertyImage = property?.cover_image?.image_url;

  return (
    <Page
      title={`Booking ${booking?.id || ""}`}
      subtitle={[property.title, guest.email].filter(Boolean).join(" - ")}
      action={<Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/bookings")}>Back</Button>}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ overflow: "hidden" }}>
            {propertyImage ? (
              <Box component="img" src={propertyImage} alt={property.title || "Property"} sx={{ width: "100%", height: 320, objectFit: "cover", display: "block" }} />
            ) : (
              <Box sx={{ height: 320, bgcolor: "grey.100", display: "grid", placeItems: "center", color: "text.secondary" }}>
                No property image
              </Box>
            )}
            <Box sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                <Chip label={booking?.status || "unknown"} color={booking?.status === "confirmed" ? "success" : "default"} />
                <Chip label={booking?.payment_method || "No payment method"} variant="outlined" />
              </Stack>
              <Typography variant="h5">{property.title || "Untitled property"}</Typography>
              <Typography color="text.secondary">{[property.location, property.city].filter(Boolean).join(", ")}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>Stay details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}><InfoItem label="Check-in" value={booking?.check_in} /></Grid>
              <Grid item xs={6}><InfoItem label="Check-out" value={booking?.check_out} /></Grid>
              <Grid item xs={6}><InfoItem label="Guests" value={booking?.guests || booking?.guest_count} /></Grid>
              <Grid item xs={6}><InfoItem label="Created" value={date(booking?.created_at)} /></Grid>
              <Grid item xs={6}><InfoItem label="Subtotal" value={money(booking?.subtotal)} /></Grid>
              <Grid item xs={6}><InfoItem label="Service fee" value={money(booking?.service_fee_amount)} /></Grid>
              <Grid item xs={6}><InfoItem label="Tax" value={money(booking?.tax_amount)} /></Grid>
              <Grid item xs={6}><InfoItem label="Total" value={money(booking?.total_price)} /></Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>Guest</Typography>
            <Stack spacing={2}>
              <InfoItem label="Name" value={guest.full_name} />
              <InfoItem label="Email" value={guest.email} />
              <InfoItem label="User ID" value={guest.id} />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>Host</Typography>
            <Stack spacing={2}>
              <InfoItem label="Name" value={host.full_name} />
              <InfoItem label="Email" value={host.email} />
              <InfoItem label="Host ID" value={host.id} />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>Payment</Typography>
            <Stack spacing={2}>
              <InfoItem label="Reference" value={booking?.payment_reference || payment.reference} />
              <InfoItem label="Provider" value={payment.provider || booking?.payment_method} />
              <InfoItem label="Payment status" value={payment.status} />
              <InfoItem label="Amount" value={payment.amount ? money(payment.amount) : money(booking?.total_price)} />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Notes and proof</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>{booking?.reason_for_booking || "No booking reason provided."}</Typography>
            <Divider sx={{ my: 2 }} />
            {booking?.proof_of_payment_url ? (
              <Button href={booking.proof_of_payment_url} target="_blank" rel="noreferrer" variant="outlined">Open proof of payment</Button>
            ) : (
              <Typography color="text.secondary">No proof of payment uploaded.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
}
