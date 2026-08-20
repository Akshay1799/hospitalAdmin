import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function InventoryPage() {
  return (
    <ModulePlaceholder
      title="Hospital Central Inventory & Stock"
      section="Supply & Assets"
      description="Stock level monitoring, bin locations, automated minimum threshold reorder alerts, and departmental stock issues."
      features={[
        "Barcode / QR-Code Bin & Shelf Management",
        "Low Stock & Critical Consumables Alerts",
        "Inter-Departmental Stock Indents & Transfers",
        "Stock Audit & Physical Reconciliation Log",
      ]}
    />
  );
}
