import BusinessCard from "../../../../components/common/BusinessCard";

/**
 * StorefrontFeedCard (Explore Feed Variant)
 * Delegating proxy for backward compatibility.
 */
export default function StorefrontFeedCard(props) {
  return <BusinessCard variant="explore" {...props} />;
}
