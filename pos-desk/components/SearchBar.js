export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search or scan barcode..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: "8px 10px", width: "100%", marginBottom: 12, borderRadius: 6, border: "1px solid #ccc" }}
    />
  );
}
