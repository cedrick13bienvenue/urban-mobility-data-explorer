# Data Directory

This directory contains the raw NYC Taxi Trip dataset.

## Setup Instructions

1. Download the dataset from the provided link
2. Place the `train.csv` file in this directory
3. Run the data processing script:
   ```bash
   npm run process-data
   ```

## Dataset Information

- **Source**: NYC Taxi and Limousine Commission
- **Format**: CSV
- **Expected Columns**:
  - pickup_datetime
  - dropoff_datetime
  - pickup_longitude
  - pickup_latitude
  - dropoff_longitude
  - dropoff_latitude
  - passenger_count
  - trip_distance
  - fare_amount
  - tip_amount
  - total_amount
  - payment_type

## File Structure

```
data/
├── README.md        # This file
├── train.csv        # Raw dataset (you must provide)
└── .gitkeep         # Keeps directory in git
```

**Note**: The `train.csv` file is not tracked by git due to its large size.
