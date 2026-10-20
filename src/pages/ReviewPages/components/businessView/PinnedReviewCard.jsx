import CustomerReviewCard from "./CustomerReviewCard";

export default function PinnedReviewCard(props) {
  return <CustomerReviewCard {...props} isPinned={true} />;
}
