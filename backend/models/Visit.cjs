// models/Visit.js
module.exports = (sequelize, DataTypes) => {
  const Visit = sequelize.define('Visit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    dateOfVisit: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    schoolName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING
    },
    contactPerson: {
      type: DataTypes.STRING
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    purchaseType: {
      type: DataTypes.STRING,
      defaultValue: 'Booklist'
    },
    booklistStatus: {
      type: DataTypes.STRING,
      defaultValue: 'Pending'
    },
    remarks: {
      type: DataTypes.TEXT
    },
    championId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'visits',
    timestamps: true
  });

  Visit.associate = (models) => {
    Visit.belongsTo(models.User, { foreignKey: 'championId', as: 'User' });
  };

  return Visit;
};