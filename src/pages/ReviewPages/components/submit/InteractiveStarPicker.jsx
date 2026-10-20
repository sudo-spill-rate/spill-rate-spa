import StarRating from "../../../../components/common/StarRating";

/**
 * InteractiveStarPicker
 * Delegating proxy for backward compatibility.
 */
export default function InteractiveStarPicker(props) {
  return <StarRating interactive showLabel size="lg" {...props} />;
}
