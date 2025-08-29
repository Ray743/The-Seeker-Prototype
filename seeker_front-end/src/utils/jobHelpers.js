export const getCategoryIcon = (category = "") => {
  switch (category.toLowerCase()) {
    case "design":
      return "fas fa-palette";
    case "development":
      return "fas fa-laptop-code";
    case "marketing":
      return "fas fa-chart-line";
    case "business":
      return "fas fa-briefcase";
    default:
      return "fas fa-briefcase";
  }
};

export const getCategoryColor = (category = "") => {
  switch (category.toLowerCase()) {
    case "design":
      return "purple";
    case "development":
      return "blue";
    case "marketing":
      return "green";
    case "business":
      return "yellow";
    default:
      return "gray";
  }
};
