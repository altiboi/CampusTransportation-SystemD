export function formatTimeAgo(timestamp) {
  const now = new Date();
  const notificationDate = new Date(timestamp);
  const diffMinutes = Math.floor((now - notificationDate) / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return notificationDate.toLocaleString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
    });
  } else {
    return notificationDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }
}
