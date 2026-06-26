import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, Chip, CircularProgress, Grid, Paper, Stack, TextField, Typography, FormControl, InputLabel, MenuItem, Select, FormControlLabel, Checkbox } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import toast from "react-hot-toast";
import Page from "../../components/common/Page";
import { api, errorMessage, unwrap } from "../../lib/api";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  city: "",
  state: "",
  country: "Nigeria",
  price_per_night: "",
  currency: "NGN",
  bedrooms: "",
  bathrooms: "",
  max_guests: "",
  caution_fee: "",
  status: "pending",
  featured: false,
  is_available: true,
  cancellation_policy: "",
  latitude: "",
  longitude: "",
  facilities: "",
  rules: "",
  house_rules: "",
};

const listText = (items, key) => Array.isArray(items)
  ? items.map((item) => (typeof item === "string" ? item : item?.[key])).filter(Boolean).join(", ")
  : "";

export default function PropertyEdit() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const property = unwrap(await api.get(`/admin/properties/${propertyId}`));
        if (!active) return;
        setImages(property.images || property.property_images || []);
        setForm({
          title: property.title || "",
          description: property.description || "",
          location: property.location || "",
          city: property.city || "",
          state: property.state || "",
          country: property.country || "Nigeria",
          price_per_night: property.price_per_night ?? "",
          currency: property.currency || "NGN",
          bedrooms: property.bedrooms ?? "",
          bathrooms: property.bathrooms ?? "",
          max_guests: property.max_guests ?? "",
          caution_fee: property.caution_fee ?? "",
          status: property.status || "pending",
          featured: Boolean(property.featured),
          is_available: property.is_available !== false,
          cancellation_policy: property.cancellation_policy || "",
          latitude: property.latitude ?? "",
          longitude: property.longitude ?? "",
          facilities: listText(property.facilities, "facility_name"),
          rules: listText(property.rules, "rule_text"),
          house_rules: property.house_rules || "",
        });
      } catch (requestError) {
        if (active) setError(errorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [propertyId]);

  const previewImages = useMemo(() => images.slice(0, 8), [images]);
  const update = (name) => (event) => setForm({ ...form, [name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "facilities" || key === "rules") return;
        if (value === "" && !["title", "location", "city", "state"].includes(key)) return;
        payload.append(key, typeof value === "boolean" ? (value ? "1" : "0") : String(value ?? ""));
      });
      payload.append("_method", "PATCH");
      form.facilities.split(",").map((item) => item.trim()).filter(Boolean).forEach((item) => payload.append("facilities[]", item));
      form.rules.split(",").map((item) => item.trim()).filter(Boolean).forEach((item) => payload.append("rules[]", item));
      newImages.forEach((file) => payload.append("images[]", file));

      await toast.promise(api.post(`/properties/${propertyId}`, payload), {
        loading: "Saving property...",
        success: "Property updated",
        error: (requestError) => errorMessage(requestError),
      });
      navigate(`/properties/${propertyId}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Stack sx={{ py: 8 }} alignItems="center"><CircularProgress /></Stack>;

  return (
    <Page
      title="Edit property"
      subtitle="Update listing details, status, amenities, rules, location, pricing, and append images."
      action={<Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/properties/${propertyId}`)}>Back</Button>}
    >
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Box component="form" onSubmit={submit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}><TextField label="Title" required fullWidth value={form.title} onChange={update("title")} /></Grid>
                <Grid item xs={12}><TextField label="Description" multiline minRows={4} fullWidth value={form.description} onChange={update("description")} /></Grid>
                <Grid item xs={12}><TextField label="Address" required fullWidth value={form.location} onChange={update("location")} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="City" required fullWidth value={form.city} onChange={update("city")} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="State" required fullWidth value={form.state} onChange={update("state")} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Country" fullWidth value={form.country} onChange={update("country")} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Price per night" type="number" required fullWidth value={form.price_per_night} onChange={update("price_per_night")} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Caution fee" type="number" fullWidth value={form.caution_fee} onChange={update("caution_fee")} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Currency" fullWidth value={form.currency} onChange={update("currency")} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Bedrooms" type="number" fullWidth value={form.bedrooms} onChange={update("bedrooms")} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Bathrooms" type="number" fullWidth value={form.bathrooms} onChange={update("bathrooms")} /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Max guests" type="number" fullWidth value={form.max_guests} onChange={update("max_guests")} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Latitude" type="number" fullWidth value={form.latitude} onChange={update("latitude")} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Longitude" type="number" fullWidth value={form.longitude} onChange={update("longitude")} /></Grid>
                <Grid item xs={12}><TextField label="Facilities" helperText="Comma-separated" fullWidth value={form.facilities} onChange={update("facilities")} /></Grid>
                <Grid item xs={12}><TextField label="House rules" helperText="Comma-separated" fullWidth value={form.rules} onChange={update("rules")} /></Grid>
                <Grid item xs={12}><TextField label="Additional house rules" multiline minRows={3} fullWidth value={form.house_rules} onChange={update("house_rules")} /></Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Paper sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status" value={form.status} onChange={update("status")}>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="Cancellation policy" fullWidth value={form.cancellation_policy} onChange={update("cancellation_policy")} />
                  <FormControlLabel control={<Checkbox checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />} label="Featured" />
                  <FormControlLabel control={<Checkbox checked={form.is_available} onChange={(event) => setForm({ ...form, is_available: event.target.checked })} />} label="Available" />
                  <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
                </Stack>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Images</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  {previewImages.map((image) => <Box key={image.id || image.image_url} component="img" src={image.image_url} alt="" sx={{ width: 74, height: 56, borderRadius: 1, objectFit: "cover" }} />)}
                  {!previewImages.length && <Chip label="No images yet" />}
                </Stack>
                <Button component="label" variant="outlined">
                  Add images
                  <input hidden type="file" accept="image/*" multiple onChange={(event) => setNewImages(Array.from(event.target.files || []))} />
                </Button>
                {newImages.length ? <Typography sx={{ mt: 1 }} variant="caption">{newImages.length} new image(s) selected</Typography> : null}
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
}
