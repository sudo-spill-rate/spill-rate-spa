import BusinessCard from "../../../../components/common/BusinessCard";

/**
 * OwnerBusinessCard (Merchant Dashboard Variant)
 * Delegating proxy for backward compatibility.
 */
export default function OwnerBusinessCard(props) {
  return <BusinessCard variant="merchant" {...props} />;
}
