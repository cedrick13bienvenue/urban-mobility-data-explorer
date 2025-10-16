import Trip from "./Trip";

// Export all models
export { Trip };

// Initialize model associations (if we had multiple models)
export const initializeModels = (): void => {
  // If we had relationships, we'd define them here
  // Example: User.hasMany(Trip);
};

export default {
  Trip,
};
