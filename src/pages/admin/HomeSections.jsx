import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import RowButton from "../../components/common/RowButton";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useApiList } from "../../hooks/useApiList";
import { api, errorMessage, unwrap } from "../../lib/api";
import { money } from "../../utils/formatters";
import { mutate } from "../../utils/mutate";

const sections = [
  { key: "featured", label: "Featured" },
  { key: "popular_locations", label: "Popular locations" },
  { key: "best_prices", label: "Best prices" },
  { key: "vacation_ideas", label: "Vacation ideas" },
  { key: "cheapest_deals", label: "Cheapest deals" },
  { key: "trending", label: "Trending" },
];

const propertyImage = (row) => {
  const property = row.property || row;
  const images = property?.images || property?.property_images || [];
  return property?.cover_image?.image_url || images.find((image) => image.is_primary || image.is_cover)?.image_url || images[0]?.image_url || "";
};

function PropertyThumb({ row }) {
  const image = propertyImage(row);
  const property = row.property || row;

  return image ? (
    <Box component="img" src={image} alt={property.title || "Property"} sx={{ width: 64, height: 48, objectFit: "cover", borderRadius: 1 }} />
  ) : (
    <Box sx={{ width: 64, height: 48, borderRadius: 1, bgcolor: "grey.100", color: "text.secondary", display: "grid", placeItems: "center", fontSize: 11 }}>
      No image
    </Box>
  );
}

export default function HomeSections() {
  const [section, setSection] = useState("featured");
  const [sectionsData, setSectionsData] = useState({});
  const [loadingSections, setLoadingSections] = useState(true);
  const [sectionError, setSectionError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [confirm, setConfirm] = useState(null);
  const { rows: properties, loading: loadingProperties, error: propertiesError } = useApiList("/admin/properties");

  const loadSections = async () => {
    setLoadingSections(true);
    setSectionError("");

    try {
      setSectionsData(unwrap(await api.get("/admin/homepage-sections")) || {});
    } catch (requestError) {
      setSectionError(errorMessage(requestError));
    } finally {
      setLoadingSections(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const rows = useMemo(() => sectionsData[section] || [], [sectionsData, section]);
  const selectedIds = useMemo(() => new Set(rows.map((row) => row.property?.id)), [rows]);
  const availableProperties = properties.filter((property) => !selectedIds.has(property.id));

  const addProperty = async () => {
    if (!selectedProperty) return;

    await mutate(api.post("/admin/homepage-sections", { section_key: section, property_id: selectedProperty }), "Property added", loadSections);
    setSelectedProperty("");
  };

  const removeProperty = async () => {
    if (!confirm) return;

    await mutate(api.delete(`/admin/homepage-sections/${section}/${confirm.property.id}`), "Property removed", loadSections);
    setConfirm(null);
  };

  return (
    <Page title="Home sections" subtitle="Choose which properties appear in each public homepage section.">
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Homepage section</InputLabel>
            <Select label="Homepage section" value={section} onChange={(event) => setSection(event.target.value)}>
              {sections.map((item) => <MenuItem key={item.key} value={item.key}>{item.label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 320 }}>
            <InputLabel>Add property</InputLabel>
            <Select label="Add property" value={selectedProperty} onChange={(event) => setSelectedProperty(event.target.value)} disabled={loadingProperties}>
              <MenuItem value="">Select a property</MenuItem>
              {availableProperties.map((property) => <MenuItem key={property.id} value={property.id}>{property.title}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" disabled={!selectedProperty} onClick={addProperty}>Add to section</Button>
        </Stack>
      </Paper>

      {(sectionError || propertiesError) && <Alert severity="error">{sectionError || propertiesError}</Alert>}

      <DataTable
        rows={rows}
        loading={loadingSections}
        columns={[
          { key: "image", label: "Image", render: (row) => <PropertyThumb row={row} /> },
          { key: "property.title", label: "Property" },
          { key: "property.city", label: "City" },
          { key: "property.price_per_night", label: "Nightly", render: (row) => money(row.property?.price_per_night) },
          { key: "property.status", label: "Status", render: (row) => <Chip size="small" label={row.property?.status || "pending"} /> },
          { key: "sort_order", label: "Order" },
        ]}
        actions={(row) => [
          <RowButton key="remove" title="Remove" color="error" icon={<DeleteIcon />} onClick={() => setConfirm(row)} />,
        ]}
      />

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Remove from homepage section?"
        message="This removes the property from this homepage section only. The property itself will not be deleted."
        confirmLabel="Remove"
        onClose={() => setConfirm(null)}
        onConfirm={removeProperty}
      />
    </Page>
  );
}
