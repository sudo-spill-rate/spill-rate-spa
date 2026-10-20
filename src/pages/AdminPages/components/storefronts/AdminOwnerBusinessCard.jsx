import BusinessCard from "../../../../components/common/BusinessCard";

/**
 * AdminOwnerBusinessCard (Admin Storefronts Variant)
 * Delegating proxy for backward compatibility.
 */
export default function AdminOwnerBusinessCard(props) {
  return <BusinessCard variant="admin" {...props} />;
}
