import { useEffect, useMemo, useState } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import Page from "../../components/common/Page";
import { api, errorMessage, unwrap } from "../../lib/api";
import { money, date } from "../../utils/formatters";

const primaryImage = (property) => {
  const images = property?.images || property?.property_images || [];
  return (
    property?.cover_image?.image_url ||
    images.find((image) => image.is_primary || image.is_cover)?.image_url ||
    images[0]?.image_url ||
    ""
  );
};

const listText = (items, key) => {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items
    .map((item) => (typeof item === "string" ? item : item?.[key]))
    .filter(Boolean);
};

function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={700}>{value || "-"}</Typography>
    </Box>
  );
}

export default function PropertyDetail() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProperty = async () => {
      setLoading(true);
      setError("");

      try {
        const payload = unwrap(await api.get(`/admin/properties/${propertyId}`));
        if (active) setProperty(payload);
      } catch (requestError) {
        if (active) setError(errorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProperty();

    return () => {
      active = false;
    };
  }, [propertyId]);

  const images = useMemo(() => property?.images || property?.property_images || [], [property]);
  const hero = primaryImage(property);
  const facilities = listText(property?.facilities, "facility_name");
  const rules = listText(property?.rules, "rule_text");

  if (loading) {
    return (
      <Stack sx={{ py: 8 }} alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Page title="Property" subtitle="Unable to load property details.">
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/properties")}>Back to properties</Button>
      </Page>
    );
  }

  if (!property) {
    return (
      <Page title="Property" subtitle="This property could not be found.">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/properties")}>Back to properties</Button>
      </Page>
    );
  }

  return (
    <Page
      title={property.title}
      subtitle={[property.city, property.state, property.country].filter(Boolean).join(", ")}
      action={<Stack direction="row" spacing={1}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/properties")}>Back</Button>
        <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/properties/${propertyId}/edit`)}>Edit</Button>
      </Stack>}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ overflow: "hidden" }}>
            {hero ? (
              <Box component="img" src={hero} alt={property.title} sx={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
            ) : (
              <Box sx={{ height: 360, bgcolor: "grey.100", display: "grid", placeItems: "center", color: "text.secondary" }}>
                No property image
              </Box>
            )}
            {images.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ p: 2, overflowX: "auto" }}>
                {images.slice(0, 8).map((image) => (
                  <Box
                    key={image.id || image.image_url}
                    component="img"
                    src={image.image_url}
                    alt=""
                    sx={{ width: 88, height: 64, objectFit: "cover", borderRadius: 1 }}
                  />
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip size="small" label={property.status || "pending"} color={property.status === "active" ? "success" : "default"} />
                <Chip size="small" label={property.is_available ? "Available" : "Unavailable"} variant="outlined" />
                {property.featured && <Chip size="small" label="Featured" color="primary" />}
              </Stack>

              <Typography variant="h5">{money(property.price_per_night, property.currency)} / night</Typography>
              <Typography color="text.secondary">{property.description || "No description provided."}</Typography>

              <Divider />
              <Grid container spacing={2}>
                <Grid item xs={6}><InfoItem label="Bedrooms" value={property.bedrooms} /></Grid>
                <Grid item xs={6}><InfoItem label="Bathrooms" value={property.bathrooms} /></Grid>
                <Grid item xs={6}><InfoItem label="Max guests" value={property.max_guests} /></Grid>
                <Grid item xs={6}><InfoItem label="Caution fee" value={money(property.caution_fee, property.currency)} /></Grid>
                <Grid item xs={6}><InfoItem label="Listing type" value={property.listing_type} /></Grid>
                <Grid item xs={6}><InfoItem label="Listing name" value={property.listing_name} /></Grid>
                <Grid item xs={12}><InfoItem label="Address" value={[property.location, property.city, property.state].filter(Boolean).join(", ")} /></Grid>
                <Grid item xs={12}><InfoItem label="Created" value={date(property.created_at)} /></Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>Host</Typography>
            <InfoItem label="Name" value={property.host?.full_name || [property.host?.first_name, property.host?.last_name].filter(Boolean).join(" ")} />
            <Box sx={{ mt: 2 }}>
              <InfoItem label="Host ID" value={property.host?.id} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>Location</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}><InfoItem label="Latitude" value={property.latitude} /></Grid>
              <Grid item xs={6}><InfoItem label="Longitude" value={property.longitude} /></Grid>
              <Grid item xs={12}><InfoItem label="Cancellation policy" value={property.cancellation_policy || "None"} /></Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Facilities</Typography>
            {facilities.length ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {facilities.map((facility) => <Chip key={facility} label={facility} />)}
              </Stack>
            ) : (
              <Typography color="text.secondary">No facilities listed.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>House rules</Typography>
            {rules.length ? (
              <Stack component="ul" sx={{ pl: 2, my: 0 }}>
                {rules.map((rule) => <Typography component="li" key={rule}>{rule}</Typography>)}
              </Stack>
            ) : (
              <Typography color="text.secondary">No house rules listed.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
}
