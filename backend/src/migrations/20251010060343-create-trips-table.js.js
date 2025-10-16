"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("trips", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      trip_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pickup_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dropoff_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      passenger_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pickup_longitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      pickup_latitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      dropoff_longitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      dropoff_latitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      store_and_fwd_flag: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
      trip_duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      trip_duration_minutes: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      trip_distance: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      trip_speed_kmh: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      hour_of_day: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      day_of_week: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_weekend: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      month_of_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_rush_hour: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      trip_category: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Create indexes for better query performance
    await queryInterface.addIndex("trips", ["trip_id"], {
      unique: true,
      name: "trips_trip_id_unique_idx",
    });

    await queryInterface.addIndex("trips", ["pickup_datetime"], {
      name: "trips_pickup_datetime_idx",
    });

    await queryInterface.addIndex("trips", ["dropoff_datetime"], {
      name: "trips_dropoff_datetime_idx",
    });

    await queryInterface.addIndex("trips", ["trip_distance"], {
      name: "trips_trip_distance_idx",
    });

    await queryInterface.addIndex("trips", ["trip_duration"], {
      name: "trips_trip_duration_idx",
    });

    await queryInterface.addIndex("trips", ["hour_of_day"], {
      name: "trips_hour_of_day_idx",
    });

    await queryInterface.addIndex("trips", ["day_of_week"], {
      name: "trips_day_of_week_idx",
    });

    await queryInterface.addIndex("trips", ["is_weekend"], {
      name: "trips_is_weekend_idx",
    });

    await queryInterface.addIndex("trips", ["month_of_year"], {
      name: "trips_month_of_year_idx",
    });

    await queryInterface.addIndex("trips", ["is_rush_hour"], {
      name: "trips_is_rush_hour_idx",
    });

    await queryInterface.addIndex("trips", ["vendor_id"], {
      name: "trips_vendor_id_idx",
    });

    await queryInterface.addIndex("trips", ["trip_category"], {
      name: "trips_trip_category_idx",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("trips");
  },
};
